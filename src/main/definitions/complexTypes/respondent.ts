import {
  ET3CaseDetailsLinksStatuses,
  ET3HubLinksStatuses,
  NoAcasNumberReason,
  UploadedDocumentType,
  YesOrNo,
} from '../case';

import { DocumentTypeItem } from './documentTypeItem';
import { Et1Address } from './et1Address';

export interface RespondentType {
  respondent_name?: string;
  respondent_address?: Et1Address;
  respondent_ACAS_question?: YesOrNo;
  respondent_ACAS?: string;
  respondent_ACAS_no?: NoAcasNumberReason;
  claimant_work_address?: Et1Address;
  et3ResponseAreDatesCorrect?: YesOrNo;
  et3ResponseEmploymentStartDate?: string;
  et3ResponseEmploymentEndDate?: string;
  et3ResponseEmploymentInformation?: string;
  et3ResponseContinuingEmployment?: YesOrNo;
  et3ResponseIsJobTitleCorrect?: YesOrNo;
  et3ResponseCorrectJobTitle?: string;
  et3ResponseClaimantWeeklyHours?: YesOrNo;
  et3ResponseClaimantCorrectHours?: string;
  et3ResponseEarningDetailsCorrect?: YesOrNo;
  et3ResponsePayFrequency?: string;
  et3ResponsePayBeforeTax?: string;
  et3ResponsePayTakehome?: string;
  et3ResponseIsNoticeCorrect?: YesOrNo;
  et3ResponseCorrectNoticeDetails?: string;
  et3ResponseIsPensionCorrect?: YesOrNo;
  et3ResponsePensionCorrectDetails?: string;
  et3ResponseRespondentContestClaim?: YesOrNo;
  et3ResponseContestClaimDocument?: DocumentTypeItem[];
  et3ResponseContestClaimDetails?: string;
  et3ResponseEmployerClaim?: YesOrNo;
  et3ResponseSiteEmploymentCount?: string;
  et3ResponseEmployerClaimDetails?: string;
  et3ResponseEmployerClaimDocument?: UploadedDocumentType;
  et3ResponseRespondentSupportNeeded?: YesOrNo;
  et3ResponseRespondentSupportDetails?: string;
  et3ResponseRespondentSupportDocument?: UploadedDocumentType;
  et3Form?: UploadedDocumentType;
  et3ResponseRespondentPreferredTitle?: string;
  et3ResponseRespondentContactName?: string;
  et3ResponseMultipleSites?: YesOrNo;
  et3ResponseAcasAgree?: YesOrNo;
  et3ResponseAcasAgreeReason?: string;
  personalDetailsSection?: string;
  employmentDetailsSection?: string;
  claimDetailsSection?: string;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  respondentEnterPostcode?: string;
  responseReceived?: YesOrNo;
  response_status?: string;
  responseToClaim?: string;
  rejection_reason?: string;
  rejection_reason_other?: string;
  responseOutOfTime?: string;
  responseNotOnPrescribedForm?: string;
  responseRequiredInfoAbsent?: string;
  responseNotes?: string;
  response_referred_to_judge?: string;
  response_returned_from_judge?: string;
  respondentType?: string;
  respondentOrganisation?: string;
  respondentFirstName?: string;
  respondentLastName?: string;
  respondent_phone1?: string;
  respondent_phone2?: string;
  respondent_email?: string;
  respondent_contact_preference?: string;
  responseStruckOut?: YesOrNo;
  respondentContactPreference?: string;
  responseStruckOutDate?: string;
  responseStruckOutChairman?: string;
  responseStruckOutReason?: string;
  responseRespondentAddress?: Et1Address;
  responseRespondentPhone1?: string;
  responseRespondentPhone2?: string;
  responseRespondentEmail?: string;
  responseRespondentContactPreference?: string;
  responseReceivedDate?: string;
  responseReceivedCount?: string;
  responseRespondentNameQuestion?: YesOrNo;
  responseRespondentName?: string;
  responseContinue?: YesOrNo;
  responseCounterClaim?: string;
  responseReference?: string;
  extensionRequested?: YesOrNo;
  extensionGranted?: YesOrNo;
  extensionDate?: string;
  extensionResubmitted?: YesOrNo;
  et3Vetting?: ET3VettingType;
  et3VettingCompleted?: YesOrNo;
  et3ResponseIsClaimantNameCorrect?: YesOrNo;
  et3ResponseClaimantNameCorrection?: string;
  et3ResponseRespondentCompanyNumber?: string;
  et3ResponseRespondentEmployerType?: string;
  et3ResponseDXAddress?: Et1Address;
  et3ResponseContactReason?: string;
  et3ResponseHearingRepresentative?: string[];
  et3ResponseHearingRespondent?: string[];
  et3ResponseEmploymentCount?: string;
  idamId?: string;
  et3CaseDetailsLinksStatuses?: ET3CaseDetailsLinksStatuses;
  et3HubLinksStatuses?: ET3HubLinksStatuses;
}

export interface ET3VettingType {
  et3ChooseRespondent?: DynamicFixedListType;

  et3IsThereAnEt3Response?: YesOrNo;
  et3NoEt3Response?: string;
  et3GeneralNotes?: string;
  et3IsThereACompaniesHouseSearchDocument?: YesOrNo;
  et3CompanyHouseDocument?: UploadedDocumentType;
  et3GeneralNotesCompanyHouse?: string;
  et3IsThereAnIndividualSearchDocument?: YesOrNo;
  et3IndividualInsolvencyDocument?: UploadedDocumentType;
  et3RegionalOffice?: string;
  et3WhyWeShouldChangeTheOffice?: string;
  et3ContestClaim?: YesOrNo;
  et3ContestClaimGiveDetails?: string;
  et3GeneralNotesContestClaim?: string;
  et3ContractClaimSection7?: YesOrNo;
  et3ContractClaimSection7Details?: string;
  et3GeneralNotesContractClaimSection7?: string;
  et3Rule26?: YesOrNo;
  et3Rule26Details?: string;
  et3SuggestedIssues?: string[];
  et3SuggestedIssuesStrikeOut?: string;
  et3SuggestedIssueInterpreters?: string;
  et3SuggestedIssueJurisdictional?: string;
  et3SuggestedIssueAdjustments?: string;
  et3SuggestedIssueRule50?: string;
  et3SuggestedIssueTimePoints?: string;
  et3GeneralNotesRule26?: string;
  et3AdditionalInformation?: string;
  et3GeneralNotesIndividualInsolvency?: string;
  et3LegalIssue?: YesOrNo;
  et3LegalIssueGiveDetails?: string;
  et3GeneralNotesLegalEntity?: string;
  et3ResponseInTime?: YesOrNo;
  et3ResponseInTimeDetails?: string;
  et3DoesRespondentsNameMatch?: YesOrNo;
  et3RespondentNameMismatchDetails?: string;
  et3GeneralNotesRespondentNameMatch?: string;
  et3DoWeHaveRespondentsAddress?: YesOrNo;
  et3GeneralNotesRespondentName?: string;
  et3IsCaseListedForHearingDetails?: YesOrNo;
  et3GeneralNotesCaseListed?: string;
  et3IsThisLocationCorrect?: YesOrNo;
  et3GeneralNotesTransferApplication?: string;
  et3VettingDocument?: UploadedDocumentType;
  et3DoesRespondentsAddressMatch?: YesOrNo;
  et3RespondentAddressMismatchDetails?: string;
  et3GeneralNotesRespondentAddress?: string;
  et3GeneralNotesAddressMatch?: string;
  et3IsCaseListedForHearing?: YesOrNo;
  et3DoWeHaveRespondentsName?: YesOrNo;
}

export interface DynamicFixedListType {
  value: {
    code: string;
    label: string;
  };
  list_items: {
    code: string;
    label: string;
  }[];
}
