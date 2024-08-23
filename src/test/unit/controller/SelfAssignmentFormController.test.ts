import axios from 'axios';

import SelfAssignmentFormController from '../../../main/controllers/SelfAssignmentFormController';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import {
  MockCaseApiDataResponseConstants,
  mockCaseApiDataResponseForSelfAssignment,
} from '../mocks/mockCaseApiDataResponse';
import { MockCaseWithIdConstants, mockInvalidCaseWithId, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Self Assignment Data Check Controller', () => {
  const t = {
    'self-assignment-case-reference-number': {},
    common: {},
  };

  it('should render the Self Assignment Form page', () => {
    const request = mockRequest({ t });
    const response = mockResponse();
    request.session.userCase = mockValidCaseWithId;
    new SelfAssignmentFormController().get(request, response);
    expect(response.render).toHaveBeenCalledWith('self-assignment-form', expect.anything());
    expect(request.session.userCase.id).toEqual(MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER);
    expect(request.session.userCase.respondentName).toEqual(MockCaseWithIdConstants.TEST_RESPONDENT_NAME);
    expect(request.session.userCase.firstName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_NAME);
    expect(request.session.userCase.lastName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME);
  });

  it('should request session userCase object to undefined when new assignment', () => {
    const request = mockRequest({ t });
    const response = mockResponse();
    request.url = '/self-assignment-form?isNew=true';
    request.session.userCase = mockValidCaseWithId;
    new SelfAssignmentFormController().get(request, response);
    expect(response.render).toHaveBeenCalledWith('self-assignment-form', expect.anything());
    expect(request.session.userCase).toEqual(undefined);
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
      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(request.session.errors).toEqual(expectedErrors);
    });

    it('should throw error when input fields are invalid and not able to save request session', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockInvalidCaseWithId;
      const sessionSaveError = new Error('Unable to save request session');
      request.session.save = jest.fn().mockImplementation(() => {
        throw new Error('Unable to save request session');
      });
      await expect(new SelfAssignmentFormController().post(request, response)).rejects.toThrow(sessionSaveError);
    });

    it('should return case data when all fields are entered', async () => {
      const request = mockRequest({ t });
      const response = mockResponse();
      request.body = mockValidCaseWithId;
      getCaseApiMock.mockReturnValue(api);
      api.getCaseByIdRespondentAndClaimantNames = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(mockCaseApiDataResponseForSelfAssignment));
      await new SelfAssignmentFormController().post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(request.path);
      expect(request.session.userCase.id).toEqual(MockCaseApiDataResponseConstants.TEST_SUBMISSION_REFERENCE_NUMBER);
      expect(request.session.userCase.respondentName).toEqual(MockCaseApiDataResponseConstants.TEST_RESPONDENT_NAME);
      expect(request.session.userCase.firstName).toEqual(MockCaseApiDataResponseConstants.TEST_CLAIMANT_NAME);
      expect(request.session.userCase.lastName).toEqual(MockCaseApiDataResponseConstants.TEST_CLAIMANT_SURNAME);
    });
  });

  it('should set error when no case data returns', async () => {
    const request = mockRequest({ t });
    const response = mockResponse();
    request.body = mockValidCaseWithId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseByIdRespondentAndClaimantNames = jest.fn().mockResolvedValueOnce(null);
    const errors = [{ propertyName: 'hiddenErrorField', errorType: 'api' }];
    await new SelfAssignmentFormController().post(request, response);
    expect(request.session.errors).toEqual(errors);
  });
});
