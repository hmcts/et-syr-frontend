import RespondentDXAddressController from '../../../main/controllers/RespondentDXAddressController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');

describe('RespondentDXAddressController', () => {
  let controller: RespondentDXAddressController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentDXAddressController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    translationMock = {
      respondentDxAddress: 'Respondent DX Address hint text',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent DX Address page with the correct form content', async () => {
      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_DX_ADDRESS,
        expect.objectContaining({
          redirectUrl: expect.any(String), // Matches any redirect URL
          hideContactUs: true,
          form: expect.objectContaining({
            fields: expect.objectContaining({
              respondentDxAddress: expect.objectContaining({
                id: 'respondentDxAddress',
                name: 'respondentDxAddress',
                type: 'text',
                hint: expect.any(Function), // Hint is a function
                classes: 'govuk-text',
                attributes: { maxLength: 100 },
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
        })
      );

      // Verify that the hint function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.respondentDxAddress.hint(translationMock)).toBe('Respondent DX Address hint text');
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data', async () => {
      request.body = {
        respondentDxAddress: '123 Test Address',
      };

      await controller.post(request, response);

      // Ensure postLogic is called correctly
      expect(postLogic).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER
      );
    });
  });
});
