import RespondentDXAddressController from '../../../main/controllers/RespondentDXAddressController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentDXAddressController', () => {
  let controller: RespondentDXAddressController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentDXAddressController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent DX Address page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      respondentDxAddress: 'DX Address',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_DX_ADDRESS,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            respondentDxAddress: expect.objectContaining({
              id: 'respondentDxAddress',
              name: 'respondentDxAddress',
              type: 'text',
              hint: expect.any(Function),
              classes: 'govuk-text',
              attributes: { maxLength: 100 },
            }),
          },
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: req.session?.userCase,
        redirectUrl: expect.any(String),
        languageParam: expect.any(String),
        sessionErrors: req.session.errors,
      })
    );

    // Check that the form hint function returns the correct value
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(formContent.fields.respondentDxAddress.hint({ respondentDxAddress: 'DX Address' })).toBe('DX Address');
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      respondentDxAddress: 'DX 123456789', // Simulating a valid DX address input
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      respondentDxAddress: '', // Empty input no error
    };

    type FormError = { field: string; message: string };
    const mockErrors: FormError[] = [{ field: 'respondentDxAddress', message: 'This field is required' }];
    jest.spyOn(controller['form'], 'getValidatorErrors').mockReturnValue(mockErrors as never);

    await controller.post(req, res);

    // Ensure that the session's errors field is set
    expect(req.session.errors).toEqual(mockErrors);

    // Ensure that the response redirects to the same URL
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
