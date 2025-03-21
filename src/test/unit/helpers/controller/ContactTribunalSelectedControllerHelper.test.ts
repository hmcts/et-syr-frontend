import { AppRequest } from '../../../../main/definitions/appRequest';
import { ValidationErrors } from '../../../../main/definitions/constants';
import {
  getFormError,
  handleFileUpload,
} from '../../../../main/helpers/controller/ContactTribunalSelectedControllerHelper';
import FileUtils from '../../../../main/utils/FileUtils';
import { mockDocumentUploadResponse } from '../../mocks/mockDocumentUploadResponse';
import { mockValidMulterFile } from '../../mocks/mockExpressMulterFile';
import { mockRequest } from '../../mocks/mockRequest';

describe('Contact Tribunal Selected Controller Helper', () => {
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

    it('should return true if file check fails', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(false);
      const result = await handleFileUpload(req, 'contactApplicationFile');
      expect(result).toBe(true);
      expect(FileUtils.checkFile).toHaveBeenCalledWith(req, 'contactApplicationFile');
    });

    it('should return true if file upload response is null', async () => {
      const req = mockRequest({
        body: { upload: true },
        file: mockValidMulterFile,
      });
      FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
      FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(null);
      const result = await handleFileUpload(req, 'contactApplicationFile');
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
      const result = await handleFileUpload(req, 'contactApplicationFile');
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

    it('should return an error if file is uploaded but not properly assigned to the session case', () => {
      const req = mockRequest({
        file: mockValidMulterFile,
        session: { userCase: {} },
      });
      const formData = { contactApplicationText: '' };
      const error = getFormError(req, formData);
      expect(error).toEqual({ propertyName: 'contactApplicationFile', errorType: 'WithoutUploadButton' });
    });

    it('should return no error if file exists but text is missing', () => {
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

    it('should return no error if text is provided but file is missing', () => {
      const req: AppRequest = mockRequest({});
      const formData = { contactApplicationText: 'Valid text content' };
      const error = getFormError(req, formData);
      expect(error).toBeUndefined();
    });
  });
});
