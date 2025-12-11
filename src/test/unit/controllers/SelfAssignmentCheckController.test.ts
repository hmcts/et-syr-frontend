import axios from 'axios';

import SelfAssignmentCheckController from '../../../main/controllers/SelfAssignmentCheckController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, PageUrls, ServiceErrors, ValidationErrors, YES } from '../../../main/definitions/constants';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');

jest.mock('axios');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
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
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign case when selfAssignmentCheck value is Yes (new behavior with flag enabled)', async () => {
      req.body.selfAssignmentCheck = YES;
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      const mockResponseAssigned = {
        data: {
          status: 'ASSIGNED',
          caseDetails: [{ id: '123' }],
          message: 'User successfully assigned to case',
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve(mockResponseAssigned));
      const request = mockRequest({ body });
      request.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should assign case when selfAssignmentCheck value is Yes (old behavior with flag disabled)', async () => {
      req.body.selfAssignmentCheck = YES;
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      getCaseApiMock.mockReturnValue(api);
      const mockResponseAssigned = {
        data: {
          status: 'ASSIGNED',
          caseDetails: [{ id: '123' }],
          message: 'User successfully assigned to case',
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve(mockResponseAssigned));
      const request = mockRequest({ body });
      request.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST);
    });

    it('should redirect to self assignment check page when case could not assigned (new behavior with flag enabled)', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve());
      req.body.selfAssignmentCheck = YES;
      req.session.userCase = mockValidCaseWithId;
      req.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should redirect to self assignment check page when case could not assigned (old behavior with flag disabled)', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve());
      req.body.selfAssignmentCheck = YES;
      req.session.userCase = mockValidCaseWithId;
      req.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should redirect to case list when user is already assigned (new behavior with flag enabled)', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      const freshReq = mockRequest({ body: { selfAssignmentCheck: YES } });
      freshReq.session.userCase = { ...mockValidCaseWithId, id: '1234567890123456' };
      freshReq.session.user = mockUserDetails;
      const freshRes = mockResponse();
      getCaseApiMock.mockReturnValue(api);
      const mockApiResponse = {
        data: {
          status: 'ALREADY_ASSIGNED',
          caseDetails: [
            {
              id: '1234567890123456',
              case_data: {
                respondentCollection: [
                  {
                    id: 'resp123',
                    value: {
                      idamId: mockUserDetails.id,
                      respondentName: 'Test Respondent',
                    },
                  },
                ],
              },
            },
          ],
          message: 'User was already assigned to this case',
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve(mockApiResponse));
      await new SelfAssignmentCheckController().post(freshReq, freshRes);
      expect(freshRes.redirect).toHaveBeenCalledWith(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + '/1234567890123456/resp123?lng=en'
      );
    });

    it('should redirect to case list when user is already assigned but case details unavailable', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      const freshReq = mockRequest({ body: { selfAssignmentCheck: YES } });
      freshReq.session.userCase = mockValidCaseWithId;
      freshReq.session.user = mockUserDetails;
      const freshRes = mockResponse();
      getCaseApiMock.mockReturnValue(api);
      const mockApiResponse = {
        data: {
          status: 'ALREADY_ASSIGNED' as const,
          caseDetails: [] as never[],
          message: 'User was already assigned to this case',
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve(mockApiResponse));
      await new SelfAssignmentCheckController().post(freshReq, freshRes);
      expect(freshRes.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should redirect to self assignment check and add session error when role not assigned with same user error (legacy)', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED_TO_SAME_USER);
    });
    it('should redirect to self assignment check and add session error when role not assigned with other respondent', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED);
    });
    it('should redirect to self assignment check and add session error when role not assigned with api error', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      req.body.selfAssignmentCheck = YES;
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockImplementationOnce(() => {
        throw new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE);
      });
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors).toHaveLength(1);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
    });

    it('should redirect to making-response-as-legal-representative when user is a professional user', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      const freshReq = mockRequest({ body: { selfAssignmentCheck: YES } });
      freshReq.session.userCase = mockValidCaseWithId;
      freshReq.session.user = mockUserDetails;
      const freshRes = mockResponse();
      getCaseApiMock.mockReturnValue(api);
      const mockApiResponse = {
        data: {
          status: 'PROFESSIONAL_USER' as const,
          message: 'User is a professional user and should use MyHMCTS to submit their response',
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve(mockApiResponse));
      await new SelfAssignmentCheckController().post(freshReq, freshRes);
      expect(freshRes.redirect).toHaveBeenCalledWith(PageUrls.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE);
    });
  });
});
