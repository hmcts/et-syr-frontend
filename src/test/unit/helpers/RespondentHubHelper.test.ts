import { PageUrls, languages } from '../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../../../main/definitions/hub';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames } from '../../../main/definitions/links';
import {
  getET3CaseDetailsLinksUrlMap,
  getET3HubLinksUrlMap,
  shouldHubLinkBeClickable,
} from '../../../main/helpers/ResponseHubHelper';

describe('shouldHubLinkBeClickable', () => {
  it('should not be clickable if not yet available', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.NOT_YET_AVAILABLE, undefined)).toBe(false);
  });

  it('should not be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.Documents)).toBe(false);
  });

  it('should be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.RespondentApplications)).toBe(
      true
    );
  });

  it('should not be clickable otherwise', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.IN_PROGRESS, undefined)).toBe(true);
  });
});

describe('getET3HubLinksUrlMap', () => {
  const et3HubLinksMapWelsh: Map<string, string> = new Map<string, string>([
    [ET3HubLinkNames.ContactDetails, PageUrls.RESPONDENT_NAME + languages.WELSH_URL_PARAMETER],
    [ET3HubLinkNames.EmployerDetails, PageUrls.HEARING_PREFERENCES + languages.WELSH_URL_PARAMETER],
    [
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + languages.WELSH_URL_PARAMETER,
    ],
    [ET3HubLinkNames.PayPensionBenefitDetails, PageUrls.CLAIMANT_PENSION_AND_BENEFITS + languages.WELSH_URL_PARAMETER],
    [ET3HubLinkNames.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM + languages.WELSH_URL_PARAMETER],
    [ET3HubLinkNames.EmployersContractClaim, PageUrls.EMPLOYERS_CONTRACT_CLAIM + languages.WELSH_URL_PARAMETER],
    [ET3HubLinkNames.CheckYorAnswers, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
  ]);
  const et3HubLinksMapEnglish: Map<string, string> = new Map<string, string>([
    [ET3HubLinkNames.ContactDetails, PageUrls.RESPONDENT_NAME],
    [ET3HubLinkNames.EmployerDetails, PageUrls.HEARING_PREFERENCES],
    [ET3HubLinkNames.ConciliationAndEmployeeDetails, PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE],
    [ET3HubLinkNames.PayPensionBenefitDetails, PageUrls.CLAIMANT_PENSION_AND_BENEFITS],
    [ET3HubLinkNames.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM],
    [ET3HubLinkNames.EmployersContractClaim, PageUrls.EMPLOYERS_CONTRACT_CLAIM],
    [ET3HubLinkNames.CheckYorAnswers, PageUrls.NOT_IMPLEMENTED],
  ]);
  it('returns correct links when respondent is system user in English', () => {
    expect(getET3HubLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(et3HubLinksMapEnglish);
  });

  it('returns correct links when respondent is system user in Welsh', () => {
    expect(getET3HubLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(et3HubLinksMapWelsh);
  });

  it('returns correct links when respondent is non-system user in English', () => {
    expect(getET3HubLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(et3HubLinksMapEnglish);
  });

  it('returns correct links when respondent is non-system user in Welsh', () => {
    expect(getET3HubLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(et3HubLinksMapWelsh);
  });
});

describe('getET3CaseDetailsLinksUrlMap', () => {
  const et3CaseDetailsLinksMapWelsh: Map<string, string> = new Map<string, string>([
    [ET3CaseDetailsLinkNames.PersonalDetails, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.ET1ClaimForm, PageUrls.CLAIMANT_ET1_FORM + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.HearingDetails, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
    [
      ET3CaseDetailsLinkNames.RespondentRequestsAndApplications,
      PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER,
    ],
    [ET3CaseDetailsLinkNames.ClaimantApplications, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.ContactTribunal, PageUrls.CONTACT_TRIBUNAL + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.TribunalOrders, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.TribunalJudgements, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
    [ET3CaseDetailsLinkNames.Documents, PageUrls.NOT_IMPLEMENTED + languages.WELSH_URL_PARAMETER],
  ]);
  const et3CaseDetailsLinksMapEnglish: Map<string, string> = new Map<string, string>([
    [ET3CaseDetailsLinkNames.PersonalDetails, PageUrls.NOT_IMPLEMENTED],
    [ET3CaseDetailsLinkNames.ET1ClaimForm, PageUrls.CLAIMANT_ET1_FORM],
    [ET3CaseDetailsLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING],
    [ET3CaseDetailsLinkNames.HearingDetails, PageUrls.NOT_IMPLEMENTED],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED],
    [ET3CaseDetailsLinkNames.ContactTribunal, PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER],
    [ET3CaseDetailsLinkNames.TribunalJudgements, PageUrls.NOT_IMPLEMENTED],
    [ET3CaseDetailsLinkNames.Documents, PageUrls.NOT_IMPLEMENTED],
  ]);
  it('returns correct links when respondent is system user in English', () => {
    expect(getET3CaseDetailsLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(et3CaseDetailsLinksMapEnglish);
  });

  it('returns correct links when respondent is system user in Welsh', () => {
    expect(getET3CaseDetailsLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(et3CaseDetailsLinksMapWelsh);
  });

  it('returns correct links when respondent is non-system user in English', () => {
    expect(getET3CaseDetailsLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(et3CaseDetailsLinksMapEnglish);
  });

  it('returns correct links when respondent is non-system user in Welsh', () => {
    expect(getET3CaseDetailsLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(et3CaseDetailsLinksMapWelsh);
  });
});
