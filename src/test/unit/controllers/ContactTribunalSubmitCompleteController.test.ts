import ContactTribunalSubmitCompleteController from '../../../main/controllers/ContactTribunalSubmitCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Submit Complete Controller', () => {
  let controller: ContactTribunalSubmitCompleteController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalSubmitCompleteController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_COMPLETE, expect.anything());
    });
  });
});
