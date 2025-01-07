import { YesOrNo } from '../../../../main/definitions/case';
import { ValidationErrors } from '../../../../main/definitions/constants';
import { getFormDataError } from '../../../../main/helpers/controller/RespondToTribunalHelper';

describe('getFormDataError', () => {
  it('should return errors when both responseText and hasSupportingMaterial are not provided', () => {
    const formData = {};
    const errors = getFormDataError(formData);
    expect(errors).toEqual([
      { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED },
      { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED },
    ]);
  });

  it('should return errors if hasSupportingMaterial is NO and responseText is not provided', () => {
    const formData = { hasSupportingMaterial: YesOrNo.NO };
    const errors = getFormDataError(formData);
    expect(errors).toEqual([
      { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED },
      { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED },
    ]);
  });

  it('should return error when responseText exceeds 2500 characters', () => {
    const longText = 'a'.repeat(2501);
    const formData = { responseText: longText, hasSupportingMaterial: YesOrNo.NO };
    const errors = getFormDataError(formData);
    expect(errors).toEqual([{ propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG }]);
  });

  it('should return no errors when responseText is provided and within the limit', () => {
    const validText = 'a'.repeat(2500);
    const formData = { responseText: validText, hasSupportingMaterial: YesOrNo.NO };
    const errors = getFormDataError(formData);
    expect(errors).toBeUndefined();
  });

  it('should return no errors when hasSupportingMaterial is YES and responseText is empty', () => {
    const formData = { responseText: '', hasSupportingMaterial: YesOrNo.YES };
    const errors = getFormDataError(formData);
    expect(errors).toBeUndefined();
  });
});
