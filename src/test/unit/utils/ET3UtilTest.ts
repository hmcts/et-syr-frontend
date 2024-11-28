import axios from 'axios';
import _ from 'lodash';

import { CaseWithId, RespondentET3Model } from '../../../main/definitions/case';
import {
  DefaultValues,
  PageUrls,
  ServiceErrors,
  TranslationKeys,
  ValidationErrors,
} from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { ET3HubLinkNames, ET3HubLinksStatuses, LinkStatus } from '../../../main/definitions/links';
import { AnyRecord } from '../../../main/definitions/util-types';
import caseListJsonRaw from '../../../main/resources/locales/en/translation/case-list.json';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { mockApplications } from '../mocks/mockApplications';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockedForm } from '../mocks/mockForm';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

let request: ReturnType<typeof mockRequest>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(axios);
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');
const translationJsons = { ...caseListJsonRaw, ...commonJsonRaw };
describe('ET3lUtil tests', () => {
  request = mockRequest({
    session: {
      userCase: {
        respondents: [{ respondentName: 'Test Respondent' }],
      },
    },
  });
  const response = mockResponse();
  describe('Find selected respondent function test', () => {
    test('Should find selected respondent with given correct data', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.params = { ccdId: '1234' };
      request.session.userCase.respondents[0].ccdId = '1234';
      const selectedRespondentIndex = ET3Util.findSelectedRespondentIndex(request);
      expect(selectedRespondentIndex).toStrictEqual(0);
    });

    test('Should set session user case error when user case is undefined', () => {
      request.session.userCase = undefined;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER_CASE_NOT_FOUND);
    });

    test('Should set session user error when user case is undefined', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = undefined;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[request.session.errors.length - 1].errorType).toEqual(
        ValidationErrors.SESSION_USER
      );
    });

    test('Should set session respondent error when user case respondent collection is empty', () => {
      request.session.userCase = mockValidCaseWithId;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_RESPONDENT);
    });

    test('Should set session userid error when user user id is invalid', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = DefaultValues.STRING_SPACE;
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.USER_ID_NOT_FOUND);
    });

    test('Should set respondent not found error when user id and respondent idamId not matches', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = '123';
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.RESPONDENT_INDEX_NOT_FOUND);
    });
  });

  describe('Update ET3 data function test', () => {
    test('Should not update ET3 data when not able to modify user case', async () => {
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      getCaseApiMock.mockReturnValue(api);
      api.modifyEt3Data = jest.fn().mockImplementation(() => {
        throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE);
      });
      await ET3Util.updateET3Data(request, ET3HubLinkNames.ContactDetails, LinkStatus.IN_PROGRESS);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.API);
    });
    describe('Update ET3 Response With ET3Form test', () => {
      test('Should not update ET3 Form when error occurs while updating ET3Data', async () => {
        request.session.userCase = mockCaseWithIdWithRespondents;
        request.session.user = mockUserDetails;
        request.session.selectedRespondentIndex = 0;
        request.body = {};
        request.url = '/dummy-url';
        getCaseApiMock.mockReturnValue(api);
        await ET3Util.updateET3ResponseWithET3Form(
          request,
          response,
          mockedForm,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS,
          PageUrls.RESPONSE_SAVED,
          []
        );
        expect(request.session.errors[0].errorType).toEqual(ValidationErrors.API);
      });

      test('Should redirect to claim saved when request is save for later', async () => {
        request.session.userCase = mockCaseWithIdWithRespondents;
        request.session.user = mockUserDetails;
        request.session.selectedRespondentIndex = 0;
        request.body = {};
        request.body.saveForLater = true;
        request.url = '/dummy-url';
        getCaseApiMock.mockReturnValue(api);
        updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
        await ET3Util.updateET3ResponseWithET3Form(
          request,
          response,
          mockedForm,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS,
          PageUrls.RESPONSE_SAVED,
          []
        );
        expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONSE_SAVED);
      });
    });
  });
  describe('Find selected respondent by case with id tests', () => {
    test('Should not find selected respondent when session user does not have id', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.user.id = undefined;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = DefaultValues.STRING_SPACE;
      ET3Util.findSelectedRespondentIndex(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.USER_ID_NOT_FOUND);
    });
  });
  describe('getOverallStatus when user case has type of claim breach of contract', () => {
    request = mockRequestWithTranslation(
      {
        session: {
          userCase: {
            respondents: [
              {
                respondentName: 'John Doe',
              },
            ],
          },
        },
      },
      translationJsons
    );
    const translations: AnyRecord = {
      ...request.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };
    const respondent: RespondentET3Model = _.cloneDeep(mockRespondentET3Model);
    const userCase: CaseWithId = _.cloneDeep(mockCaseWithIdWithRespondents);
    userCase.typeOfClaim = [TypesOfClaim.BREACH_OF_CONTRACT];
    respondent.et3HubLinksStatuses = new ET3HubLinksStatuses();
    test('Should 0 of 6 tasks completed when et3 hub link statuses does not have any completed task', () => {
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('0 of 6 tasks completed');
    });
    test('Should 1 of 6 tasks completed when et3 hub link statuses have 1 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('1 of 6 tasks completed');
    });
    test('Should 2 of 6 tasks completed when et3 hub link statuses have 2 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('2 of 6 tasks completed');
    });
    test('Should 3 of 6 tasks completed when et3 hub link statuses have 3 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('3 of 6 tasks completed');
    });
    test('Should 4 of 6 tasks completed when et3 hub link statuses have 4 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('4 of 6 tasks completed');
    });
    test('Should 5 of 6 tasks completed when et3 hub link statuses have 5 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('5 of 6 tasks completed');
    });
    test('Should 6 of 6 tasks completed when et3 hub link statuses have 6 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployersContractClaim] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('6 of 6 tasks completed');
    });
  });
  describe('getOverallStatus when user case does not have type of claim breach of contract', () => {
    request = mockRequestWithTranslation(
      {
        session: {
          userCase: {
            respondents: [
              {
                respondentName: 'John Doe',
              },
            ],
          },
        },
      },
      translationJsons
    );
    const translations: AnyRecord = {
      ...request.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };
    const respondent: RespondentET3Model = _.cloneDeep(mockRespondentET3Model);
    const userCase: CaseWithId = _.cloneDeep(mockCaseWithIdWithRespondents);
    userCase.typeOfClaim = [TypesOfClaim.DISCRIMINATION];
    respondent.et3HubLinksStatuses = new ET3HubLinksStatuses();
    test('Should 0 of 5 tasks completed when et3 hub link statuses does not have any completed task', () => {
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('0 of 5 tasks completed');
    });
    test('Should 1 of 5 tasks completed when et3 hub link statuses have 1 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('1 of 5 tasks completed');
    });
    test('Should 2 of 5 tasks completed when et3 hub link statuses have 2 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('2 of 5 tasks completed');
    });
    test('Should 3 of 5 tasks completed when et3 hub link statuses have 3 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('3 of 5 tasks completed');
    });
    test('Should 4 of 5 tasks completed when et3 hub link statuses have 4 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('4 of 5 tasks completed');
    });
    test('Should 5 of 5 tasks completed when et3 hub link statuses have 5 completed task', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCase, respondent, translations)).toEqual('5 of 5 tasks completed');
    });
    test('Should 5 of 5 tasks completed when userCase is empty', () => {
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(undefined, respondent, translations)).toEqual('5 of 5 tasks completed');
    });
    test('Should 5 of 5 tasks completed when userCase type of claim is empty', () => {
      const userCaseEmptyTypeOfClaim = _.cloneDeep(mockCaseWithIdWithRespondents);
      userCaseEmptyTypeOfClaim.typeOfClaim = [];
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContactDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.EmployerDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ContestClaim] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.PayPensionBenefitDetails] = LinkStatus.COMPLETED;
      respondent.et3HubLinksStatuses[ET3HubLinkNames.ConciliationAndEmployeeDetails] = LinkStatus.COMPLETED;
      expect(ET3Util.getOverallStatus(userCaseEmptyTypeOfClaim, respondent, translations)).toEqual(
        '5 of 5 tasks completed'
      );
    });
  });
  describe('getUserNameByRespondent tests', () => {
    test('Should return empty string when respondent is not found', () => {
      expect(ET3Util.getUserNameByRespondent(undefined)).toEqual(DefaultValues.STRING_EMPTY);
    });
    test('Should return respondent name when respondent name is found in respondent object', () => {
      expect(ET3Util.getUserNameByRespondent(mockRespondentET3Model)).toEqual('Test Company');
    });
    test('Should return organisation name when respondent organisation name is found in respondent object', () => {
      const respondent = _.cloneDeep(mockRespondentET3Model);
      respondent.respondentName = undefined;
      respondent.respondentOrganisation = 'Test Company';
      expect(ET3Util.getUserNameByRespondent(respondent)).toEqual('Test Company');
    });
    test('Should return empty string when nothing found as name in respondent object', () => {
      const respondent = _.cloneDeep(mockRespondentET3Model);
      respondent.respondentName = undefined;
      respondent.respondentOrganisation = undefined;
      respondent.respondentFirstName = undefined;
      respondent.respondentLastName = undefined;
      expect(ET3Util.getUserNameByRespondent(respondent)).toEqual(DefaultValues.STRING_EMPTY);
    });
    test('Should return respondent first name when respondent first name is found in respondent object', () => {
      const respondent = _.cloneDeep(mockRespondentET3Model);
      respondent.respondentName = undefined;
      respondent.respondentOrganisation = undefined;
      respondent.respondentFirstName = 'Respondent First Name';
      expect(ET3Util.getUserNameByRespondent(respondent)).toEqual('Respondent First Name');
    });
    test('Should return respondent first and last names when respondent first and last names are found in respondent object', () => {
      const respondent = _.cloneDeep(mockRespondentET3Model);
      respondent.respondentName = undefined;
      respondent.respondentOrganisation = undefined;
      respondent.respondentFirstName = 'Respondent First Name';
      respondent.respondentLastName = 'Respondent Last Name';
      expect(ET3Util.getUserNameByRespondent(respondent)).toEqual('Respondent First Name Respondent Last Name');
    });
    test('Should return respondent last name when respondent last name is found in respondent object', () => {
      const respondent = _.cloneDeep(mockRespondentET3Model);
      respondent.respondentName = undefined;
      respondent.respondentOrganisation = undefined;
      respondent.respondentFirstName = undefined;
      respondent.respondentLastName = 'Respondent Last Name';
      expect(ET3Util.getUserNameByRespondent(respondent)).toEqual('Respondent Last Name');
    });
  });
  describe('getUserApplicationsListItem', () => {
    test('Should return user applications list item for the given application, respondent name and respondent', () => {
      expect(ET3Util.getUserApplicationsListItem(mockApplications[0], 'test name', mockRespondentET3Model)).toEqual([
        {
          text: 'September 1, 2022',
        },
        {
          text: '12345',
        },
        {
          text: 'discrimination',
        },
        {
          text: 'test name',
        },
        {},
        {
          text: 'September 1, 2022',
        },
        {
          caseDetailsLink: '/case-details',
          caseId: '12345',
          respondentCcdId: '180d5b45-7925-420a-9bb4-3f6d501ca7a8',
        },
      ]);
    });
  });
});
