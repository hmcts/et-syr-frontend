import _ from 'lodash';

import DocumentsController from '../../../main/controllers/DocumentsController';
import { CaseWithId, RespondentET3Model } from '../../../main/definitions/case';
import { AllDocumentTypes, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { DocumentRow } from '../../../main/definitions/document';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import ET3Util from '../../../main/utils/ET3Util';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import {
  mockedET1FormEnglishDocumentApiModel,
  mockedET1FormWelshDocumentApiModel,
} from '../mocks/mockDocumentApiModel';
import { mockET1FormEnglish, mockET1FormWelsh } from '../mocks/mockDocumentUploadResponse';
import { mockedAcasForm } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

describe('Documents Controller', () => {
  let controller: DocumentsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new DocumentsController();
    response = mockResponse();
    request = mockRequest({});

    // Mocking external dependencies
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.DOCUMENTS);
    (getFlagValue as jest.Mock).mockResolvedValue(true); // Assume Welsh is enabled for the test
    (getLanguageParam as jest.Mock).mockReturnValue('en');
  });

  describe('GET method', () => {
    const refreshRequestUserCaseMock = jest.spyOn(ET3Util, 'refreshRequestUserCase');
    it('should call res.render of documents controller without any documentRows', async () => {
      // Call the controller's GET method
      refreshRequestUserCaseMock.mockImplementationOnce((): Promise<void> => {
        request.session.userCase = mockValidCaseWithId;
        return undefined;
      });
      await controller.get(request, response);

      // Expect that res.render was called with the right template and object
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.DOCUMENTS,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.DOCUMENTS,
          languageParam: 'en',
          welshEnabled: true,
          documentRows: undefined,
        })
      );
    });

    it('should set all documents', async () => {
      refreshRequestUserCaseMock.mockImplementationOnce((): Promise<void> => {
        const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
        userCase.documentCollection = [mockET1FormEnglish, mockET1FormWelsh, mockedAcasForm];
        const respondent: RespondentET3Model = _.cloneDeep(mockRespondentET3Model);
        respondent.et3ResponseEmployerClaimDocument = {
          upload_timestamp: '2024-11-04T13:53:43.000+00:00',
          document_binary_url: 'https://document/asdjfasdfasdfads/binary',
          document_url: 'https://document/asdjfasdfasdfads',
          document_filename: 'dummy_document_file_name',
          category_id: AllDocumentTypes.ET3_ATTACHMENT,
        };
        respondent.et3ResponseContestClaimDocument = [
          mockedET1FormWelshDocumentApiModel,
          mockedET1FormEnglishDocumentApiModel,
        ];
        userCase.respondents = [respondent];
        request.session.userCase = userCase;
        request.session.selectedRespondentIndex = 0;
        return undefined;
      });
      const documentRows: DocumentRow[] = DocumentUtils.convertApiDocumentTypeItemListToDocumentRows(request, [
        mockET1FormEnglish,
        mockET1FormWelsh,
        mockedAcasForm,
        mockedET1FormWelshDocumentApiModel,
        mockedET1FormEnglishDocumentApiModel,
      ]);
      documentRows.push({
        id: 'asdjfasdfasdfads',
        type: AllDocumentTypes.ET3_ATTACHMENT,
        date: '4 November 2024',
        name: 'dummy_document_file_name',
      });
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.DOCUMENTS,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.DOCUMENTS,
          languageParam: 'en',
          welshEnabled: true,
          documentRows,
        })
      );
    });
  });
});
