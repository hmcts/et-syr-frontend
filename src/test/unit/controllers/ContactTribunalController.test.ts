import ContactTribunalController from '../../../main/controllers/ContactTribunalController';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import contactTribunal from '../../../main/resources/locales/en/translation/contact-tribunal.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render contact application page', async () => {
    const controller = new ContactTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTribunal);

    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL, expect.anything());
  });

  it('should render accordion items', async () => {
    const controller = new ContactTribunalController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, contactTribunal);

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
