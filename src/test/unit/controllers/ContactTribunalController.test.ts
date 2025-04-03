import ContactTribunalController from '../../../main/controllers/ContactTribunalController';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
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

  it('should redirect to holding page if feature flag is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.HOLDING_PAGE + languages.ENGLISH_URL_PARAMETER);
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to holding page if other party is offline', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.HOLDING_PAGE + languages.ENGLISH_URL_PARAMETER);
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should render contact application page', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
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
