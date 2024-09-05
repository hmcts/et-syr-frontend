import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { HearingPreference } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('HearingPreferencesController', () => {
  let controller: HearingPreferencesController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new HearingPreferencesController();
    req = mockRequest({
      session: {
        userCase: {
          hearingPreferences: [HearingPreference.PHONE],
        },
      },
    });
    res = mockResponse();

    translationMock = {
      legend: 'How would you like to attend the hearing?',
      selectAllHint: 'Select all that apply',
      checkboxVideo: 'Video',
      checkboxPhone: 'Phone',
      checkboxNeither: 'Neither',
      explain: 'Explain your preference',
    };

    // Mock translation function
    (req.t as unknown as jest.Mock).mockImplementation((key: string) => translationMock[key]);
  });

  it('should render the Hearing Preferences page with the correct form content', async () => {
    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.HEARING_PREFERENCES,
      expect.objectContaining({
        PageUrls,
        redirectUrl: expect.any(String),
        hideContactUs: true,
        languageParam: expect.any(String),
        form: expect.objectContaining({
          fields: expect.objectContaining({
            hearingPreferences: expect.objectContaining({
              id: 'hearingPreferences',
              label: expect.any(Function),
              labelHidden: false,
              labelSize: 'l',
              type: 'checkboxes',
              hint: expect.any(Function),
              values: expect.arrayContaining([
                {
                  name: 'hearingPreferences',
                  label: expect.any(Function),
                  value: HearingPreference.VIDEO,
                },
                {
                  name: 'hearingPreferences',
                  label: expect.any(Function),
                  value: HearingPreference.PHONE,
                },
                {
                  divider: true,
                },
                {
                  name: 'hearingPreferences',
                  label: expect.any(Function),
                  exclusive: true,
                  value: HearingPreference.NEITHER,
                  subFields: {
                    hearingAssistance: expect.objectContaining({
                      id: 'hearingAssistance',
                      type: 'textarea',
                      label: expect.any(Function),
                      labelSize: 'normal',
                      attributes: { maxLength: 2500 },
                    }),
                  },
                },
              ]),
            }),
          }),
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: req.session.userCase,
        sessionErrors: undefined,
      })
    );

    // Check that the main label function returns the correct value
    const renderMock = res.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;

    // Testing the main label and hint
    expect(form.fields.hearingPreferences.label(translationMock)).toBe(translationMock.legend);
    expect(form.fields.hearingPreferences.hint(translationMock)).toBe(translationMock.selectAllHint);

    // Testing the individual checkbox labels
    expect(form.fields.hearingPreferences.values[0].label(translationMock)).toBe(translationMock.checkboxVideo);
    expect(form.fields.hearingPreferences.values[1].label(translationMock)).toBe(translationMock.checkboxPhone);
    expect(form.fields.hearingPreferences.values[3].label(translationMock)).toBe(translationMock.checkboxNeither);

    // Testing the label for the 'hearingAssistance' subfield
    expect(form.fields.hearingPreferences.values[3].subFields.hearingAssistance.label(translationMock)).toBe(
      translationMock.explain
    );
  });

  it('should handle the post method with valid data and redirect to NOT_IMPLEMENTED', async () => {
    req.body = {
      hearingPreferences: [HearingPreference.PHONE],
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOT_IMPLEMENTED);
  });

  it('should handle the post method with empty data and redirect to NOT_IMPLEMENTED', async () => {
    req.body = {
      hearingPreferences: [],
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
