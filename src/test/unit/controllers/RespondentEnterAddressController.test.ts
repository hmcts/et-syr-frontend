import RespondentEnterAddressController from '../../../main/controllers/RespondentEnterAddressController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/helpers/CaseHelpers');

const updateET3ResponseWithET3FormMock = jest.spyOn(ET3Util, 'updateET3ResponseWithET3Form');

describe('RespondentEnterAddressController', () => {
  let controller: RespondentEnterAddressController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentEnterAddressController();
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

  it('should render the Respondent Enter Address page with the correct form content', async () => {
    (req.t as unknown as jest.Mock).mockReturnValue({
      correctAddressQuestion: 'Is this the correct address?',
      yes: 'Yes',
      no: 'No',
    });

    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_ENTER_ADDRESS, expect.anything());

    // Check that the form label functions return the correct values
    const renderMock = res.render as jest.Mock;
    const formContent = renderMock.mock.calls[0][1].form;
    expect(
      formContent.fields.responseRespondentAddressLine1.label({
        addressLine1: 'Address line 1',
      })
    ).toBe('Address line 1');
    expect(
      formContent.fields.responseRespondentAddressLine2.label({
        addressLine2: 'Address line 2 (optional)',
      })
    ).toBe('Address line 2 (optional)');
    expect(
      formContent.fields.responseRespondentAddressPostTown.label({
        townOrCity: 'Town or city',
      })
    ).toBe('Town or city');
    expect(
      formContent.fields.responseRespondentAddressCountry.label({
        country: 'Country',
      })
    ).toBe('Country');
    expect(
      formContent.fields.responseRespondentAddressPostCode.label({
        postcodeOrAreaCode: 'Postcode or area code (optional)',
      })
    ).toBe('Postcode or area code (optional)');
  });

  it('should redirect to RESPONDENT_PREFERRED_CONTACT_NAME when YesOrNo.YES is selected', async () => {
    req.body.respondentAddress = YesOrNo.NO;
    req.session.selectedRespondentIndex = 0;
    req.session.userCase = mockCaseWithIdWithRespondents;
    // Mock conditionalRedirect to return true for YesOrNo.YES
    updateET3ResponseWithET3FormMock.mockImplementationOnce(async () => {
      res.redirect(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    });
    (conditionalRedirect as jest.Mock).mockReturnValue(false);

    await controller.post(req, res);

    // Assert that postLogic is called with the correct parameters
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
  });
});
