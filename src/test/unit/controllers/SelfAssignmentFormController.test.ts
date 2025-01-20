import axios from 'axios';

import SelfAssignmentFormController from '../../../main/controllers/SelfAssignmentFormController';
import {
  FormFieldNames,
  LegacyUrls,
  PageUrls,
  TranslationKeys,
  ValidationErrors,
} from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import {
  MockCaseApiDataResponseConstants,
  mockCaseApiDataResponseForSelfAssignmentAsData,
} from '../mocks/mockCaseApiDataResponse';
import { MockCaseWithIdConstants, mockInvalidCaseWithId, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../mocks/mockCaseWithIdWithFullRespondentDetails';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Self assignment form controller', () => {
  const t = {
    'self-assignment-case-reference-number': {},
    common: {},
  };

  it('should render the Self Assignment Form page when case number is checked', () => {
    const request = mockRequest({ t });
    request.session.caseNumberChecked = true;
    const response = mockResponse();
    request.session.userCase = mockValidCaseWithId;
    new SelfAssignmentFormController().get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.SELF_ASSIGNMENT_FORM, expect.anything());
    expect(request.session.userCase.id).toEqual(MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER);
    expect(request.session.userCase.respondentName).toEqual(MockCaseWithIdConstants.TEST_RESPONDENT_NAME);
    expect(request.session.userCase.firstName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_NAME);
    expect(request.session.userCase.lastName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME);
  });
  describe('post()', () => {
    it("should return a 'required' error when the fields are empty", () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockInvalidCaseWithId;
      new SelfAssignmentFormController().post(request, response);
      const expectedErrors = [
        { propertyName: 'id', errorType: 'required' },
        { propertyName: 'respondentName', errorType: 'required' },
        { propertyName: 'firstName', errorType: 'required' },
        { propertyName: 'lastName', errorType: 'required' },
      ];
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM);
      expect(request.session.errors).toEqual(expectedErrors);
    });
    it('should return case data when all fields are entered', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithIdWithFullRespondentDetails;
      request.session.userCase = mockValidCaseWithIdWithFullRespondentDetails;
      request.session.userCase.respondents[0].ccdId = 'dummyCCDId';
      request.params = { ccdId: 'dummyCCDId' };
      getCaseApiMock.mockReturnValue(api);
      api.getCaseByApplicationRequest = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(mockCaseApiDataResponseForSelfAssignmentAsData));
      await new SelfAssignmentFormController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(request.session.userCase.id).toEqual(MockCaseApiDataResponseConstants.TEST_SUBMISSION_REFERENCE_NUMBER);
      expect(request.session.userCase.respondentName).toEqual(MockCaseApiDataResponseConstants.TEST_RESPONDENT_NAME);
      expect(request.session.userCase.firstName).toEqual(MockCaseApiDataResponseConstants.TEST_CLAIMANT_NAME);
      expect(request.session.userCase.lastName).toEqual(MockCaseApiDataResponseConstants.TEST_CLAIMANT_SURNAME);
    });
  });
  it('should forward to legacy ET3 URL if id in non-reform', async () => {
    const request = mockRequest({ t });
    const response = mockResponse();
    request.body = mockValidCaseWithId;
    getCaseApiMock.mockReturnValue(api);
    api.checkIdAndState = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithStringFalseResponse));
    await new SelfAssignmentFormController().post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.SIGN_UP);
  });
  it('should show an error if there is no case returned', async () => {
    const request = mockRequest({ t });
    const response = mockResponse();
    request.body = mockValidCaseWithId;
    getCaseApiMock.mockReturnValue(api);
    api.checkIdAndState = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithStringTrueResponse));
    api.getCaseByApplicationRequest = jest.fn().mockResolvedValueOnce(Promise.resolve(null));
    await new SelfAssignmentFormController().post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_FORM);
    expect(request.session.errors).toStrictEqual([
      {
        errorType: ValidationErrors.INVALID_CASE_DETAILS,
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
      },
    ]);
  });
});
