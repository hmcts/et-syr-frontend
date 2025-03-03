import _ from 'lodash';

import ClaimantET1FormController from '../../../main/controllers/ClaimantET1FormController';
import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { DocumentRow } from '../../../main/definitions/document';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import ET3Util from '../../../main/utils/ET3Util';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockET1FormEnglish, mockET1FormWelsh } from '../mocks/mockDocumentUploadResponse';
import { mockedAcasForm } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

const refreshRequestUserCaseMock = jest.spyOn(ET3Util, 'refreshRequestUserCase');

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
      refreshRequestUserCaseMock.mockImplementationOnce((): Promise<void> => {
        request.session.userCase = mockValidCaseWithId;
        return undefined;
      });
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
          documentRows: undefined,
        })
      );
    });

    it('should set acas certificate and both english and welsh et1forms to session and res.render is called with mockedET1FormEnglish', async () => {
      const documentRows: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(request, [
        mockET1FormEnglish,
        mockedAcasForm,
      ]);
      refreshRequestUserCaseMock.mockImplementationOnce((): Promise<void> => {
        const userCase = _.cloneDeep(mockValidCaseWithId);
        userCase.documentCollection = [mockET1FormEnglish, mockET1FormWelsh, mockedAcasForm];
        userCase.respondents = [mockRespondentET3Model];
        userCase.acasCertNum = 'R123456_78_90';
        request.session.selectedRespondentIndex = 0;
        request.session.userCase = userCase;
        return undefined;
      });

      await controller.get(request, response);
      // Expect that res.render was called with the right template and object
      expect(request.session.et1FormWelsh).toStrictEqual(mockET1FormWelsh as ApiDocumentTypeItem);
      expect(request.session.et1FormEnglish).toStrictEqual(mockET1FormEnglish as ApiDocumentTypeItem);
      expect(request.session.selectedAcasCertificate).toStrictEqual(mockedAcasForm as ApiDocumentTypeItem);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_ET1_FORM,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.CLAIMANT_ET1_FORM,
          languageParam: 'en',
          welshEnabled: true,
          documentRows,
        })
      );
    });
  });
});
