import RespondentContactPhoneNumberController from '../../../main/controllers/RespondentContactPhoneNumberController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isPhoneNumberValid } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentContactPhoneNumberController', () => {
  let controller: RespondentContactPhoneNumberController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContactPhoneNumberController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent Contact Phone Number page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      respondentContactPhoneNumber: 'Enter your phone number',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            respondentContactPhoneNumber: expect.objectContaining({
              id: 'respondentContactPhoneNumber',
              name: 'respondentContactPhoneNumber',
              type: 'text',
              hint: expect.any(Function),
              classes: 'govuk-text',
              attributes: expect.objectContaining({
                maxLength: 20,
              }),
              validator: isPhoneNumberValid,
            }),
          },
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: {},
        redirectUrl: PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
        languageParam: expect.any(String),
        sessionErrors: req.session.errors,
      })
    );

    // Check that the form hint and submit button text functions return the correct values
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(
      formContent.fields.respondentContactPhoneNumber.hint({ respondentContactPhoneNumber: 'Enter your phone number' })
    ).toBe('Enter your phone number');
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      respondentContactPhoneNumber: '01234567890', // Valid phone number for the test
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTACT_PREFERENCES);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      respondentContactPhoneNumber: '@1234567890', // Invalid input to trigger validation error
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
