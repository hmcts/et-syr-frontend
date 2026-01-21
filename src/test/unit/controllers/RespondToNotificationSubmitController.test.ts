import AxiosInstance, { AxiosResponse } from 'axios';

import RespondToNotificationSubmitController from '../../../main/controllers/RespondToNotificationSubmitController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond To Notification Submit Controller', () => {
  jest.mock('config');
  const controller = new RespondToNotificationSubmitController();

  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    submitResponseToNotification: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.submitResponseToNotification = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        id: '135',
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  caseApi.getUserCase = jest
    .fn()
    .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  beforeEach(() => {});

  it('should redirect to RESPOND_TO_NOTIFICATION_COMPLETE with language param', async () => {
    const res = mockResponse();
    const req = mockRequest({ userCase: mockUserCase });
    req.session.user = mockUserDetails;
    req.session.userCase.selectedNotification = mockSendNotificationCollection[0];
    req.url = PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE;
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE + '?lng=en');
  });

  it('should redirect to NOT_FOUND on error during submission', async () => {
    const res = mockResponse();
    const req = mockRequest({ userCase: mockUserCase });
    req.session.user = mockUserDetails;
    req.session.userCase.selectedNotification = mockSendNotificationCollection[0];
    req.url = PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE;
    req.url = '/test-url';
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'submitResponseToNotification').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
