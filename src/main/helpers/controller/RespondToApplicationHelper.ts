import { CaseWithId, YesOrNo } from '../../definitions/case';
import { ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import { isContentCharsOrLess, isFieldFilledIn, isOptionSelected } from '../../validators/validator';

/**
 * Check and return errors in Respond to Application page
 * @param formData form data from Contact Tribunal input
 */
export const getFormDataError = (formData: Partial<CaseWithId>): FormError => {
  const { responseText, hasSupportingMaterial } = formData;

  const isTextFilled = isFieldFilledIn(responseText) === undefined;
  const isRadioFilled = isOptionSelected(hasSupportingMaterial) === undefined;

  if (isTextFilled) {
    const tooLong = isContentCharsOrLess(2500)(responseText);
    if (tooLong) {
      return { propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG };
    }

    if (!isRadioFilled) {
      return { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED };
    }
  } else {
    if (!isRadioFilled) {
      return { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED };
    }

    if (hasSupportingMaterial === YesOrNo.NO) {
      return { propertyName: 'responseText', errorType: 'requiredFile' };
    }
  }
};
