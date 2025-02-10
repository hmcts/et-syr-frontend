import { YesOrNo } from '../../../../main/definitions/case';
import { ValidationErrors } from '../../../../main/definitions/constants';
import { getFormDataError } from '../../../../main/helpers/controller/RespondToApplicationHelper';

describe('Respond to Application Helper', () => {
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
});
