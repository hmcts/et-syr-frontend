import RespondentPreferredContactNameController from '../../../main/controllers/RespondentPreferredContactNameController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isNameValid } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentPreferredContactNameController', () => {
  let controller: RespondentPreferredContactNameController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentPreferredContactNameController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent Preferred Contact Name page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      respondentPreferredContactName: 'Preferred contact name',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_PREFERRED_CONTACT_NAME,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            respondentPreferredContactName: expect.objectContaining({
              id: 'respondentPreferredContactName',
              name: 'respondentPreferredContactName',
              type: 'text',
              hint: expect.any(Function),
              classes: 'govuk-text',
              attributes: { maxLength: 100 },
              validator: isNameValid,
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
    expect(
      formContent.fields.respondentPreferredContactName.hint({
        respondentPreferredContactName: 'Preferred contact name',
      })
    ).toBe('Preferred contact name');
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      respondentPreferredContactName: 'John Doe', // Simulating a valid name input
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_DX_ADDRESS);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      respondentPreferredContactName: '245@:', // Empty input to trigger validation error
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
