import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, LegacyUrls, PageUrls, languages } from '../../../main/definitions/constants';
import UrlUtils from '../../../main/utils/UrlUtils';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';

describe('UrlUtils tests', () => {
  const t = {
    common: {},
  };
  const request: AppRequest = mockRequest({ t });
  request.url = 'http://localhost:8080';
  test('getCaseDetailsUrlByRequest returns a valid URL', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 0;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual('/case-details/1234/3453xaa?lng=en');
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have selected index', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have user case', () => {
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondents are empty', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents = [];
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondent not found by selected index', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 110;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  describe('removeParameterFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?test=test&lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: '',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: ' ',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: undefined,
        result: 'https://localhost:3003/employers-contract-claim',
      },
      { url: undefined, parameter: 'redirect=clearSelection', result: undefined },
      { url: DefaultValues.STRING_SPACE, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_SPACE },
      { url: DefaultValues.STRING_EMPTY, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_EMPTY },
    ])('check if given parameter is removed from url: %o', ({ url, parameter, result }) => {
      expect(UrlUtils.removeParameterFromUrl(url, parameter)).toStrictEqual(result);
    });
  });
  describe('getRequestParamsFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        result: ['redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        result: ['redirect=clearSelection', 'lng=cy', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        result: ['redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        result: ['lng=cy', 'test=test', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        result: ['lng=cy', 'redirect=clearSelection', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        result: ['test=test', 'redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        result: ['lng=cy', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        result: [],
      },
      { url: undefined, result: [] },
      { url: DefaultValues.STRING_SPACE, result: [] },
      { url: DefaultValues.STRING_EMPTY, result: [] },
    ])('check if given urls parameters are listed as string list: %o', ({ url, result }) => {
      expect(UrlUtils.getRequestParamsFromUrl(url)).toStrictEqual(result);
    });
  });
  describe('findParameterWithValueByParameterName tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        parameterName: 'redirectInvalid',
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      { url: undefined, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_EMPTY, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_SPACE, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: undefined,
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: DefaultValues.STRING_EMPTY,
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: DefaultValues.STRING_SPACE,
        result: DefaultValues.STRING_EMPTY,
      },
    ])('check if given urls parameters are listed as string list: %o', ({ url, parameterName, result }) => {
      expect(UrlUtils.findParameterWithValueByParameterName(url, parameterName)).toStrictEqual(result);
    });
  });
  describe('getNotAllowedEndPointsForwardingUrlByRequest tests', () => {
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request is undefined', () => {
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(undefined)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session user case is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session user case id is empty', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.userCase.id = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when selected respondent is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when selected respondent ccdId is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      req.session.userCase.respondents[0].ccdId = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case details page', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
          DefaultValues.STRING_SLASH +
          req.session.userCase.id +
          DefaultValues.STRING_SLASH +
          req.session.userCase.respondents[0].ccdId +
          languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case details page with welsh language parameter if request url is welsh', () => {
      const req: AppRequest = mockRequest({});
      req.url = 'https://localhost:8080?lng=cy';
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
          DefaultValues.STRING_SLASH +
          req.session.userCase.id +
          DefaultValues.STRING_SLASH +
          req.session.userCase.respondents[0].ccdId +
          languages.WELSH_URL_PARAMETER
      );
    });
  });
  describe('isUrl', () => {
    it.each([
      { url: 'https://localhost:3003/', result: true },
      { url: 'https://www.test.com', result: true },
      { url: 'https://www.test.com/info', result: true },
      { url: 'https://www.test.com/info?xxx', result: true },
      { url: 'https://www.test.com/info?xxx=xxx', result: true },
      { url: 'https://www.test.com/info?xxx=xxx&yyyy', result: true },
      { url: 'https://www.test.com/info?xxx=xxx&yyyy=', result: true },
      { url: 'https://www.test.com/info?xxx=xxx&yyyy=&', result: true },
      { url: 'https://www.test.com/info?xxx=xxx&yyyy=&zzz=zzzz', result: true },
      { url: 'https://localhost:3003/test-url-path1', result: true },
      { url: 'https://localhost:3003/test-url-path1?redirect=clearSelection', result: true },
      { url: 'https://localhost:3003/test-url-path1?lng=cy&test=test&redirect=clearSelection', result: true },
      {
        url: 'https://localhost:3003/test-url-path1/test-url-path2?lng=cy&redirect=clearSelection&test=test',
        result: true,
      },
      { url: 'http://localhost:3003/', result: true },
      { url: 'http://www.test.com', result: true },
      { url: 'http://www.test.com/info', result: true },
      { url: 'http://www.test.com/info?xxx', result: true },
      { url: 'http://www.test.com/info?xxx=xxx', result: true },
      { url: 'http://www.test.com/info?xxx=xxx&yyyy', result: true },
      { url: 'http://www.test.com/info?xxx=xxx&yyyy=', result: true },
      { url: 'http://www.test.com/info?xxx=xxx&yyyy=&', result: true },
      { url: 'http://www.test.com/info?xxx=xxx&yyyy=&zzz=zzzz', result: true },
      { url: 'http://localhost:3003/test-url-path1', result: true },
      { url: 'http://localhost:3003/test-url-path1?redirect=clearSelection', result: true },
      { url: 'http://localhost:3003/test-url-path1?lng=cy&test=test&redirect=clearSelection', result: true },
      {
        url: 'localhost:3003/test-url-path1/test-url-path2?lng=cy&redirect=clearSelection&test=test',
        result: true,
      },
      { url: 'localhost:3003', result: true },
      { url: 'localhost:3003/', result: true },
      { url: 'localhost:3003/info', result: true },
      { url: 'localhost:3003/info?xxx', result: true },
      { url: 'localhost:3003/info?xxx=xxx', result: true },
      { url: 'localhost:3003/info?xxx=xxx&yyyy', result: true },
      { url: 'localhost:3003/info?xxx=xxx&yyyy=', result: true },
      { url: 'localhost:3003/info?xxx=xxx&yyyy=&', result: true },
      { url: 'localhost:3003/info?xxx=xxx&yyyy=&zzz=zzz', result: true },
      { url: 'localhost:3003/test-url-path1', result: true },
      { url: 'localhost:3003/test-url-path1?redirect=clearSelection', result: true },
      { url: 'localhost:3003/test-url-path1?lng=cy&test=test&redirect=clearSelection', result: true },
      {
        url: 'localhost:3003/test-url-path1/test-url-path2?lng=cy&redirect=clearSelection&test=test',
        result: true,
      },
      { url: 'www.test.com', result: false },
      { url: 'www.test.com/info', result: false },
      { url: '/www.test.com', result: false },
      { url: '/www.test.com/info', result: false },
      { url: '/localhost:3003/', result: false },
      { url: '/localhost:3003/info', result: false },
      { url: 'test-url', result: false },
      { url: '/test-url', result: false },
    ])('check if given url is valid: %o', ({ url, result }) => {
      expect(UrlUtils.isUrl(url)).toStrictEqual(result);
    });
  });
  describe('containsValidUrl', () => {
    const DUMMY_URL_PARAMETER = '?param1=value1&param2=value2&param3=value3';
    it.each([
      { url: PageUrls.NOT_IMPLEMENTED + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.HOME + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.NOT_FOUND + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.HOLDING_PAGE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECKLIST + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CASE_NUMBER_CHECK + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.REMOVE_FILE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.SELF_ASSIGNMENT_FORM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CASE_LIST_CHECK + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.SELF_ASSIGNMENT_CHECK + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CASE_LIST + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.DOCUMENTS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.YOUR_RESPONSE_FORM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CASE_DETAILS_WITH_CASE_ID_RESPONDENT_CCD_ID_PARAMETERS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.COOKIE_PREFERENCES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.APPLICATION_SUBMITTED + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONSE_SAVED + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_ET3 + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.NEW_SELF_ASSIGNMENT_REQUEST + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_ET1_FORM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_RESPONSE_LANDING + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_RESPONSE_TASK_LIST + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_NAME + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.TYPE_OF_ORGANISATION + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_ADDRESS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_ENTER_POST_CODE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_SELECT_POST_CODE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_ENTER_ADDRESS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_DX_ADDRESS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_CONTACT_PREFERENCES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.HEARING_PREFERENCES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.REASONABLE_ADJUSTMENTS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_EMPLOYEES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_SITES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_SITE_EMPLOYEES, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_EMPLOYMENT_DATES + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_JOB_TITLE + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_PAY_DETAILS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_PAY_DETAILS_ENTER + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_NOTICE_PERIOD + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CLAIMANT_PENSION_AND_BENEFITS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_CONTEST_CLAIM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.EMPLOYERS_CONTRACT_CLAIM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.GET_CASE_DOCUMENT + DUMMY_URL_PARAMETER, result: true },
      { url: PageUrls.GET_SUPPORTING_MATERIAL + DUMMY_URL_PARAMETER, result: true },
      { url: LegacyUrls.SIGN_IN, result: true },
      { url: LegacyUrls.SIGN_UP, result: true },
      { url: '/dummy-url', result: false },
    ])('check if given url is one of {@PageURLs} or {@LegacyUrls}: %o', ({ url, result }) => {
      expect(UrlUtils.isValidUrl(url)).toStrictEqual(result);
    });
  });
});
