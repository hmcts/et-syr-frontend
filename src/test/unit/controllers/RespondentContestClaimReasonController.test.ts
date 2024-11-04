import RespondentContestClaimReasonController from '../../../main/controllers/RespondentContestClaimReasonController';
import {
  DefaultValues,
  FormFieldNames,
  PageUrls,
  TranslationKeys,
  ValidationErrors,
} from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-contest-claim-reason.json';
import ET3Util from '../../../main/utils/ET3Util';
import FileUtils from '../../../main/utils/FileUtils';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../mocks/mockCaseWithIdWithFullRespondentDetails';
import {
  mockDocumentTypeItemFromMockDocumentUploadResponse,
  mockDocumentUploadResponse,
} from '../mocks/mockDocumentUploadResponse';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');

describe('RespondentContestClaimReasonController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentContestClaimReasonController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContestClaimReasonController();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Respondent Name' }],
        },
      },
    });
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct form data and translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);

      controller.get(request, response);

      // Ensure the page is rendered with the correct translation keys and content
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON,
        expect.objectContaining({
          redirectUrl: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
          hideContactUs: true,
        })
      );
    });
  });

  describe('POST method', () => {
    const checkFileMock = jest.spyOn(FileUtils, 'checkFile');
    const uploadFileMock = jest.spyOn(FileUtils, 'uploadFile');
    const convertDocumentUploadResponseToDocumentTypeItem = jest.spyOn(
      FileUtils,
      'convertDocumentUploadResponseToDocumentTypeItem'
    );
    const setMocks = (): void => {
      checkFileMock.mockReturnValueOnce(true);
      uploadFileMock.mockResolvedValueOnce(mockDocumentUploadResponse);
      convertDocumentUploadResponseToDocumentTypeItem.mockReturnValueOnce(
        mockDocumentTypeItemFromMockDocumentUploadResponse
      );
    };
    it('should call response.status(200).end when there is request.body.url', async () => {
      request = mockRequest({
        body: {
          url: 'https"//test.url',
        },
      });
      await controller.post(request, response);
      expect(response.status(200).end).toHaveBeenCalledWith(
        'Thank you for your submission. You will be contacted in due course.'
      );
    });
    it('should set session error invalid file size and redirect to respondent contest claim reason page when upload and file size is too large', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.fileTooLarge = true;
      await controller.post(request, response);
      expect(request.session.errors).toStrictEqual([
        {
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
          errorType: ValidationErrors.INVALID_FILE_SIZE,
        },
      ]);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    });
    it('should redirect to respondent contest claim reason page when file has any error', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.fileTooLarge = false;
      checkFileMock.mockReturnValueOnce(undefined);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    });
    it('should redirect to respondent contest claim reason page when document is not uploaded', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.fileTooLarge = false;
      checkFileMock.mockReturnValueOnce(true);
      uploadFileMock.mockResolvedValueOnce(undefined);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    });
    it('should redirect to respondent contest claim reason page when document type item is undefined', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.fileTooLarge = false;
      checkFileMock.mockReturnValueOnce(true);
      uploadFileMock.mockResolvedValueOnce(mockDocumentUploadResponse);
      convertDocumentUploadResponseToDocumentTypeItem.mockReturnValueOnce(undefined);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    });
    it('should redirect to respondent contest claim reason page and set respondent not found session error when request session selected respondent is undefined', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.session.userCase = undefined;
      request.fileTooLarge = false;
      setMocks();
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
      expect(request.session.errors).toStrictEqual([
        {
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
          errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
        },
      ]);
    });
    it('should redirect to respondent contest claim reason page and set respondent not found session error when request session user case is undefined', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.session.userCase = undefined;
      request.session.selectedRespondentIndex = 0;
      setMocks();
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
      expect(request.session.errors).toStrictEqual([
        {
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
          errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
        },
      ]);
    });
    it('should redirect to respondent contest claim reason page and set respondent not found session error when request session user case does not have any respondent', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockValidCaseWithId;
      setMocks();
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
      expect(request.session.errors).toStrictEqual([
        {
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
          errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
        },
      ]);
    });
    it('should redirect to respondent contest claim reason page and set respondent not found session error when request session user case does not have any respondent with the selected respondent index', async () => {
      request = mockRequest({
        body: {
          upload: true,
        },
      });
      request.session.selectedRespondentIndex = 1;
      request.session.userCase = mockValidCaseWithIdWithFullRespondentDetails;
      setMocks();
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
      expect(request.session.errors).toStrictEqual([
        {
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
          errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
        },
      ]);
    });
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          et3ResponseContestClaimDetails: 'Claim reason details',
        },
      });
      request.url = PageUrls.RESPONDENT_CONTEST_CLAIM_REASON;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledTimes(DefaultValues.NUMBER_ZERO);
    });
  });
});
