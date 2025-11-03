import YourRequestAndApplicationsController from '../../../main/controllers/YourRequestAndApplicationsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Your Request and Applications Controller', () => {
  let controller: YourRequestAndApplicationsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new YourRequestAndApplicationsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page YOUR_REQUEST_AND_APPLICATIONS', async () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, expect.anything());
    });
  });
});
