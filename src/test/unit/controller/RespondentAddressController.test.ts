import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentAddressController', () => {
  let controller: RespondentAddressController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentAddressController();
    req = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });
    res = mockResponse();
  });

  it('should render the Respondent Address page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      correctAddressQuestion: 'Is this the correct address?',
      yes: 'Yes',
      no: 'No',
    });

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.RESPONDENT_ADDRESS,
      expect.objectContaining({
        PageUrls,
        hideContactUs: true,
        form: expect.objectContaining({
          fields: {
            respondentAddress: expect.objectContaining({
              classes: 'govuk-radios--inline',
              id: 'respondentAddress',
              type: 'radios',
              label: expect.any(Function),
              labelHidden: false,
              values: expect.arrayContaining([
                {
                  name: 'respondentAddress',
                  label: expect.any(Function),
                  value: YesOrNo.YES,
                },
                {
                  name: 'respondentAddress',
                  label: expect.any(Function),
                  value: YesOrNo.NO,
                },
              ]),
              validator: isOptionSelected,
            }),
          },
          submit: submitButton,
          saveForLater: saveForLaterButton,
        }),
      })
    );

    // Check that the form label functions return the correct values
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(formContent.fields.respondentAddress.label({ correctAddressQuestion: 'Is this the correct address?' })).toBe(
      'Is this the correct address?'
    );
    expect(formContent.fields.respondentAddress.values[0].label({ yes: 'Yes' })).toBe('Yes');
    expect(formContent.fields.respondentAddress.values[1].label({ no: 'No' })).toBe('No');
  });

  it('should handle the post method without validation errors', async () => {
    req.body = {
      respondentAddress: 'NO', // 'Selected' value on radio button
    };

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ENTER_POST_CODE);
  });

  it('should handle the post method with validation errors', async () => {
    req.body = {
      respondentAddress: '', // Empty input to trigger validation error
    };

    await controller.post(req, res);

    expect(req.session.errors).toBeDefined();
  });
});
