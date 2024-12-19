import ContactTribunalSubmitConfirmController from '../../../main/controllers/ContactTribunalSubmitConfirmController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Submit Confirmation Controller', () => {
  let controller: ContactTribunalSubmitConfirmController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalSubmitConfirmController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CONTACT_TRIBUNAL_SUBMIT_CONFIRMATION,
        expect.anything()
      );
    });
  });
});
