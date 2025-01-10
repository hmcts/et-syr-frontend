import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { ValidationErrors } from '../../../../main/definitions/constants';
import { clearTempFields, getFormDataError } from '../../../../main/helpers/controller/RespondToTribunalHelper';

describe('Respond to Tribunal Helper', () => {
  describe('getFormDataError', () => {
    it('should return error when responseText is filled and hasSupportingMaterial is not selected', () => {
      const formData = { responseText: 'test' };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED });
    });

    it('should return errors when responseText is empty and hasSupportingMaterial is not selected', () => {
      const formData = {};
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: ValidationErrors.REQUIRED });
    });

    it('should return errors when responseText is empty and hasSupportingMaterial is No', () => {
      const formData = { hasSupportingMaterial: YesOrNo.NO };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: 'requiredFile' });
    });

    it('should return error when responseText is too long and hasSupportingMaterial is selected', () => {
      const longText = 'a'.repeat(2501);
      const formData = { responseText: longText, hasSupportingMaterial: YesOrNo.YES };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG });
    });

    it('should return no errors when responseText is filled and hasSupportingMaterial is Yes', () => {
      const formData = { responseText: '', hasSupportingMaterial: YesOrNo.YES };
      const errors = getFormDataError(formData);
      expect(errors).toBeUndefined();
    });

    it('should return no errors when responseText is filled and hasSupportingMaterial is selected', () => {
      const validText = 'a'.repeat(2500);
      const formData = { responseText: validText, hasSupportingMaterial: YesOrNo.NO };
      const errors = getFormDataError(formData);
      expect(errors).toBeUndefined();
    });
  });

  describe('clearTempFields', () => {
    it('should clear all temporary fields from userCase', () => {
      const userCase = {
        id: 'case123',
        responseText: 'test',
        hasSupportingMaterial: YesOrNo.YES,
        supportingMaterialFile: {
          document_url: '12345',
          document_filename: 'test.pdf',
          document_binary_url: '',
          document_size: 1000,
          document_mime_type: 'pdf',
        },
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No reason',
      } as CaseWithId;

      clearTempFields(userCase);

      expect(userCase.responseText).toBeUndefined();
      expect(userCase.hasSupportingMaterial).toBeUndefined();
      expect(userCase.supportingMaterialFile).toBeUndefined();
      expect(userCase.copyToOtherPartyYesOrNo).toBeUndefined();
      expect(userCase.copyToOtherPartyText).toBeUndefined();
    });
  });
});
