import RespondentEnterPostCodeController from '../../../main/controllers/RespondentEnterPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isValidUKPostcode } from '../../../main/validators/address_validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentEnterPostCodeController', () => {
  let controller: RespondentEnterPostCodeController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentEnterPostCodeController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent Enter Post Code page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      enterPostcode: 'Enter your postcode',
      findAddress: 'Find Address',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ENTER_POST_CODE,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            respondentEnterPostcode: expect.objectContaining({
              id: 'respondentEnterPostcode',
              type: 'text',
              label: expect.any(Function),
              classes: 'govuk-label govuk-!-width-one-half',
              attributes: expect.objectContaining({
                maxLength: 14,
                autocomplete: 'postal-code',
              }),
              validator: isValidUKPostcode,
            }),
          },
          submit: {
            type: submitButton,
            text: expect.any(Function),
          },
          saveForLater: saveForLaterButton,
        }),
        userCase: {},
        redirectUrl: expect.any(String),
        languageParam: expect.any(String),
        sessionErrors: req.session.errors,
      })
    );

    // Check that the form label and submit button text functions return the correct values
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(formContent.fields.respondentEnterPostcode.label({ enterPostcode: 'Enter your postcode' })).toBe(
      'Enter your postcode'
    );
    expect(formContent.submit.text({ findAddress: 'Find Address' })).toBe('Find Address');
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      respondentEnterPostcode: 'AB12 3CD', // Valid postcode for the test
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_SELECT_POST_CODE);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      respondentEnterPostcode: '', // Empty input to trigger validation error
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
