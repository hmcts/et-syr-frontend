import axios from 'axios';

import { DefaultValues, ServiceErrors, ValidationErrors } from '../../../main/definitions/constants';
import { formatApiCaseDataToCaseWithId } from '../../../main/helpers/ApiFormatter';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseApiDataResponse } from '../mocks/mockCaseApiDataResponse';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockEt3RespondentType } from '../mocks/mockEt3Respondent';
import { mockRequest } from '../mocks/mockRequest';
import { mockUserDetails } from '../mocks/mockUser';

let request: ReturnType<typeof mockRequest>;
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const api = new CaseApi(axios);

describe('ET3lUtil tests', () => {
  request = mockRequest({
    session: {
      userCase: {
        respondents: [{ respondentName: 'Test Respondent' }],
      },
    },
  });
  describe('Find selected respondent function test', () => {
    test('Should find selected respondent with given correct data', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      const selectedRespondent = ET3Util.findSelectedRespondent(request);
      expect(selectedRespondent).toBeDefined();
    });

    test('Should set session user case error when user case is undefined', () => {
      request.session.userCase = undefined;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER_CASE);
    });

    test('Should set session user error when user case is undefined', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = undefined;
      request.session.selectedRespondent = mockEt3RespondentType;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_USER);
    });

    test('Should set session respondent error when user case respondent collection is empty', () => {
      request.session.userCase = mockValidCaseWithId;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.SESSION_RESPONDENT);
    });

    test('Should set session userid error when user user id is invalid', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      request.session.user.id = DefaultValues.STRING_SPACE;
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.USER_ID);
    });

    test('Should set respondent not found error when user id and respondent idamId not matches', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      request.session.user.id = '123';
      ET3Util.findSelectedRespondent(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.RESPONDENT_NOT_FOUND);
    });
  });

  describe('Update ET3 data function test', () => {
    test('Should update ET3 data', async () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      getCaseApiMock.mockReturnValue(api);
      api.modifyEt3Data = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
      const caseWithId = await ET3Util.updateET3Data(request);
      expect(caseWithId).toEqual(formatApiCaseDataToCaseWithId(mockCaseApiDataResponse));
    });

    test('Should not update ET3 data when not able to modify user case', async () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.user = mockUserDetails;
      request.session.selectedRespondent = mockEt3RespondentType;
      getCaseApiMock.mockReturnValue(api);
      api.modifyEt3Data = jest.fn().mockImplementation(() => {
        throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE);
      });
      await ET3Util.updateET3Data(request);
      expect(request.session.errors[0].errorType).toEqual(ValidationErrors.API);
    });
  });
});
