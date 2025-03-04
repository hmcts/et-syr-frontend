import { AppRequest } from '../../../../main/definitions/appRequest';
import { Applicant, ValidationErrors } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import {
  getFormError,
  getNextPage,
  handleFileUpload,
} from '../../../../main/helpers/controller/RespondToApplicationSupportingMaterialHelper';
import FileUtils from '../../../../main/utils/FileUtils';
import { mockDocumentUploadResponse } from '../../mocks/mockDocumentUploadResponse';
import { mockValidMulterFile } from '../../mocks/mockExpressMulterFile';
import { mockRequest } from '../../mocks/mockRequest';

describe('Respond to Application Supporting Material Controller Helper', () => {
  describe('handleFileUpload', () => {
    it('should set an error if no file is uploaded', async () => {
      const req = mockRequest({
        body: {
          upload: true,
        },
      });
      const result = await handleFileUpload(req, 'supportingMaterialFile');
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
      const result = await handleFileUpload(req, 'supportingMaterialFile');
      expect(result).toBe(true);
      expect(req.session.errors[0].errorType).toBe(ValidationErrors.INVALID_FILE_SIZE);
    });

    it('should return true if file check fails', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(false);
      const result = await handleFileUpload(req, 'supportingMaterialFile');
      expect(result).toBe(true);
      expect(FileUtils.checkFile).toHaveBeenCalledWith(req, 'supportingMaterialFile');
    });

    it('should return true if file upload response is null', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
      FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(null);
      const result = await handleFileUpload(req, 'supportingMaterialFile');
      expect(result).toBe(true);
      expect(FileUtils.uploadFile).toHaveBeenCalledWith(req);
    });

    it('should return true if file upload response is undefined', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
      FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(undefined);
      const result = await handleFileUpload(req, 'supportingMaterialFile');
      expect(result).toBe(true);
      expect(FileUtils.uploadFile).toHaveBeenCalledWith(req);
    });

    it('should upload file and update session', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
      FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(mockDocumentUploadResponse);
      const result = await handleFileUpload(req, 'supportingMaterialFile');
      expect(result).toBe(false);
      expect(req.session.userCase.supportingMaterialFile.document_filename).toBe(
        'Screenshot 2024-11-03 at 18.53.00.png'
      );
    });
  });

  describe('getFormError', () => {
    it('should return no error if file exists but text is missing', () => {
      const req = mockRequest({
        session: {
          userCase: {
            supportingMaterialFile: {
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

    it('should return an error if file is uploaded but not properly assigned to the session case', () => {
      const req = mockRequest({
        file: mockValidMulterFile,
      });
      const formData = { responseText: '' };
      const error = getFormError(req, formData);
      expect(error).toEqual({ propertyName: 'supportingMaterialFile', errorType: 'WithoutUploadButton' });
    });

    it('should return an error if file is missing', () => {
      const req = mockRequest({});
      const formData = { responseText: '' };
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'supportingMaterialFile',
        errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
      });
    });

    it('should return an error if text is too long', () => {
      const req = mockRequest({
        session: {
          userCase: {
            supportingMaterialFile: {
              document_binary_url: 'https://dummy.document.url/binary',
              document_url: 'https://dummy.document.url',
              document_filename: 'test.pdf',
            },
          },
        },
      });
      const formData = { responseText: 'A'.repeat(2501) };
      const error = getFormError(req, formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG });
    });
  });

  describe('getNextPage', () => {
    it('should return the current page URL if upload is present in request body', () => {
      const req: AppRequest = mockRequest({
        body: { upload: true },
      });
      const result = getNextPage(req);
      expect(result).toBe('/respond-to-application-supporting-material?lng=en');
    });

    it('should return COPY_TO_OTHER_PARTY page for Type A/B applications when claimant is system user', () => {
      const req: AppRequest = mockRequest({
        userCase: {
          selectedGenericTseApplication: {
            value: {
              applicant: Applicant.RESPONDENT,
              type: application.CHANGE_PERSONAL_DETAILS.code,
            },
          },
        },
      });
      const result = getNextPage(req);
      expect(result).toBe('/respond-to-application-copy-to-other-party?lng=en');
    });

    it('should return CONTACT_TRIBUNAL_CYA page for Type C', () => {
      const req: AppRequest = mockRequest({
        userCase: {
          selectedGenericTseApplication: {
            value: {
              applicant: Applicant.RESPONDENT,
              type: application.ORDER_WITNESS_ATTEND.code,
            },
          },
        },
      });
      const result = getNextPage(req);
      expect(result).toBe('/respond-to-application-check-your-answers?lng=en');
    });
  });
});
