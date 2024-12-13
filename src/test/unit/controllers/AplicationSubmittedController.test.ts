import ApplicationSubmittedController from '../../../main/controllers/ApplicationSubmittedController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import DateUtils from '../../../main/utils/DateUtils';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import ObjectUtils from '../../../main/utils/ObjectUtils';
import StringUtils from '../../../main/utils/StringUtils';
import UrlUtils from '../../../main/utils/UrlUtils';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/utils/DateUtils');
jest.mock('../../../main/utils/DocumentUtils');
jest.mock('../../../main/utils/ObjectUtils');
jest.mock('../../../main/utils/StringUtils');
jest.mock('../../../main/utils/UrlUtils');

describe('ApplicationSubmittedController', () => {
  let controller: ApplicationSubmittedController;
  let req: AppRequest;
  let res: ReturnType<typeof mockResponse>;
  const mockDate = '12/10/2023';
  const documentId = 'doc123';
  const documentName = 'ET3 Form';
  const documentNameWelsh = 'ET3 Form Welsh';
  const employerClaimDocumentName = 'Employer Claim Document';
  const attachedDocuments = '<a href="getCaseDocument/empDoc456" target="_blank">Document</a><br>';

  beforeEach(() => {
    controller = new ApplicationSubmittedController();
    req = mockRequest({
      session: {
        userCase: mockCaseWithIdWithRespondents,
      },
    }) as AppRequest;
    req.session.selectedRespondentIndex = 0;
    req.session.userCase.responseReceivedDate = '2023-10-12';
    req.session.userCase.respondents = [
      {
        et3Form: {
          document_url: 'https://example.com/doc123',
          document_filename: documentName,
          document_binary_url: '',
          category_id: '',
          upload_timestamp: '',
        },
        et3FormWelsh: {
          document_url: '',
          document_binary_url: '',
          document_filename: documentNameWelsh,
          category_id: '',
          upload_timestamp: '',
        },
        et3ResponseContestClaimDocument: [],
        et3ResponseEmployerClaimDocument: {
          document_url: 'url',
          document_filename: employerClaimDocumentName,
          document_binary_url: 'b_url',
          category_id: 'c_id',
          upload_timestamp: 'upload_time',
        },
      },
    ];

    res = mockResponse();

    jest.clearAllMocks();

    // Common mocks
    (DateUtils.formatDateStringToDDMMYYYY as jest.Mock).mockReturnValue(mockDate);
    (DocumentUtils.findDocumentIdByURL as jest.Mock).mockReturnValue(documentId);
    (DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes as jest.Mock).mockReturnValue(attachedDocuments);
    (UrlUtils.getCaseDetailsUrlByRequest as jest.Mock).mockReturnValue('/case-details/12345');
    (ObjectUtils.isNotEmpty as jest.Mock).mockReturnValue(true);
    (StringUtils.isNotBlank as jest.Mock).mockReturnValue(true);
  });

  describe('GET method', () => {
    it('should render the application submitted page with the correct data', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (getLanguageParam as jest.Mock).mockReturnValue('?lng=en');

      // Mock translations
      (req.t as unknown as jest.Mock).mockImplementation((key: string) => {
        if (key === TranslationKeys.COMMON) {
          return { common: 'Common Translation' };
        }
        if (key === TranslationKeys.APPLICATION_SUBMITTED) {
          return { submitted: 'Application Submitted' };
        }
        return {};
      });

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_SUBMITTED, {
        common: 'Common Translation',
        submitted: 'Application Submitted',
        et3ResponseSubmitted: mockDate,
        userCase: req.session.userCase,
        attachedDocuments:
          attachedDocuments +
          '<a href="getCaseDocument/' +
          documentId +
          '" target="_blank">' +
          employerClaimDocumentName +
          '</a><br>',
        redirectUrl: '/case-details/12345',
        welshEnabled: true,
        languageParam: '?lng=en',
        selectedRespondent: req.session.userCase.respondents[0],
        et3FormId: documentId,
        et3FormName: documentName,
        contactTribunalUrl: '/holding-page?lng=en',
      });
    });

    it('should render the application submitted page with the correct data (welsh)', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (getLanguageParam as jest.Mock).mockReturnValue('?lng=cy');

      // Mock translations
      (req.t as unknown as jest.Mock).mockImplementation((key: string) => {
        if (key === TranslationKeys.COMMON) {
          return { common: 'Common Translation' };
        }
        if (key === TranslationKeys.APPLICATION_SUBMITTED) {
          return { submitted: 'Application Submitted' };
        }
        return {};
      });

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_SUBMITTED, {
        common: 'Common Translation',
        submitted: 'Application Submitted',
        et3ResponseSubmitted: mockDate,
        userCase: req.session.userCase,
        attachedDocuments:
          attachedDocuments +
          '<a href="getCaseDocument/' +
          documentId +
          '" target="_blank">' +
          employerClaimDocumentName +
          '</a><br>',
        redirectUrl: '/case-details/12345',
        welshEnabled: true,
        languageParam: '?lng=cy',
        selectedRespondent: req.session.userCase.respondents[0],
        et3FormId: documentId,
        et3FormName: documentNameWelsh,
        contactTribunalUrl: '/holding-page?lng=cy',
      });
    });

    it('should render the application submitted page without the Welsh document link when Welsh is disabled', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      (getLanguageParam as jest.Mock).mockReturnValue('?lng=en');
      (StringUtils.isNotBlank as jest.Mock).mockReturnValue(false);

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.APPLICATION_SUBMITTED,
        expect.objectContaining({
          welshEnabled: false,
          attachedDocuments:
            attachedDocuments +
            '<a href="getCaseDocument/' +
            documentId +
            '" target="_blank">' +
            employerClaimDocumentName +
            '</a><br>',
        })
      );
    });
  });
});
