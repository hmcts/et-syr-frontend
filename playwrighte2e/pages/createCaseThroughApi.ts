// @ts-nocheck
import querystring from 'querystring';

import axios from 'axios';
import * as OTPAuth from 'totp-generator';

import engCase from '../data/et-england-case-data.json';
import scotCase from '../data/et-scotland-case-data.json';
import { params } from '../utils/config';

import { BasePage } from './basePage';

const env = params.TestEnv;
const idamBaseUrl = `https://idam-api.${env}.platform.hmcts.net/loginUser`;
const syaApiBaseUrl = `http://et-sya-api-${env}.service.core-compute-${env}.internal`;
const getUserIdurl = `https://idam-api.${env}.platform.hmcts.net/details`;
const s2sBaseUrl = 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/testing-support/lease';
const ccdApiUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
const engCasePayload = engCase.data;
const scotCasePayload = scotCase.data;
const location = 'ET_EnglandWales';

export default class CreateCaseThroughApi extends BasePage {
  async processCaseToAcceptedState(caseType: string, location: string) {
    // Login to IDAM to get the authentication token
    const authToken = await this.getAuthToken(params.TestEnvApiUser, params.TestEnvApiPassword);
    const serviceToken = await this.getS2SServiceToken();

    //Getting the User Id based on the Authentication Token that is passed for this User.
    const userId = await this.getUserDetails(authToken);
    const token = await this.createACaseGetRequest(authToken, serviceToken, userId, location);
    const case_id = await this.createACasePostRequest(caseType, authToken, serviceToken, userId, token, location);
    console.log('case Id is:' + case_id);
    const response = await this.performCaseVettingEventGetRequest(authToken, serviceToken, case_id);
    await this.performCaseVettingEventPostRequest(authToken, serviceToken, case_id, response);
    //Initiate accept case
    // const acceptCaseToken= await this.acceptTheCaseEventFirstRequest(authToken, serviceToken, case_id);
    // console.log('token to accept the case:' +acceptCaseToken);
    //await this.acceptTheCaseEventSecondRequest(authToken, serviceToken, case_id, acceptCaseToken);
    return case_id;
  }

  async processCuiCaseToAcceptedState() {
    // Login to IDAM to get the authentication token
    const authToken = await this.getAuthToken(params.TestEnvETClaimantEmailAddress, params.TestEnvETClaimantPassword);

    // Create a draft case
    const case_id = await this.createADraftCuiCasePostRequest(authToken);
    console.log('case Id is:' + case_id);

    // Update and submit the draft case
    const updateResponse = await this.submitDraftCuiCase(authToken, case_id, 'update');
    console.log('CUI case updated successfully:' + updateResponse.data);

    const submitResponse = await this.submitDraftCuiCase(authToken, case_id, 'submit');
    console.log('CUI case submitted successfully:' + submitResponse.data);
    return case_id;
  }

  async getAuthToken(username: string, password: string) {
    let access_token;
    const data = querystring.stringify({
      username,
      password,
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: idamBaseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };
    return await axios.request(config).then(response => {
      console.log(JSON.stringify(response.data));
      access_token = response.data.access_token;
      return access_token;
    });
  }

  async getS2SServiceToken() {
    let serviceToken;
    const oneTimepwd = OTPAuth.TOTP.generate(params.TestCcdGwSecret, { digits: 6, period: 30 }).otp;
    console.log('checking OTP => :' + oneTimepwd);

    const data = JSON.stringify({
      microservice: 'xui_webapp',
      oneTimePassword: oneTimepwd,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: s2sBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    return await axios
      .request(config)
      .then(response => {
        console.log('s2s response is :' + JSON.stringify(response.data));
        return (serviceToken = response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async getUserDetails(authToken) {
    let userId;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: getUserIdurl,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    return await axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        return (userId = response.data.id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async createACaseGetRequest(authToken, serviceToken, userId, location) {
    const ccdStartCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/${location}/event-triggers/initiateCase/token`;

    const initiateCaseUrl = ccdApiUrl + ccdStartCasePath;
    let initiateEventToken;

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: initiateCaseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `${serviceToken}`, //may be bearer word not needed
        'Content-Type': 'application/json',
      },
    };

    return await axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        return (initiateEventToken = response.data.token);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async createACasePostRequest(caseType, authToken, serviceToken, userId, initiateEventToken, location) {
    const ccdSaveCasePath = `/caseworkers/${userId}/jurisdictions/EMPLOYMENT/case-types/${location}/cases?ignore-warning=false`;
    const createCaseUrl = ccdApiUrl + ccdSaveCasePath;
    let dataPayload;

    const payloadMap: { [key: string]: any } = {
      England: engCasePayload,
      Scotland: scotCasePayload,
    };

    dataPayload = payloadMap[caseType] || new Error('Unsupported case type');

    //start case creation
    const createCasetemp = {
      data: dataPayload,
      event: {
        id: 'initiateCase',
        summary: 'Creating Case',
        description: 'For ExUI/CUI Playwright E2E Test',
      },
      event_token: initiateEventToken,
    };

    const createCaseBody = `${JSON.stringify(createCasetemp)}`;

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: createCaseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
        experimental: 'true',
      },
      data: createCaseBody,
    };

    let case_id;
    return await axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        return (case_id = response.data.id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async createADraftCuiCasePostRequest(authToken) {
    const cuiDraftCasePath = '/cases/initiate-case/';
    const createCaseUrl = syaApiBaseUrl + cuiDraftCasePath;

    //start case creation
    const createCaseBody = {
      case_type_id: 'ET_EnglandWales',
      case_data: {
        caseType: 'Single',
        caseSource: 'Manually Created',
      },
    };

    // let createCaseBody = `${JSON.stringify(createCasetemp)}`;

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: createCaseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: createCaseBody,
    };

    let case_id;
    return await axios
      .request(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        return (case_id = response.data.id);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async submitDraftCuiCase(authToken, case_id, methodType) {
    const updateCaseUrl = `${syaApiBaseUrl}/cases/${methodType}-case/`;
    //start case creation
    const updateCaseBody = {
      case_id: case_id.toString(),
      case_type_id: 'ET_EnglandWales',
      case_data: engCasePayload,
    };

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: updateCaseUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: updateCaseBody,
    };

    return await axios
      .request(config)
      .then(response => {
        console.log('CUI Updated case is :' + JSON.stringify(response.data));
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async performCaseVettingEventGetRequest(authToken, serviceToken, case_id) {
    // initiate et1 vetting
    const initiateEvent = `/cases/${case_id}/event-triggers/et1Vetting?ignore-warning=false`;

    const et1VettingUrl = ccdApiUrl + initiateEvent;

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: et1VettingUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceToken}`,
        'Content-Type': 'application/json',
      },
    };

    return await axios
      .request(config)
      .then(response => {
        console.log('ET1 vetting response:' + JSON.stringify(response.data));
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async performCaseVettingEventPostRequest(authToken, serviceToken, case_id, response) {
    // execute et1 vetting
    const execuEt1teUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal/cases/${case_id}/events`;

    const executeEventBody = {
      data: response.case_details.case_data,
      data_classification: response.case_details.data_classification,
      event: {
        id: 'et1Vetting',
        summary: 'Vetting a Case',
        description: 'For ExUI/CUI Playwright E2E Test',
      },
      event_token: response.token,
      ignore_warning: false,
      draft_id: null,
    };
    const executeEt1payload = JSON.stringify(executeEventBody);
    console.log('vetiing body => ' + executeEt1payload);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: execuEt1teUrl,
      headers: {
        Authorization: `Bearer ${authToken}`,
        ServiceAuthorization: `Bearer ${serviceToken}`,
        experimental: true,
        'Content-Type': 'application/json',
      },
      data: executeEt1payload,
    };

    console.log('... executing et1Vetting event ...');
    axios
      .request(config)
      .then(response => {
        console.log('et1 vetting completed successfully...' + JSON.stringify(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }
}
