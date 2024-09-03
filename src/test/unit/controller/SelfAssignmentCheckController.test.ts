import axios from 'axios';

import SelfAssignmentCheckController from '../../../main/controllers/SelfAssignmentCheckController';
import { PageUrls } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');

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
      req.session.user = mockUserDetails;
      const res = mockResponse();
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST);
    });

    it('should redirect to self assignment check page when case could not assigned', async () => {
      const body = {
        selfAssignmentCheck: 'Yes',
      };
      getCaseApiMock.mockReturnValue(api);
      api.assignCaseUserRole = jest.fn().mockResolvedValueOnce(Promise.resolve());
      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = mockValidCaseWithId;
      req.session.user = mockUserDetails;
      await new SelfAssignmentCheckController().post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(req.path);
    });
  });
});
