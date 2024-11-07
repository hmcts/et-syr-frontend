import { PageUrls } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import { AccordionItem, addAccordionRow } from '../../definitions/govuk/govukAccordion';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

export const isClaimantSystemUser = (): boolean => {
  return true;
};

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
