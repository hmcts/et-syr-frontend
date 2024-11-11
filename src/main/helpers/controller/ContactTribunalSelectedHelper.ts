import { CaseWithId } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import { Application, isTypeAOrB } from '../../definitions/contact-tribunal-applications';
import { FormError } from '../../definitions/form';
import { isContentCharsOrLess, isFieldFilledIn } from '../../validators/validator';

export const getNextPage = (app: Application, userCase: CaseWithId): string => {
  return isTypeAOrB(app) ? getNextCopyPage(userCase) : PageUrls.CONTACT_TRIBUNAL_CYA;
};

const getNextCopyPage = (userCase: CaseWithId): string => {
  return isClaimantSystemUser(userCase) ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.COPY_TO_OTHER_PARTY_OFFLINE;
};

const isClaimantSystemUser = (userCase: CaseWithId): boolean => {
  if (userCase) {
    return userCase.et1OnlineSubmission !== undefined || userCase.hubLinksStatuses !== undefined; // TODO: Check and Fix this
  }
  return false;
};

export const getFormDataError = (formData: Partial<CaseWithId>): FormError => {
  const file = formData.contactApplicationFile;
  const text = formData.contactApplicationText;

  const fileProvided = file !== undefined && false; // TODO: Fix fileProvided checking
  const textProvided = isFieldFilledIn(text) === undefined;
  if (!textProvided && !fileProvided) {
    return { propertyName: 'contactApplicationText', errorType: ValidationErrors.REQUIRED };
  }

  if (isContentCharsOrLess(2500)(text)) {
    return { propertyName: 'contactApplicationText', errorType: ValidationErrors.TOO_LONG };
  }
};
