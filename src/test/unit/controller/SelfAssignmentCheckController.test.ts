import SelfAssignmentCheckController from '../../../main/controllers/SelfAssignmentCheckController';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const axios = require('axios');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Self Assignment Check controller', () => {
  const t = {
    'self-assignment-case-reference-number': {},
    common: {},
  };

  it('should render the Self Assignment Data Check page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new SelfAssignmentCheckController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('self-assignment-check', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the selfAssignmentCheck field is empty", () => {
      const body = {
        selfAssignmentCheck: '',
      };

      const errors = [{ propertyName: 'selfAssignmentCheck', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new SelfAssignmentCheckController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign case when selfAssignmentCheck value is Yes', async () => {
      const body = {
        selfAssignmentCheck: 'Yes',
      };
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve('TEST'));
      const req = mockRequest({ body });
      req.session.user = {
        id: 'testUserId',
        accessToken: 'testAccessToken',
        email: 'testEmail',
        familyName: 'testFamilyName',
        isCitizen: true,
        givenName: 'givenName',
      };
      const res = mockResponse();
      await new SelfAssignmentCheckController().post(req, res);
      expect(req.session.userCase).toBeDefined();
    });
  });
});
