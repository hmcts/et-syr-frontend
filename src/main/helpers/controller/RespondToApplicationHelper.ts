import { CaseWithId, YesOrNo } from '../../definitions/case';
import { ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import { isContentCharsOrLess, isFieldFilledIn } from '../../validators/validator';

/**
 * Check and return errors in Contact Tribunal page
 * @param formData form data from Contact Tribunal input
 */
export const getFormDataError = (formData: Partial<CaseWithId>): FormError[] => {
  const text = formData.responseText;

  const isTextProvided = isFieldFilledIn(text) === undefined;
  const isFileUpload = formData.hasSupportingMaterial === YesOrNo.YES;

  if (!isTextProvided && !isFileUpload) {
    return [
      { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED },
      { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED },
    ];
  }

  if (isContentCharsOrLess(2500)(text)) {
    return [{ propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG }];
  }
};
