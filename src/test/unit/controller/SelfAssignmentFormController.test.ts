import { AxiosResponse } from 'axios';

import SelfAssignmentFormController from '../../../main/controllers/SelfAssignmentFormController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
const axios = require('axios');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Self Assignment Data Check Controller', () => {
  const t = {
    'self-assignment-case-reference-number': {},
    common: {},
  };

  it('should render the Self Assignment Form page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });

    new SelfAssignmentFormController().get(request, response);

    expect(response.render).toHaveBeenCalledWith('self-assignment-form', expect.anything());
  });

  describe('post()', () => {
    it("should return a 'required' error when the id field is empty", () => {
      const body = {
        id: '',
        firstName: 'firstName',
        lastName: 'lastName',
        respondentName: 'respondentName',
      };

      const errors = [{ propertyName: 'id', errorType: 'required' }];

      const req = mockRequest({ body });
      const res = mockResponse();
      new SelfAssignmentFormController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should return case data when all fields are entered', async () => {
      const body = {
        id: '1234567890123456',
        firstName: 'firstName',
        lastName: 'lastName',
        respondentName: 'respondentName',
      };
      getCaseApiMock.mockReturnValue(api);
      api.getCaseByIdRespondentAndClaimantNames = jest.fn().mockResolvedValueOnce(
        Promise.resolve({
          data: {
            id: '1234567890123456',
            created_date: '2022-08-19T09:19:25.79202',
            last_modified: '2022-08-19T09:19:25.817549',
            state: undefined,
            case_data: {},
          },
        } as AxiosResponse<CaseApiDataResponse>)
      );

      const req = mockRequest({ body });
      const res = mockResponse();
      await new SelfAssignmentFormController().post(req, res);
      expect(req.session.userCase).toBeDefined();
    });
  });

  it('should set error when no case data returns', async () => {
    const body = {
      id: '1234567890123456',
      firstName: 'firstName',
      lastName: 'lastName',
      respondentName: 'respondentName',
    };
    getCaseApiMock.mockReturnValue(api);
    api.getCaseByIdRespondentAndClaimantNames = jest.fn().mockResolvedValueOnce(null);
    const errors = [{ propertyName: 'hiddenErrorField', errorType: 'api' }];
    const req = mockRequest({ body });
    const res = mockResponse();
    await new SelfAssignmentFormController().post(req, res);
    expect(req.session.errors).toEqual(errors);
  });
});
