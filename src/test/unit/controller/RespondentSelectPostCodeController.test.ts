import RespondentSelectPostCodeController from '../../../main/controllers/RespondentSelectPostCodeController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentSelectPostCodeController', () => {
  let controller: RespondentSelectPostCodeController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentSelectPostCodeController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent Select Post Code page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      selectAddress: 'Select your address',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_SELECT_POST_CODE,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            addressEnterPostcode: expect.objectContaining({
              type: 'text', // Should be 'option' when addresses are loaded based on postcode
              classes: 'govuk-select',
              label: expect.any(Function),
              id: 'addressAddressTypes',
              validator: isOptionSelected,
            }),
          },
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
        userCase: {},
        redirectUrl: expect.any(String),
        languageParam: expect.any(String),
        sessionErrors: req.session.errors,
      })
    );

    // Check that the form label function returns the correct value
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(formContent.fields.addressEnterPostcode.label({ selectAddress: 'Select your address' })).toBe(
      'Select your address'
    );
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      addressEnterPostcode: '123 Main St', // Simulating a selected address
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      addressEnterPostcode: '', // Empty input to trigger validation error
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
    expect(res.redirect).toHaveBeenCalledWith(req.url);
  });
});
