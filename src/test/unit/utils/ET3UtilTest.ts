import axios from 'axios';

import { DefaultValues, PageUrls, ServiceErrors, ValidationErrors } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { formatApiCaseDataToCaseWithId } from '../../../main/helpers/ApiFormatter';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseApiDataResponse } from '../mocks/mockCaseApiDataResponse';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockedForm } from '../mocks/mockForm';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

let request: ReturnType<typeof mockRequest>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(axios);
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

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
      request.session.selectedRespondentIndex = 0;
      const selectedRespondent = ET3Util.findSelectedRespondent(request);
      expect(selectedRespondent).toBeDefined();
    });

    test('Should set session user case error when user case is undefined', () => {
      request.session.userCase = undefined;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER_CASE);
    });

    test('Should set session user error when user case is undefined', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = undefined;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[request.session.errors.length - 1].errorType).toEqual(
        ValidationErrors.SESSION_USER
      );
    });

    test('Should set session respondent error when user case respondent collection is empty', () => {
      request.session.userCase = mockValidCaseWithId;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_RESPONDENT);
    });

    test('Should set session userid error when user user id is invalid', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = DefaultValues.STRING_SPACE;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.USER_ID);
    });

    test('Should set respondent not found error when user id and respondent idamId not matches', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = '123';
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.RESPONDENT_NOT_FOUND);
    });
  });

  describe('Update ET3 data function test', () => {
    test('Should update ET3 data', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      getCaseApiMock.mockReturnValue(api);
      api.modifyEt3Data = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
      const caseWithId = await ET3Util.updateET3Data(request, ET3HubLinkNames.ContactDetails, LinkStatus.IN_PROGRESS);
      expect(caseWithId).toEqual(formatApiCaseDataToCaseWithId(mockCaseApiDataResponse));
    });

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
          PageUrls.CLAIM_SAVED,
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
          PageUrls.CLAIM_SAVED,
          []
        );
        expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
      });
    });
  });
  describe('Find selected respondent by case with id tests', () => {
    test('Should not find selected respondent when case with id is empty', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentByCaseWithId(request, undefined);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER_CASE);
    });

    test('Should not find selected respondent when request session user is undefined', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = undefined;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentByCaseWithId(request, mockCaseWithIdWithRespondents);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER);
    });

    test('Should not find selected respondent when case with id does not have any respondent', () => {
      request.session.userCase = mockValidCaseWithId;
      request.session.user = mockUserDetails;
      request.session.selectedRespondentIndex = 0;
      ET3Util.findSelectedRespondentByCaseWithId(request, mockValidCaseWithId);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_RESPONDENT);
    });

    test('Should not find selected respondent when session user does not have id', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.user.id = undefined;
      request.session.selectedRespondentIndex = 0;
      request.session.user.id = DefaultValues.STRING_SPACE;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.USER_ID);
    });
  });
});
