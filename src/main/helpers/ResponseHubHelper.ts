import { RespondentET3Model, YesOrNo } from '../definitions/case';
import { PageUrls, languages } from '../definitions/constants';
import { ET3Status } from '../definitions/definition';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../definitions/links';
import StringUtils from '../utils/StringUtils';

export const shouldCaseDetailsLinkBeClickable = (status: LinkStatus): boolean => {
  return status !== LinkStatus.NOT_YET_AVAILABLE && status !== LinkStatus.CANNOT_START_YET;
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
    [ET3HubLinkNames.PayPensionBenefitDetails, PageUrls.CLAIMANT_PAY_DETAILS + baseUrls[languageParam]],
    [ET3HubLinkNames.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM + baseUrls[languageParam]],
    [ET3HubLinkNames.EmployersContractClaim, PageUrls.EMPLOYERS_CONTRACT_CLAIM + baseUrls[languageParam]],
    [ET3HubLinkNames.CheckYorAnswers, PageUrls.CHECK_YOUR_ANSWERS_ET3 + baseUrls[languageParam]],
  ]);
};

const getRespondentResponseUrl = (respondent: RespondentET3Model): string => {
  if (respondent.et3Status === ET3Status.COMPLETED || respondent.responseReceived === YesOrNo.YES) {
    return PageUrls.YOUR_RESPONSE_FORM;
  } else if (StringUtils.isBlank(respondent.et3Status) || respondent.et3Status === ET3Status.IN_PROGRESS) {
    return PageUrls.RESPONDENT_RESPONSE_LANDING;
  }
  return PageUrls.NOT_IMPLEMENTED;
};

export const getET3CaseDetailsLinksUrlMap = (
  languageParam: string,
  respondent: RespondentET3Model
): Map<string, string> => {
  const caseDetailsLinksMap = new Map<string, string>();
  caseDetailsLinksMap.set(ET3CaseDetailsLinkNames.PersonalDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]);
  caseDetailsLinksMap.set(ET3CaseDetailsLinkNames.ET1ClaimForm, PageUrls.CLAIMANT_ET1_FORM + baseUrls[languageParam]);
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.ClaimantContactDetails,
    PageUrls.CLAIMANT_CONTACT_DETAILS + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.RespondentResponse,
    getRespondentResponseUrl(respondent) + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(ET3CaseDetailsLinkNames.HearingDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]);
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.YourRequestsAndApplications,
    PageUrls.YOUR_REQUEST_AND_APPLICATIONS + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.ClaimantApplications,
    PageUrls.CLAIMANTS_APPLICATIONS + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.OtherRespondentApplications,
    PageUrls.OTHER_RESPONDENT_APPLICATIONS + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(ET3CaseDetailsLinkNames.ContactTribunal, PageUrls.CONTACT_TRIBUNAL + baseUrls[languageParam]);
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.TribunalNotification,
    PageUrls.NOTIFICATIONS + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(
    ET3CaseDetailsLinkNames.TribunalJudgements,
    PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]
  );
  caseDetailsLinksMap.set(ET3CaseDetailsLinkNames.Documents, PageUrls.DOCUMENTS + baseUrls[languageParam]);
  return caseDetailsLinksMap;
};
