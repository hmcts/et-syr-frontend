import RepResponseLandingController from '../../../main/controllers/RepResponseLandingController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RepResponseLandingController', () => {
  let controller: RepResponseLandingController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;

  beforeEach(() => {
    controller = new RepResponseLandingController();
    response = mockResponse();
    request = mockRequest({});
  });

  describe('GET method', () => {
    it('should render the Rep landing page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_RESPONSE_LANDING,
        expect.objectContaining({
          PageUrls,
          redirectUrl: expect.any(String),
          languageParam: expect.any(String),
          hideContactUs: true,
        })
      );
    });
  });
});
