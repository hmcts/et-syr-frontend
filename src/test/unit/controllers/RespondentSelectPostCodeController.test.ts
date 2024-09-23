import RespondentSelectPostCodeController from '../../../main/controllers/RespondentSelectPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

describe('RespondentSelectPostCodeController', () => {
  let controller: RespondentSelectPostCodeController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentSelectPostCodeController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    translationMock = {
      selectAddress: 'Select an address',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Select Post Code page with the correct form content', async () => {
      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_SELECT_POST_CODE,
        expect.objectContaining({
          PageUrls: expect.any(Object), // Allows for flexible checking of the PageUrls object
          redirectUrl: expect.any(String), // Matches any redirect URL
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              addressEnterPostcode: expect.objectContaining({
                classes: 'govuk-select',
                id: 'addressAddressTypes',
                type: 'text',
                label: expect.any(Function), // Label is a function
                validator: expect.any(Function), // Validator is a function
              }),
            }),
            submit: expect.objectContaining({
              classes: 'govuk-!-margin-right-2',
              text: expect.any(Function), // Text is also a function
            }),
            saveForLater: expect.objectContaining({
              classes: 'govuk-button--secondary',
              text: expect.any(Function), // Text is a function here as well
            }),
          }),
          userCase: request.session.userCase, // Match the user case
          sessionErrors: expect.any(Array), // Allows for session errors to be either undefined or an array
        })
      );

      // Verify that the label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.addressEnterPostcode.label(translationMock)).toBe('Select an address');
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data', async () => {
      request.body = {
        addressEnterPostcode: '12345',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME
      );
    });
  });
});
