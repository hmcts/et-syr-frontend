import ContactTribunalCYAController from '../../../main/controllers/ContactTribunalCYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import contactTribunalCYAJson from '../../../main/resources/locales/en/translation/contact-tribunal-check-your-answers.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Contact Tribunal CYA Controller', () => {
  let controller: ContactTribunalCYAController;
  let request: ReturnType<typeof mockRequestWithTranslation>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalCYAController();
    request = mockRequestWithTranslation({}, { ...applicationTypeJson, ...contactTribunalCYAJson });
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page CONTACT_TRIBUNAL_CYA', () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.contactApplicationType = 'Change personal details';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_CYA, expect.anything());
    });
  });
});
