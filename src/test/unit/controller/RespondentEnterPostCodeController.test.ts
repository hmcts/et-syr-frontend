import RespondentEnterPostCodeController from '../../../main/controllers/RespondentEnterPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';

jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/controllers/helpers/LanguageHelper');
jest.mock('../../../main/controllers/helpers/RouterHelpers');

describe('RespondentEnterPostCodeController', () => {
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockWelshFlag.mockClear();
  });

  it('should render the Respondent Enter Postcode page with the correct form content', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentEnterPostCodeController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondentEnterPostcode: 'AB12 3CD', // Align with field name in the controller
        },
      },
    });

    const translationMock = {
      enterPostcode: 'Enter your postcode',
    };

    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
    (setUrlLanguage as jest.Mock).mockReturnValue('/redirect-url');
    (getLanguageParam as jest.Mock).mockReturnValue('en');

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ENTER_POST_CODE,
      expect.objectContaining({
        PageUrls,
        userCase: request.session.userCase,
        hideContactUs: true,
        welshEnabled: true,
        languageParam: 'en',
        redirectUrl: '/redirect-url',
        form: {
          fields: {
            respondentEnterPostcode: expect.objectContaining({
              // Ensure this matches the field name in the controller
              id: 'respondentEnterPostcode',
              type: 'text',
              label: expect.any(Function),
              classes: 'govuk-label govuk-!-width-one-half',
              attributes: { maxLength: 14, autocomplete: 'postal-code' },
              validator: expect.any(Function),
            }),
          },
          submit: expect.any(Object),
          saveForLater: expect.any(Object),
        },
      })
    );

    const renderMock = response.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;

    // Verify the label function returns the correct value
    expect(form.fields.respondentEnterPostcode.label(translationMock)).toBe('Enter your postcode');
  });

  it('should handle when Welsh language feature flag is disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new RespondentEnterPostCodeController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondentEnterPostcode: 'AB12 3CD',
        },
      },
    });

    const translationMock = {
      enterPostcode: 'Enter your postcode',
    };

    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
    (setUrlLanguage as jest.Mock).mockReturnValue('/redirect-url');
    (getLanguageParam as jest.Mock).mockReturnValue('en');

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ENTER_POST_CODE,
      expect.objectContaining({
        welshEnabled: false,
      })
    );
  });

  it('should use the correct translation keys', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentEnterPostCodeController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondentEnterPostcode: 'AB12 3CD',
        },
      },
    });

    const translationMock = {
      enterPostcode: 'Enter your postcode',
    };

    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
    (setUrlLanguage as jest.Mock).mockReturnValue('/redirect-url');
    (getLanguageParam as jest.Mock).mockReturnValue('en');

    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ENTER_POST_CODE, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });
});
