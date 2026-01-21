import { YesOrNo } from '../../../../main/definitions/case';
import { ValidationErrors } from '../../../../main/definitions/constants';
import { getFormError } from '../../../../main/helpers/controller/RespondToNotificationControllerHelper';
import { mockValidMulterFile } from '../../mocks/mockExpressMulterFile';
import { mockRequest } from '../../mocks/mockRequest';

describe('Respond to Notification Helper', () => {
  describe('getFormError', () => {
    it('should return error if hasSupportingMaterial is not selected', () => {
      const req = mockRequest({});
      const formData = {};
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'hasSupportingMaterial',
        errorType: ValidationErrors.REQUIRED,
      });
    });

    it('should return error if hasSupportingMaterial is YES and no file uploaded', () => {
      const req = mockRequest({
        file: mockValidMulterFile,
      });
      const formData = { hasSupportingMaterial: YesOrNo.YES };
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'supportingMaterialFile',
        errorType: ValidationErrors.WITHOUT_UPLOAD_BUTTON,
      });
    });

    it('should return error if hasSupportingMaterial is YES and supportingMaterialFile is empty', () => {
      const req = mockRequest({
        body: {
          upload: true,
        },
      });
      const formData = { hasSupportingMaterial: YesOrNo.YES };
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'supportingMaterialFile',
        errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
      });
    });

    it('should return error if hasSupportingMaterial is NO and responseText is not filled', () => {
      const req = mockRequest({});
      const formData = { hasSupportingMaterial: YesOrNo.NO, responseText: '' };
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'responseText',
        errorType: ValidationErrors.REQUIRED_FILE,
      });
    });

    it('should return error if responseText is too long', () => {
      const req = mockRequest({});
      const formData = { hasSupportingMaterial: YesOrNo.NO, responseText: 'a'.repeat(2501) };
      const error = getFormError(req, formData);
      expect(error).toEqual({
        propertyName: 'responseText',
        errorType: ValidationErrors.TOO_LONG,
      });
    });

    it('should return undefined if all validations pass', () => {
      const req = mockRequest({
        userCase: {
          supportingMaterialFile: {
            document_binary_url: 'https://dummy/binary',
            document_url: 'https://dummy',
            document_filename: 'test.pdf',
          },
        },
      });
      const formData = { hasSupportingMaterial: YesOrNo.YES };
      const error = getFormError(req, formData);
      expect(error).toBeUndefined();
    });
  });
});
