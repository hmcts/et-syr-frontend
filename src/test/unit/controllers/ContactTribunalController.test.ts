import ContactTribunalController from '../../../main/controllers/ContactTribunalController';
import { TranslationKeys } from '../../../main/definitions/constants';
import contactTribunalJson from '../../../main/resources/locales/en/translation/contact-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Controller', () => {
  let controller: ContactTribunalController;
  let request: ReturnType<typeof mockRequestWithTranslation>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalController();
    request = mockRequestWithTranslation({}, contactTribunalJson);
    response = mockResponse();
  });

  it('should render contact application page', async () => {
    request.session.userCase.et1OnlineSubmission = 'Yes';
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_TRIBUNAL,
      expect.objectContaining({
        applicationsAccordionItems: expect.arrayContaining([
          {
            heading: {
              text: expect.any(String),
            },
            content: {
              html: expect.any(String),
            },
          },
        ]),
      })
    );
  });
});
