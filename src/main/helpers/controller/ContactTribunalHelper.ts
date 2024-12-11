import { CaseWithId } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import { Application, application } from '../../definitions/contact-tribunal-applications';
import { FormError } from '../../definitions/form';
import { AccordionItem, addAccordionRow } from '../../definitions/govuk/govukAccordion';
import { AnyRecord } from '../../definitions/util-types';
import { isContentCharsOrLess, isFieldFilledIn } from '../../validators/validator';
import { isTypeAOrB } from '../ApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

const getContentHtml = (key: keyof typeof application, translations: AnyRecord, languageParam: string): string => {
  return (
    '<p class="govuk-body">' +
    translations.sections[key].body +
    '</p>' +
    '<a class="govuk-link govuk-body" href="' +
    PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', application[key].url) +
    languageParam +
    '">' +
    translations.sections[key].label +
    '</a>'
  );
};

export const getApplicationsAccordionItems = (url: string, translations: AnyRecord): AccordionItem[] => {
  return (Object.keys(application) as (keyof typeof application)[]).map(key => {
    const applicationHeading = translations.sections[key].label;
    const applicationContent = getContentHtml(key, translations, getLanguageParam(url));
    return addAccordionRow(applicationHeading, applicationContent);
  });
};

export const getNextPage = (app: Application): string => {
  return isTypeAOrB(app) ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.CONTACT_TRIBUNAL_CYA;
};

export const isClaimantSystemUser = (userCase: CaseWithId): boolean => {
  // TODO: check if the claim was submitted through MyHMCTS as those would also be counted as online claims
  // TODO: refer to isClaimantNonSystemUser and isRepresentedClaimantWithMyHmctsCase
  if (userCase) {
    return true;
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
