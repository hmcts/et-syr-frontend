import AxiosInstance from 'axios';

import NotificationController from '../../../main/controllers/NotificationController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Your Request and Applications Controller', () => {
  let controller: NotificationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  const mockCaseApi = {
    axios: AxiosInstance,
    storeResponseToNotification: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.getUserCase = jest
    .fn()
    .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  beforeEach(() => {
    controller = new NotificationController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page YOUR_REQUEST_AND_APPLICATIONS', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTIFICATIONS, expect.anything());
    });
  });
});
