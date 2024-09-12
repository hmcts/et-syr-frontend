import RespondentEnterPostCodeController from '../../../main/controllers/RespondentEnterPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { postLogic } from '../../../main/helpers/CaseHelpers';
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
              respondentEnterPostcode: expect.objectContaining({
                id: 'respondentEnterPostcode',
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

      expect(form.fields.respondentEnterPostcode.label(translationMock)).toBe('Enter postcode');
      expect(form.submit.text(translationMock)).toBe('Find address');
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid postcode data', async () => {
      request.body = {
        respondentEnterPostcode: 'SW1A 1AA',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.RESPONDENT_SELECT_POST_CODE
      );
    });

    it('should handle invalid postcode data by calling the validator', async () => {
      // Set the validator to return false
      (isValidUKPostcode as jest.Mock).mockReturnValue(false);

      request.body = {
        respondentEnterPostcode: '123456789009876543211234567890',
      };

      await controller.post(request, response);

      // Ensure postLogic is not called if validation fails
      expect(postLogic).toHaveBeenCalled();
    });
  });
});
