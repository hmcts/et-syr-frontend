import AxiosInstance from 'axios';

import NotificationController from '../../../main/controllers/NotificationController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('NotificationController', () => {
  let controller: NotificationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  const mockCaseApi = {
    axios: AxiosInstance,
    storeResponseToNotification: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getUserCase = jest.fn().mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
    caseApi.getCaseTransferInfo = jest.fn();
    controller = new NotificationController();
    request = mockRequest({});
    response = mockResponse();
    request.session.user = mockUserDetails;
    request.session.userCase = mockUserCase;
  });

  it('should render the notifications page when user case loads successfully', async () => {
    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.NOTIFICATIONS, expect.anything());
    expect(response.redirect).not.toHaveBeenCalled();
  });

  it('should redirect to transferred case page when user case access fails for a transferred case', async () => {
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(
        new Error('Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: mockUserCase.id,
        transferComplete: false,
      },
    });
    request.url = '/notifications?lng=en';

    await controller.get(request, response);

    expect(response.render).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=${mockUserCase.id}`);
  });

  it('should redirect to not found when user case access fails and case is not transferred', async () => {
    caseApi.getUserCase = jest
      .fn()
      .mockRejectedValue(
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      },
    });
    request.url = '/notifications?lng=en';

    await controller.get(request, response);

    expect(response.render).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
  });
});
