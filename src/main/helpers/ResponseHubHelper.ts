import { PageUrls, languages } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../definitions/links';

export const shouldCaseDetailsLinkBeClickable = (status: LinkStatus): boolean => {
  return status !== LinkStatus.NOT_YET_AVAILABLE;
};

export const shouldHubLinkBeClickable = (status: HubLinkStatus, linkName: string): boolean => {
  if (status === HubLinkStatus.NOT_YET_AVAILABLE) {
    return false;
  }

  return !(
    status === HubLinkStatus.WAITING_FOR_TRIBUNAL &&
    linkName !== HubLinkNames.RespondentApplications &&
    linkName !== HubLinkNames.RequestsAndApplications
  );
};

const baseUrls = {
  [languages.ENGLISH_URL_PARAMETER]: '',
  [languages.WELSH_URL_PARAMETER]: languages.WELSH_URL_PARAMETER,
};

export const getET3HubLinksUrlMap = (languageParam: string): Map<string, string> => {
  return new Map<string, string>([
    [ET3HubLinkNames.ContactDetails, PageUrls.RESPONDENT_NAME + baseUrls[languageParam]],
    [ET3HubLinkNames.EmployerDetails, PageUrls.HEARING_PREFERENCES + baseUrls[languageParam]],
    [
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + baseUrls[languageParam],
    ],
    [ET3HubLinkNames.PayPensionBenefitDetails, PageUrls.CLAIMANT_PENSION_AND_BENEFITS + baseUrls[languageParam]],
    [ET3HubLinkNames.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM + baseUrls[languageParam]],
    [ET3HubLinkNames.EmployersContractClaim, PageUrls.EMPLOYERS_CONTRACT_CLAIM + baseUrls[languageParam]],
    [ET3HubLinkNames.CheckYorAnswers, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
  ]);
};

export const getET3CaseDetailsLinksUrlMap = (languageParam: string): Map<string, string> => {
  return new Map<string, string>([
    [ET3CaseDetailsLinkNames.PersonalDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.ET1ClaimForm, PageUrls.CLAIMANT_ET1_FORM + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.HearingDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [
      ET3CaseDetailsLinkNames.ContactTribunal,
      PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + baseUrls[languageParam],
    ],
    [ET3CaseDetailsLinkNames.TribunalJudgements, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.Documents, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
  ]);
};
