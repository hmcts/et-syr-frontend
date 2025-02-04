import { CaseWithId } from '../../definitions/case';
import { MY_HMCTS, PageUrls, YES } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import { AccordionItem, addAccordionRow } from '../../definitions/govuk/govukAccordion';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

/**
 * List all applications in the Contact Tribunal page
 * @param url request url for getting language param
 * @param translations translation of the page
 */
export const getApplicationsAccordionItems = (url: string, translations: AnyRecord): AccordionItem[] => {
  return (Object.keys(application) as (keyof typeof application)[]).map(key => {
    const applicationHeading = translations.sections[key].label;
    const applicationContent = getContentHtml(key, translations, getLanguageParam(url));
    return addAccordionRow(applicationHeading, applicationContent);
  });
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

/**
 * Get Application Type as heading by url
 * @param url url of application
 * @param translations translation of the page
 */
export const getApplicationDisplayByUrl = (url: string, translations: AnyRecord): string => {
  if (!url) {
    return '';
  }
  const appKey = Object.keys(application).find(key => application[key].url === url);
  return appKey ? translations[appKey] : '';
};

/**
 * Get Application Type as heading by application code
 * @param appCode code of application
 * @param translations translation of the page
 */
export const getApplicationDisplayByCode = (appCode: string, translations: AnyRecord): string => {
  if (!appCode) {
    return '';
  }
  const appKey = Object.keys(application).find(key => application[key].code === appCode);
  return appKey ? translations[appKey] : '';
};

/**
 * Check if Claimant is represented with MyHMCTS
 * @param userCase
 * @returns boolean
 */
const isClaimantRepresentedWithMyHMCTSCase = (userCase: CaseWithId): boolean => {
  return (
    MY_HMCTS === userCase.caseSource &&
    YES === userCase.claimantRepresentedQuestion &&
    userCase.representativeClaimantType !== undefined &&
    userCase.representativeClaimantType.myHmctsOrganisation !== undefined
  );
};

/**
 * Check if Claimant is a system user
 * @param userCase
 * @returns boolean
 */
export const isClaimantSystemUser = (userCase: CaseWithId): boolean => {
  if (userCase) {
    return (
      userCase.et1OnlineSubmission !== undefined ||
      userCase.hubLinksStatuses !== undefined ||
      isClaimantRepresentedWithMyHMCTSCase(userCase)
    );
  }
  return false;
};

/**
 * Clear temporary fields stored in session
 * @param userCase session userCase
 */
export const clearTempFields = (userCase: CaseWithId): void => {
  userCase.contactApplicationType = undefined;
  userCase.contactApplicationText = undefined;
  userCase.contactApplicationFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
};
