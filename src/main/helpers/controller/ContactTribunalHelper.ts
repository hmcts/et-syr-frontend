import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { MY_HMCTS, PageUrls, ValidationErrors, YES } from '../../definitions/constants';
import { Application, application } from '../../definitions/contact-tribunal-applications';
import { FormError } from '../../definitions/form';
import { AccordionItem, addAccordionRow } from '../../definitions/govuk/govukAccordion';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { isContentCharsOrLess, isFieldFilledIn } from '../../validators/validator';
import { getApplicationByCode, getApplicationKey, isTypeAOrB } from '../ApplicationHelper';
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
 * Return COPY_TO_OTHER_PARTY when Type A or B, otherwise return CONTACT_TRIBUNAL_CYA
 * @param app selected application
 */
export const getNextPage = (app: Application): string => {
  return isTypeAOrB(app) ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.CONTACT_TRIBUNAL_CYA;
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
 * Check and return errors in Contact Tribunal page
 * @param formData form data from Contact Tribunal input
 */
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

/**
 * Get Contact Tribunal Check your answer content
 * @param req request
 * @param translations translations
 * */
export const getCyaContent = (req: AppRequest, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  const userCase = req.session.userCase;
  const selectedApplication = getApplicationByCode(userCase.contactApplicationType);
  const languageParam = getLanguageParam(req.url);

  rows.push(
    addSummaryRowWithAction(
      translations.applicationType,
      translations[getApplicationKey(selectedApplication)],
      PageUrls.CONTACT_TRIBUNAL + languageParam,
      translations.change,
      ''
    )
  );

  if (userCase.contactApplicationText) {
    rows.push(
      addSummaryRowWithAction(
        translations.legend,
        userCase.contactApplicationText,
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url) + languageParam,
        translations.change,
        ''
      )
    );
  }

  if (userCase.contactApplicationFile) {
    // TODO: Create Download Link
    const downloadLink = 'link';
    rows.push(
      addSummaryHtmlRowWithAction(
        translations.supportingMaterial,
        downloadLink,
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url) + languageParam,
        translations.change,
        ''
      )
    );
  }

  if (isTypeAOrB(selectedApplication)) {
    rows.push(
      addSummaryRowWithAction(
        translations.copyToOtherPartyYesOrNo,
        userCase.copyToOtherPartyYesOrNo === YesOrNo.YES ? translations.yes : translations.no,
        PageUrls.COPY_TO_OTHER_PARTY + languageParam,
        translations.change,
        ''
      )
    );

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.NO) {
      rows.push(
        addSummaryRowWithAction(
          translations.copyToOtherPartyText,
          userCase.copyToOtherPartyText,
          PageUrls.COPY_TO_OTHER_PARTY + languageParam,
          translations.change,
          ''
        )
      );
    }
  }

  return rows;
};
