import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import { isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/helpers/CaseHelpers');

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
      body: {
        respondentAddress: YesOrNo.YES,
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

  it('should redirect to RESPONDENT_PREFERRED_CONTACT_NAME when YesOrNo.YES is selected', async () => {
    // Mock conditionalRedirect to return true for YesOrNo.YES
    (conditionalRedirect as jest.Mock).mockReturnValue(true);

    await controller.post(req, res);

    // Assert that postLogic is called with the correct parameters
    expect(postLogic).toHaveBeenCalledWith(
      req,
      res,
      controller.form,
      expect.anything(),
      PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME
    );
  });

  it('should redirect to RESPONDENT_ENTER_POST_CODE when YesOrNo.NO is selected', async () => {
    // Change the request body to reflect No selection
    req.body.respondentAddress = YesOrNo.NO;

    // Mock conditionalRedirect to return true for YesOrNo.NO
    (conditionalRedirect as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

    await controller.post(req, res);

    // Assert that postLogic is called with the correct parameters
    expect(postLogic).toHaveBeenCalledWith(
      req,
      res,
      controller.form,
      expect.anything(),
      PageUrls.RESPONDENT_ENTER_POST_CODE
    );
  });
});
