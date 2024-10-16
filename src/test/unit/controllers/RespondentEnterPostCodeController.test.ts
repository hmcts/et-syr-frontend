import RespondentEnterPostCodeController from '../../../main/controllers/RespondentEnterPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isValidUKPostcode } from '../../../main/validators/address_validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/validators/address_validator');

describe('RespondentEnterPostCodeController', () => {
  let controller: RespondentEnterPostCodeController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentEnterPostCodeController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    translationMock = {
      enterPostcode: 'Enter postcode',
      findAddress: 'Find address',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);

    // Mock validator
    (isValidUKPostcode as jest.Mock).mockReturnValue(true);
  });

  describe('GET method', () => {
    it('should render the Respondent Enter Postcode page with the correct form content', async () => {
      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_ENTER_POST_CODE,
        expect.objectContaining({
          redirectUrl: expect.any(String), // Matches any redirect URL
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              responseRespondentAddressPostCode: expect.objectContaining({
                id: 'responseRespondentAddressPostCode',
                type: 'text',
                label: expect.any(Function), // Label is a function
                classes: 'govuk-label govuk-!-width-one-half',
                attributes: expect.objectContaining({
                  maxLength: 14,
                  autocomplete: 'postal-code',
                }),
                validator: expect.any(Function), // Validator is a function
              }),
            }),
            submit: expect.objectContaining({
              type: submitButton,
              text: expect.any(Function), // Text is a function
            }),
            saveForLater: saveForLaterButton,
          }),
        })
      );

      // Verify that the label and text functions return the correct values
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.responseRespondentAddressPostCode.label(translationMock)).toBe('Enter postcode');
      expect(form.submit.text(translationMock)).toBe('Find address');
    });
  });

  describe('POST method', () => {
    it('should redirect to select post code page', async () => {
      (isValidUKPostcode as jest.Mock).mockReturnValue(false);
      request.body = {
        responseRespondentAddressPostCode: 'SW1A 1AA',
      };

      await controller.post(request, response);

      // Ensure response is redirected to the right url
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_SELECT_POST_CODE);
    });

    it('should handle invalid postcode data by calling the validator', async () => {
      request.body = {
        responseRespondentAddressPostCode: '123456789009876543211234567890',
      };

      await controller.post(request, response);

      // Ensure session has at least 1 error
      expect(request.session.errors).toHaveLength(1);
    });
  });
});
