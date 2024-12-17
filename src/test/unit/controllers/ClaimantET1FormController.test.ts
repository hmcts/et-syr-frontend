import ClaimantET1FormController from '../../../main/controllers/ClaimantET1FormController';
import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

describe('Claimant ET1 Form Controller', () => {
  let controller: ClaimantET1FormController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantET1FormController();
    request = mockRequest({});
    response = mockResponse();

    // Mocking external dependencies
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.CLAIMANT_ET1_FORM);
    (getFlagValue as jest.Mock).mockResolvedValue(true); // Assume Welsh is enabled for the test
    (getLanguageParam as jest.Mock).mockReturnValue('en');
  });

  describe('GET method', () => {
    it('should call res.render with the correct parameters', async () => {
      // Call the controller's GET method
      await controller.get(request, response);

      // Expect that res.render was called with the right template and object
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_ET1_FORM,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.CLAIMANT_ET1_FORM,
          languageParam: 'en',
          welshEnabled: true,
        })
      );
    });
  });

  it('should set acas certificate and both english and welsh et1forms to session and res.render is called with mockedET1FormEnglish', async () => {
    // Call the controller's GET method
    request.session.userCase.documentCollection = [
      mockedET1FormEnglish as ApiDocumentTypeItem,
      mockedET1FormWelsh as ApiDocumentTypeItem,
      mockedAcasForm as ApiDocumentTypeItem,
    ];
    request.session.userCase.acasCertNum = 'R123456_78_90';
    await controller.get(request, response);

    // Expect that res.render was called with the right template and object
    expect(request.session.et1FormWelsh).toStrictEqual(mockedET1FormWelsh as ApiDocumentTypeItem);
    expect(request.session.et1FormEnglish).toStrictEqual(mockedET1FormEnglish as ApiDocumentTypeItem);
    expect(request.session.selectedAcasCertificate).toStrictEqual(mockedAcasForm as ApiDocumentTypeItem);
    expect(response.render).toHaveBeenCalled();
  });
});
