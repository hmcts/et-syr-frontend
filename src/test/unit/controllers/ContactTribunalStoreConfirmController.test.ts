import ContactTribunalStoreConfirmController from '../../../main/controllers/ContactTribunalStoreConfirmController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Stored Confirmation Controller', () => {
  let controller: ContactTribunalStoreConfirmController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalStoreConfirmController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CONTACT_TRIBUNAL_STORE_CONFIRMATION,
        expect.anything()
      );
    });
  });
});
