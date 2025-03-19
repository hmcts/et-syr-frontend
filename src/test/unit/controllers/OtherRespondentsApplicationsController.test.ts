import OtherRespondentApplicationsController from '../../../main/controllers/OtherRespondentApplicationsController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

describe('Other Respondent Applications Controller', () => {
  let controller: OtherRespondentApplicationsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new OtherRespondentApplicationsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page OTHER_RESPONDENT_APPLICATIONS', () => {
      request.session.user = mockUserDetails;
      request.session.userCase = mockUserCase;
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, expect.anything());
    });
  });
});
