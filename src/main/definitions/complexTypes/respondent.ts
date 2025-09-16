import {
  ET3VettingType,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreferenceET3,
  NoAcasNumberReason,
  PayFrequency,
  UploadedDocumentType,
  YesOrNo,
  YesOrNoOrNotApplicable,
  YesOrNoOrNotSure,
} from '../case';
import { ET3CaseDetailsLinksStatuses, ET3HubLinksStatuses } from '../links';

import { DocumentTypeItem } from './documentTypeItem';
import { Et1Address } from './et1Address';

export interface RespondentSumType {
  id?: string;
  value?: RespondentType;
}

export interface RespondentType {
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
  respondent_name?: string;
  respondentType?: string;
  respondentOrganisation?: string;
  respondentFirstName?: string;
  respondentLastName?: string;
  respondent_ACAS_question?: YesOrNo;
  respondent_ACAS?: string;
  respondent_ACAS_no?: NoAcasNumberReason;
  respondent_address?: Et1Address;
  respondent_phone1?: string;
  respondent_phone2?: string;
  respondent_email?: string;
  respondent_contact_preference?: string;
  responseStruckOut?: YesOrNo;
  responseStruckOutDate?: string;
  responseStruckOutChairman?: string;
  responseStruckOutReason?: string;
  responseRespondentAddress?: Et1Address;
  responseRespondentPhone1?: string;
  responseRespondentPhone2?: string;
  responseRespondentEmail?: string;
  responseRespondentContactPreference?: EmailOrPost;
  responseReceived?: YesOrNo;
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
  et3ResponseRespondentPreferredTitle?: string;
  et3ResponseRespondentContactName?: string;
  et3ResponseDXAddress?: string;
  et3ResponseContactReason?: string;
  et3ResponseLanguagePreference?: EnglishOrWelsh;
  et3ResponseHearingRepresentative?: string[];
  et3ResponseHearingRespondent?: HearingPreferenceET3[];
  et3ResponseEmploymentCount?: string;
  et3ResponseMultipleSites?: YesOrNo;
  et3ResponseSiteEmploymentCount?: string;
  et3ResponseAcasAgree?: YesOrNo;
  et3ResponseAcasAgreeReason?: string;
  et3ResponseAreDatesCorrect?: YesOrNoOrNotApplicable;
  et3ResponseEmploymentStartDate?: string;
  et3ResponseEmploymentEndDate?: string;
  et3ResponseEmploymentInformation?: string;
  et3ResponseContinuingEmployment?: YesOrNoOrNotApplicable;
  et3ResponseIsJobTitleCorrect?: YesOrNoOrNotApplicable;
  et3ResponseCorrectJobTitle?: string;
  et3ResponseClaimantWeeklyHours?: YesOrNoOrNotApplicable;
  et3ResponseClaimantCorrectHours?: string;
  et3ResponseEarningDetailsCorrect?: YesOrNoOrNotApplicable;
  et3ResponsePayFrequency?: PayFrequency;
  et3ResponsePayBeforeTax?: string;
  et3ResponsePayTakehome?: string;
  et3ResponseIsNoticeCorrect?: YesOrNoOrNotApplicable;
  et3ResponseCorrectNoticeDetails?: string;
  et3ResponseIsPensionCorrect?: YesOrNoOrNotApplicable;
  et3ResponsePensionCorrectDetails?: string;
  et3ResponseRespondentContestClaim?: YesOrNo;
  et3ResponseContestClaimDocument?: DocumentTypeItem[];
  et3ResponseContestClaimDetails?: string;
  et3ResponseEmployerClaim?: YesOrNo;
  et3ResponseEmployerClaimDetails?: string;
  et3ResponseEmployerClaimDocument?: UploadedDocumentType;
  et3ResponseRespondentSupportNeeded?: YesOrNoOrNotSure; //Reasonable Adjustments
  et3ResponseRespondentSupportDetails?: string;
  et3ResponseRespondentSupportDocument?: UploadedDocumentType;
  et3Form?: UploadedDocumentType;
  et3FormWelsh?: UploadedDocumentType;
  contactDetailsSection?: string;
  employerDetailsSection?: string;
  conciliationAndEmployeeDetailsSection?: string;
  payPensionBenefitDetailsSection?: string;
  contestClaimSection?: string;
  employersContractClaimSection?: string;
  idamId?: string;
  et3CaseDetailsLinksStatuses?: ET3CaseDetailsLinksStatuses;
  et3HubLinksStatuses?: ET3HubLinksStatuses;
  claimant_work_address?: Et1Address;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  et3Status?: string;
  et3IsRespondentAddressCorrect?: YesOrNo;
}
