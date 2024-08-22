import RespondentNameController from '../../../main/controllers/RespondentNameController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { isFieldFilledIn, isOptionSelected } from '../../../main/validators/validator';

describe('RespondentNameController', () => {
  const mockWelshFlag = jest.spyOn(LaunchDarkly, 'getFlagValue');

  beforeEach(() => {
    mockWelshFlag.mockClear();
  });

  it('should render the Respondent Name page with the correct form content', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentNameController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    // Define the expected return type for the request.t() mock
    const translationMock = {
      label1: 'Is the name ',
      label2: ' correct?',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'If not, please provide the correct name',
    } as const; // Use 'as const' to maintain the exact shape of the object.

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue({
      label1: 'Is the name ',
      label2: ' correct?',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'If not, please provide the correct name',
    });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_NAME,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        welshEnabled: true,
        languageParam: expect.any(String),
        redirectUrl: expect.any(String),
        form: {
          fields: {
            respondentName: expect.objectContaining({
              classes: 'govuk-radios',
              id: 'respondentName',
              type: 'radios',
              label: expect.any(Function),
              labelHidden: false,
              values: expect.arrayContaining([
                {
                  name: 'respondentName',
                  label: expect.any(Function),
                  value: YesOrNo.YES,
                },
                {
                  name: 'respondentName',
                  label: expect.any(Function),
                  value: YesOrNo.NO,
                  subFields: {
                    respondentNameDetail: expect.objectContaining({
                      id: 'respondentNameTxt',
                      name: 'respondentNameTxt',
                      type: 'text',
                      labelSize: 'normal',
                      label: expect.any(Function),
                      classes: 'govuk-text',
                      attributes: { maxLength: 100 },
                      validator: isFieldFilledIn,
                    }),
                  },
                },
              ]),
              validator: isOptionSelected,
            }),
          },
          submit: submitButton,
          saveForLater: saveForLaterButton,
        },
      })
    );

    // Check that the form label functions return the correct values
    const renderMock = response.render as jest.Mock;
    const form = renderMock.mock.calls[0][1].form;

    expect(form.fields.respondentName.label(translationMock)).toBe('Is the name Test Respondent correct?');
    expect(form.fields.respondentName.values[0].label(translationMock)).toBe('Yes');
    expect(form.fields.respondentName.values[1].label(translationMock)).toBe('No');
    expect(form.fields.respondentName.values[1].subFields.respondentNameDetail.label(translationMock)).toBe(
      'If not, please provide the correct name'
    );
  });

  it('should handle when Welsh language feature flag is disabled', async () => {
    mockWelshFlag.mockResolvedValue(false);
    const controller = new RespondentNameController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue({
      label1: 'Is the name ',
      label2: ' correct?',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'If not, please provide the correct name',
    });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_NAME,
      expect.objectContaining({
        welshEnabled: false,
      })
    );
  });

  it('should use the correct translation keys', async () => {
    mockWelshFlag.mockResolvedValue(true);
    const controller = new RespondentNameController();
    const response = mockResponse();
    const request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue({
      label1: 'Is the name ',
      label2: ' correct?',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'If not, please provide the correct name',
    });

    await controller.get(request, response);

    expect(request.t).toHaveBeenCalledWith(TranslationKeys.COMMON, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, { returnObjects: true });
    expect(request.t).toHaveBeenCalledWith(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true });
  });
});
