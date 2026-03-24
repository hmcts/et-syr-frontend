import axios from 'axios';

import SelfAssignmentCheckController from '../../../main/controllers/SelfAssignmentCheckController';
import { AppRequest } from '../../../main/definitions/appRequest';
import {
  CaseAssignmentResponse,
  DefaultValues,
  PageUrls,
  ServiceErrors,
  ValidationErrors,
  YES,
} from '../../../main/definitions/constants';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ErrorUtils from '../../../main/utils/ErrorUtils';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');

jest.mock('axios');
jest.mock('../../../main/modules/featureFlag/launchDarkly');

const api = new CaseApi(axios);
const body = { selfAssignmentCheck: YES };

describe('Self assignment check controller', () => {
  let req: AppRequest;
  let res: any;

  beforeEach(() => {
    req = mockRequest({ body });
    res = mockResponse();
    req.session.userCase = { ...mockValidCaseWithId };
    req.session.user = { ...mockUserDetails };
    jest.clearAllMocks();
  });

  it('should render the Self Assignment Data Check page', () => {
    new SelfAssignmentCheckController().get(req, res);
    expect(res.render).toHaveBeenCalledWith('self-assignment-check', expect.anything());
  });

  it('should expose form content callbacks and undefined session values in render context', () => {
    req.session.userCase = undefined;
    req.session.user = undefined;
    req.session.errors = undefined;
    req.session.respondentNameFromForm = 'Respondent Name';

    new SelfAssignmentCheckController().get(req, res);

    const renderContext = res.render.mock.calls[0][1];
    expect(renderContext.userCase).toBeUndefined();
    expect(renderContext.user).toBeUndefined();
    expect(renderContext.formRespondentName).toBe('Respondent Name');
    expect(renderContext.form.fields.selfAssignmentCheck.label({ h1: 'Heading' })).toBe('Heading');
    expect(renderContext.form.fields.selfAssignmentCheck.hint({ hint: 'Hint text' })).toBe('Hint text');
    expect(
      renderContext.form.fields.selfAssignmentCheck.values[0].label({
        confirmation: { checkbox: 'I confirm' },
      })
    ).toBe('I confirm');
    expect(renderContext.form.submit.text({ submit: 'Continue' })).toBe('Continue');
  });

  it('should throw when get is called without a session', () => {
    req.url = '';
    (req as Partial<AppRequest>).session = undefined;

    expect(() => new SelfAssignmentCheckController().get(req, res)).toThrow();
  });

  describe('post()', () => {
    it("should return a 'required' error when the selfAssignmentCheck field is empty", async () => {
      req.body.selfAssignmentCheck = DefaultValues.STRING_EMPTY;
      const errors = [{ propertyName: 'selfAssignmentCheck', errorType: 'required' }];
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign case when selfAssignmentCheck value is Yes (new behavior with flag enabled)', async () => {
      req.body.selfAssignmentCheck = YES;
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      const mockResponseAssigned = {
        data: { status: 'ASSIGNED', caseDetails: [{ id: '123' }], message: 'User successfully assigned' },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValue(mockResponseAssigned);

      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should assign case when selfAssignmentCheck value is Yes (old behavior with flag disabled)', async () => {
      req.body.selfAssignmentCheck = YES;
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      getCaseApiMock.mockReturnValue(api);
      const mockResponseAssigned = {
        data: { status: 'ASSIGNED', caseDetails: [{ id: '123' }], message: 'User successfully assigned' },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValue(mockResponseAssigned);

      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST);
    });

    it('should assign case when flag is disabled and request session is missing', async () => {
      req.url = '';
      (req as Partial<AppRequest>).session = undefined;
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      getCaseApiMock.mockReturnValue(api);
      const setManualErrorSpy = jest
        .spyOn(ErrorUtils, 'setManualErrorToRequestSessionWithRemovingExistingErrors')
        .mockImplementation();
      api.assignCaseUserRole = jest.fn().mockResolvedValue({ data: { status: 'ASSIGNED' } });

      await new SelfAssignmentCheckController().post(req, res);
      setManualErrorSpy.mockRestore();

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should redirect to case details page when user is already assigned to the case', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);

      const mockResponseAlready = {
        data: { status: 'ALREADY_ASSIGNED', message: 'User was already assigned to this case' },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValue(mockResponseAlready);

      req.session.userCase.respondents = [{ idamId: mockUserDetails.id, ccdId: '123' }];

      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/${mockValidCaseWithId.id}/123?lng=en`
      );
    });

    it('should redirect to self assignment check and add session error when role not assigned with api error', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockRejectedValue(new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE));

      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
    });

    it('should redirect to making-response-as-legal-representative when user is a professional user', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      const mockApiResponse = {
        data: { status: 'PROFESSIONAL_USER', message: 'Use MyHMCTS' },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValue(mockApiResponse);

      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE);
    });

    it('should set CASE_ALREADY_ASSIGNED error when API throws specific error message', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);

      // Force the catch block to identify the "Already Assigned" string
      const error = new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE);
      api.assignCaseUserRole = jest.fn().mockRejectedValue(error);

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.SELF_ASSIGNMENT_CHECK));
    });

    it('should set CASE_ALREADY_ASSIGNED error when API throws already assigned error and userCase is missing', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.userCase = undefined;
      req.session.errors = [];

      api.assignCaseUserRole = jest
        .fn()
        .mockRejectedValue(new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE));

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.CASE_ALREADY_ASSIGNED);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should set API error and redirect when flag is disabled and response is null', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(false); // Old behavior
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValue(null); // No response

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.SELF_ASSIGNMENT_CHECK));
    });

    it('should set API error when API throws an object without a message', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.userCase = undefined;
      req.session.errors = [];

      api.assignCaseUserRole = jest.fn().mockRejectedValue({});

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should set API error when API throws undefined', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.errors = [];

      api.assignCaseUserRole = jest.fn().mockRejectedValue(undefined);

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should log error and redirect when flag is enabled but data property is missing', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true); // New behavior
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValue({}); // Response exists, but .data is missing

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.SELF_ASSIGNMENT_CHECK));
    });

    it('should set API error when flag is enabled and case api is unavailable', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(undefined);
      req.session.user = undefined;
      req.session.userCase = undefined;
      req.session.errors = [];

      await new SelfAssignmentCheckController().post(req, res);

      expect(req.session.errors[0].errorType).toEqual(ValidationErrors.API);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.SELF_ASSIGNMENT_CHECK);
    });

    it('should redirect to case list when flag is enabled and response data has no status', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValue({ data: {} });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should redirect to case list when response data becomes undefined before already assigned status check', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      let getterCount = 0;
      const flakyResponse = {};
      Object.defineProperty(flakyResponse, 'data', {
        get: () => {
          getterCount++;
          if (getterCount <= 2) {
            return { status: 'ASSIGNED' };
          }
          return undefined;
        },
      });
      api.assignCaseUserRole = jest.fn().mockResolvedValue(flakyResponse);

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should redirect to case list when already assigned status has no message', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValue({
        data: { status: CaseAssignmentResponse.ALREADY_ASSIGNED },
      });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should redirect to case list when response data becomes undefined before already assigned message check', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      let getterCount = 0;
      const flakyResponse = {};
      Object.defineProperty(flakyResponse, 'data', {
        get: () => {
          getterCount++;
          if (getterCount === 1) {
            return { status: 'ASSIGNED' };
          }
          if (getterCount === 2 || getterCount === 3) {
            return { status: CaseAssignmentResponse.ALREADY_ASSIGNED };
          }
          return undefined;
        },
      });
      api.assignCaseUserRole = jest.fn().mockResolvedValue(flakyResponse);

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + '?lng=en');
    });

    it('should redirect to case details with empty respondent ID if user not found in respondents list', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);

      const mockResponseAlready = {
        data: {
          status: CaseAssignmentResponse.ALREADY_ASSIGNED,
          message: CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE,
        },
      };
      api.assignCaseUserRole = jest.fn().mockResolvedValue(mockResponseAlready);

      // Setup session where the current user ID DOES NOT match any respondent
      req.session.user.id = 'wrong-id';
      req.session.userCase.respondents = [{ idamId: 'other-user', ccdId: '456' }];

      await new SelfAssignmentCheckController().post(req, res);

      // Should redirect with empty string for respondent ID: .../caseId/
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(`${mockValidCaseWithId.id}/?lng=en`));
    });

    it('should redirect to case details with missing case and user details when already assigned response is returned', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.user = undefined;
      req.session.userCase = undefined;

      api.assignCaseUserRole = jest.fn().mockResolvedValue({
        data: {
          status: CaseAssignmentResponse.ALREADY_ASSIGNED,
          message: CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE,
        },
      });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/undefined/?lng=en`);
    });

    it('should redirect to case details with empty respondent ID when respondents and user are missing', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.user = undefined;
      req.session.userCase = { ...mockValidCaseWithId, respondents: undefined };

      api.assignCaseUserRole = jest.fn().mockResolvedValue({
        data: {
          status: CaseAssignmentResponse.ALREADY_ASSIGNED,
          message: CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE,
        },
      });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/${mockValidCaseWithId.id}/?lng=en`
      );
    });

    it('should redirect to case details with empty respondent ID when respondents exist but user is missing', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      req.session.user = undefined;
      req.session.userCase.respondents = [{ idamId: 'other-user', ccdId: '456' }];

      api.assignCaseUserRole = jest.fn().mockResolvedValue({
        data: {
          status: CaseAssignmentResponse.ALREADY_ASSIGNED,
          message: CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE,
        },
      });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/${mockValidCaseWithId.id}/?lng=en`
      );
    });

    it('should redirect to case details with empty respondent ID when session becomes unavailable during respondent lookup', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      getCaseApiMock.mockReturnValue(api);
      const sessionValue = {
        user: { ...mockUserDetails },
        userCase: {
          ...mockValidCaseWithId,
          respondents: [{ idamId: mockUserDetails.id, ccdId: '456' }],
        },
      };
      let sessionReads = 0;
      Object.defineProperty(req, 'session', {
        configurable: true,
        get: () => {
          sessionReads++;
          return sessionReads >= 3 ? undefined : sessionValue;
        },
      });

      api.assignCaseUserRole = jest.fn().mockResolvedValue({
        data: {
          status: CaseAssignmentResponse.ALREADY_ASSIGNED,
          message: CaseAssignmentResponse.USER_ALREADY_ASSIGNED_TO_THE_CASE,
        },
      });

      await new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/${mockValidCaseWithId.id}/?lng=en`
      );
    });
  });
});
