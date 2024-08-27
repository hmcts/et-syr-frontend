import SessionTimeoutController from '../../../main/controllers/SessionTimeoutController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const sessionTimeoutController = new SessionTimeoutController();

describe('Session timeout controller', () => {
  const t = {
    home: {},
  };

  it('should run get extend session method once', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    sessionTimeoutController.getExtendSession(request, response);
    expect(response.send).toHaveBeenCalledTimes(1);
  });
});
