import axios from 'axios';

import SelfAssignmentCheckController from '../../../main/controllers/SelfAssignmentCheckController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, PageUrls, ServiceErrors, ValidationErrors, YES } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');

jest.mock('axios');
const api = new CaseApi(axios);
const body = {
  selfAssignmentCheck: 'Yes',
};
const req: AppRequest = mockRequest({ body });
const res = mockResponse();

describe('Self assignment check controller', () => {
  req.session.userCase = mockValidCaseWithId;
  req.session.user = mockUserDetails;
  it('should render the Self Assignment Data Check page', () => {
    const response = mockResponse();
    new SelfAssignmentCheckController().get(req, response);

    expect(response.render).toHaveBeenCalledWith('self-assignment-check', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the selfAssignmentCheck field is empty", () => {
      req.body.selfAssignmentCheck = DefaultValues.STRING_EMPTY;
      const errors = [{ propertyName: 'selfAssignmentCheck', errorType: 'required' }];
      new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign case when selfAssignmentCheck value is Yes', async () => {
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve('TEST'));
      const request = mockRequest({ body });
      request.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST);
    });

    it('should redirect to self assignment check page when case could not assigned', async () => {
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve());
      req.body.selfAssignmentCheck = YES;
      req.session.userCase = mockValidCaseWithId;
      req.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
    });

    it('should redirect to self assignment check and add session error when role not assigned with same user error', async () => {
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED_TO_SAME_USER);
    });
    it('should redirect to self assignment check and add session error when role not assigned with other respondent', async () => {
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED);
    });
    it('should redirect to self assignment check and add session error when role not assigned with api error', async () => {
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
    });
  });
});
