import OtherRespondentsApplicationsController from '../../../main/controllers/OtherRespondentsApplicationsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Other Respondents Applications Controller', () => {
  let controller: OtherRespondentsApplicationsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new OtherRespondentsApplicationsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page OTHER_RESPONDENTS_APPLICATIONS', () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, expect.anything());
    });
  });
});
