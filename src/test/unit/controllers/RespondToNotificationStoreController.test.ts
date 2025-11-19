import AxiosInstance from 'axios';

import RespondToNotificationStoreController from '../../../main/controllers/RespondToNotificationStoreController';
import { ErrorPages, InterceptPaths } from '../../../main/definitions/constants';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Notification Store Controller', () => {
  jest.mock('config');
  const controller = new RespondToNotificationStoreController();

  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    storeResponseToNotification: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.storeResponseToNotification = jest
    .fn()
    .mockResolvedValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  caseApi.getUserCase = jest
    .fn()
    .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  it('should redirect to RESPOND_TO_NOTIFICATION_STORE_CONFIRMATION with language param', async () => {
    const res = mockResponse();
    const req = mockRequest({ userCase: mockUserCase });
    req.session.user = mockUserDetails;
    req.session.userCase.selectedNotification = mockSendNotificationCollection[0];
    req.url = InterceptPaths.RESPOND_TO_NOTIFICATION_STORE;

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(
      '/respond-to-notification-store-confirmation/d416f43f-10f4-402a-bdf1-ea9012a553d7?lng=en'
    );
  });

  it('should redirect to NOT_FOUND on error during submission', async () => {
    const res = mockResponse();
    const req = mockRequest({ userCase: mockUserCase });
    req.session.user = mockUserDetails;
    req.session.userCase.selectedNotification = mockSendNotificationCollection[0];
    req.url = InterceptPaths.RESPOND_TO_NOTIFICATION_STORE;
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'storeResponseToNotification').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
