import ContactTribunalStoreCompleteController from '../../../main/controllers/ContactTribunalStoreCompleteController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Stored Complete Controller', () => {
  let controller: ContactTribunalStoreCompleteController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalStoreCompleteController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, expect.anything());
    });
  });
});
