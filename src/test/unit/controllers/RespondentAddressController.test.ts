import RespondentAddressController from '../../../main/controllers/RespondentAddressController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/helpers/CaseHelpers');

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3ResponseWithET3FormMock = jest.spyOn(ET3Util, 'updateET3ResponseWithET3Form');

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

    req.body.et3IsRespondentAddressCorrect = YesOrNo.NO;
    req.session.selectedRespondentIndex = 0;
    req.session.userCase = mockCaseWithIdWithRespondents;

    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ADDRESS, expect.anything());

    // Check that the form label functions return the correct values
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(
      formContent.fields.et3IsRespondentAddressCorrect.label({ correctAddressQuestion: 'Is this the correct address?' })
    ).toBe('Is this the correct address?');
    expect(formContent.fields.et3IsRespondentAddressCorrect.values[0].label({ yes: 'Yes' })).toBe('Yes');
    expect(formContent.fields.et3IsRespondentAddressCorrect.values[1].label({ no: 'No' })).toBe('No');
  });

  it('should redirect to RESPONDENT_PREFERRED_CONTACT_NAME when YesOrNo.YES is selected', async () => {
    req.body.et3IsRespondentAddressCorrect = YesOrNo.YES;
    req.session.selectedRespondentIndex = 0;
    req.session.userCase = mockCaseWithIdWithRespondents;
    // Mock conditionalRedirect to return true for YesOrNo.YES
    (conditionalRedirect as jest.Mock).mockReturnValue(false);
    updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
      res.redirect(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    });
    await controller.post(req, res);

    // Assert that postLogic is called with the correct parameters
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  });

  it('should redirect to RESPONDENT_ENTER_POST_CODE when YesOrNo.NO is selected', async () => {
    // Change the request body to reflect No selection
    req.body.et3IsRespondentAddressCorrect = YesOrNo.NO;
    req.session.selectedRespondentIndex = 0;
    req.session.userCase = mockCaseWithIdWithRespondents;

    // Mock conditionalRedirect to return true for YesOrNo.NO
    (conditionalRedirect as jest.Mock).mockReturnValueOnce(true);
    updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
      res.redirect(PageUrls.RESPONDENT_ENTER_POST_CODE);
    });
    await controller.post(req, res);

    // Assert that page is redirected to preferred contact name is called with the correct parameters
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ENTER_POST_CODE);
    expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalled();
  });

  it('should redirect to RESPONDENT_ADDRESS when selected user not found', async () => {
    // Change the request body to reflect No selection
    req.body.respondentAddress = YesOrNo.NO;
    req.session.selectedRespondentIndex = undefined;
    req.session.userCase = mockCaseWithIdWithRespondents;

    // Mock conditionalRedirect to return true for YesOrNo.NO
    (conditionalRedirect as jest.Mock).mockReturnValueOnce(false);

    await controller.post(req, res);

    // Assert that page is redirected to preferred contact name is called with the correct parameters
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });

  it('should redirect to RESPONDENT_ADDRESS when session error occurs', async () => {
    // Change the request body to reflect No selection
    req.body.respondentAddress = undefined;
    req.session.selectedRespondentIndex = undefined;
    req.session.userCase = mockCaseWithIdWithRespondents;

    // Mock conditionalRedirect to return true for YesOrNo.NO
    (conditionalRedirect as jest.Mock).mockReturnValueOnce(false);

    await controller.post(req, res);

    // Assert that page is redirected to preferred contact name is called with the correct parameters
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });
});
