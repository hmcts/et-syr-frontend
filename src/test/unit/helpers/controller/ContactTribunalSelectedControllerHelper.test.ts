import { AppRequest } from '../../../../main/definitions/appRequest';
import { DefaultValues, PageUrls, ValidationErrors, languages } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import {
  getContactApplicationFileName,
  getFormError,
  getNextPage,
  getThisPage,
  handleFileUpload,
} from '../../../../main/helpers/controller/ContactTribunalSelectedControllerHelper';
import FileUtils from '../../../../main/utils/FileUtils';
import { mockDocumentUploadResponse } from '../../mocks/mockDocumentUploadResponse';
import { mockValidMulterFile } from '../../mocks/mockExpressMulterFile';
import { mockRequest } from '../../mocks/mockRequest';

describe('Contact Tribunal Selected Controller Helper', () => {
  describe('getContactApplicationFileName', () => {
    it('should return empty string if userCase is empty', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = undefined;
      expect(getContactApplicationFileName(req)).toBe(DefaultValues.STRING_EMPTY);
    });

    it('should return document filename if it exists', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase.contactApplicationFile = {
        document_binary_url: 'https://dummy.document.url/binary',
        document_url: 'https://dummy.document.url',
        document_filename: 'test.pdf',
      };
      expect(getContactApplicationFileName(req)).toBe('test.pdf');
    });

    it('should return empty string if document filename is blank', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase.contactApplicationFile = {
        document_binary_url: 'https://dummy.document.url/binary',
        document_url: 'https://dummy.document.url',
        document_filename: '',
      };
      expect(getContactApplicationFileName(req)).toBe(DefaultValues.STRING_EMPTY);
    });
  });

  describe('handleFileUpload', () => {
    it('should set an error if no file is uploaded', async () => {
      const req = mockRequest({
        body: {
          upload: true,
        },
      });
      const result = await handleFileUpload(req, 'contactApplicationFile');
      expect(result).toBe(true);
      expect(req.session.errors[0].errorType).toBe(ValidationErrors.INVALID_FILE_NOT_SELECTED);
    });

    it('should set an error if the file is too large', async () => {
      const req = mockRequest({
        body: {
          upload: true,
        },
        file: mockValidMulterFile,
      });
      req.fileTooLarge = true;
      const result = await handleFileUpload(req, 'contactApplicationFile');
      expect(result).toBe(true);
      expect(req.session.errors[0].errorType).toBe(ValidationErrors.INVALID_FILE_SIZE);
    });

    it('should upload file and update session', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(mockDocumentUploadResponse);
      const result = await handleFileUpload(req, 'contactApplicationFile');
      expect(result).toBe(false);
      expect(req.session.userCase.contactApplicationFile.document_filename).toBe(
        'Screenshot 2024-11-03 at 18.53.00.png'
      );
    });
  });

  describe('getFormError', () => {
    it('should return an error if both file and text are missing', () => {
      const req: AppRequest = mockRequest({});
      const formData = { contactApplicationText: '' };
      const error = getFormError(req, formData);
      expect(error).toEqual({ propertyName: 'contactApplicationText', errorType: ValidationErrors.REQUIRED });
    });

    it('should return an error if text is too long', () => {
      const req: AppRequest = mockRequest({});
      const formData = { contactApplicationText: 'A'.repeat(2501) };
      const error = getFormError(req, formData);
      expect(error).toEqual({ propertyName: 'contactApplicationText', errorType: ValidationErrors.TOO_LONG });
    });

    it('should return no error if text or file exists', () => {
      const req = mockRequest({
        session: {
          userCase: {
            contactApplicationFile: {
              document_binary_url: 'https://dummy.document.url/binary',
              document_url: 'https://dummy.document.url',
              document_filename: 'test.pdf',
            },
          },
        },
      });
      const formData = { contactApplicationText: '' };
      const error = getFormError(req, formData);
      expect(error).toBeUndefined();
    });
  });

  describe('getThisPage', () => {
    it('should return CONTACT_TRIBUNAL_SELECTED page URL', () => {
      const app = application.CHANGE_PERSONAL_DETAILS;
      const req: AppRequest = mockRequest({});
      req.url = '/some-url?lng=en';
      const result = getThisPage(app, req);
      expect(result).toBe('/contact-tribunal/change-my-personal-details?lng=en');
    });
  });

  describe('getNextPage', () => {
    const req: AppRequest = mockRequest({});
    it('should return COPY_TO_OTHER_PARTY page for Type A/B applications when claimant is system user', () => {
      const nextPage = getNextPage(application.CHANGE_PERSONAL_DETAILS, req);
      expect(nextPage).toBe(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
    });

    it('should return CONTACT_TRIBUNAL_CYA page for Type C', () => {
      const nextPage = getNextPage(application.ORDER_WITNESS_ATTEND, req);
      expect(nextPage).toBe(PageUrls.CONTACT_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
