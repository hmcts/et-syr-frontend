import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import ObjectUtils from '../../utils/ObjectUtils';
import { isContentCharsOrLess, isFieldFilledIn, isOptionSelected } from '../../validators/validator';

import { isClaimantSystemUser } from './ContactTribunalHelper';

/**
 * Handle form validation. Return FormError when error found.
 * @param req request
 * @param formData form data
 */
export const getFormError = (req: AppRequest, formData: Partial<CaseWithId>): FormError => {
  const { userCase } = req.session;
  const { responseText, hasSupportingMaterial } = formData;

  const isRadioFilled = isOptionSelected(hasSupportingMaterial) === undefined;
  if (!isRadioFilled) {
    return { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED };
  }

  if (hasSupportingMaterial === YesOrNo.YES) {
    if (ObjectUtils.isNotEmpty(req.file) && ObjectUtils.isEmpty(userCase.supportingMaterialFile)) {
      return { propertyName: 'supportingMaterialFile', errorType: ValidationErrors.WITHOUT_UPLOAD_BUTTON };
    }

    if (ObjectUtils.isEmpty(userCase.supportingMaterialFile)) {
      return { propertyName: 'supportingMaterialFile', errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED };
    }
  } else {
    const isTextFilled = isFieldFilledIn(responseText) === undefined;
    if (!isTextFilled) {
      return { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED_FILE };
    }
  }

  const tooLong = isContentCharsOrLess(2500)(responseText);
  if (tooLong) {
    return { propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG };
  }
};

/**
 * return RESPOND_TO_NOTIFICATION_COPY or OFFLINE page
 * @param userCase
 */
export const getRespondNotificationCopyPage = (userCase: CaseWithId): string => {
  return isClaimantSystemUser(userCase)
    ? PageUrls.RESPOND_TO_NOTIFICATION_COPY
    : PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE;
};
