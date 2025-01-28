import { HearingModel, PreAcceptCase } from './api/caseApiResponse';
import { DocumentTypeItem } from './complexTypes/documentTypeItem';
import { Et1Address } from './complexTypes/et1Address';
import { GenericTseApplicationTypeItem, TseRespondTypeItem } from './complexTypes/genericTseApplicationTypeItem';
import { ET3VettingCommonTypes, ET3VettingType } from './complexTypes/respondent';
import { PseResponseType, SendNotificationTypeItem } from './complexTypes/sendNotificationTypeItem';
import {
  CaseState,
  ClaimOutcomes,
  ClaimTypeDiscrimination,
  ClaimTypePay,
  DocumentDetail,
  TellUsWhatYouWant,
} from './definition';
import { HubLinksStatuses } from './hub';
import { ET3CaseDetailsLinksStatuses, ET3HubLinksStatuses } from './links';
import { TypeItem, UnknownRecord } from './util-types';

export enum Checkbox {
  Checked = 'checked',
  Unchecked = '',
}

export interface CaseDate {
  year: string;
  month: string;
  day: string;
}

export interface AddressType {
  selected?: boolean;
  value?: number;
  label?: string;
}

export interface RespondentET3Model extends ET3VettingCommonTypes {
  respondentName?: string;
  workAddressLine1?: string;
  workAddressLine2?: string;
  workAddressLine3?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  workAddressCounty?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
  ccdId?: string;
  respondentACASNo?: NoAcasNumberReason;
  claimantWorkAddressLine1?: string;
  claimantWorkAddressLine2?: string;
  claimantWorkAddressLine3?: string;
  claimantWorkAddressCountry?: string;
  claimantWorkAddressPostCode?: string;
  claimantWorkAddressCounty?: string;
  claimantWorkAddressPostTown?: string;
  claimantWorkAddress?: Et1Address;
  et3Vetting?: ET3VettingType;
  // All ET3 fields
  responseReceived?: YesOrNo;
  responseStatus?: string;
  responseToClaim?: string;
  rejectionReason?: string;
  respondentAddressLine1?: string;
  respondentAddressLine2?: string;
  respondentAddressLine3?: string;
  respondentAddressCountry?: string;
  respondentAddressPostCode?: string;
  respondentAddressCounty?: string;
  respondentAddressPostTown?: string;
  respondentAddress?: Et1Address;
  responseRespondentAddress?: Et1Address;
  respondentACASQuestion?: YesOrNo;
  respondentACAS?: string;
  rejectionReasonOther?: string;
  responseOutOfTime?: string;
  responseNotOnPrescribedForm?: string;
  et3ResponseIsJobTitleCorrect?: YesOrNoOrNotApplicable;
  et3ResponseCorrectJobTitle?: string;
  et3ResponseClaimantWeeklyHours?: YesOrNoOrNotApplicable;
  et3ResponseClaimantCorrectHours?: string;
  et3ResponseEarningDetailsCorrect?: YesOrNoOrNotApplicable;
  et3ResponseEmployerClaimDocument?: UploadedDocumentType;
  et3ResponseRespondentSupportDocument?: UploadedDocumentType;
  et3ResponsePayFrequency?: PayFrequency;
  et3ResponsePayBeforeTax?: string;
  et3ResponsePayTakehome?: string;
  et3Form?: UploadedDocumentType;
  et3FormWelsh?: UploadedDocumentType;
  respondentEmail?: string;
  responseStruckOut?: YesOrNo;
  respondentContactPreference?: string;
  responseStruckOutDate?: string;
  responseStruckOutChairman?: string;
  et3ResponseIsNoticeCorrect?: YesOrNoOrNotApplicable;
  responseRequiredInfoAbsent?: string;
  responseNotes?: string;
  responseReferredToJudge?: string;
  responseReturnedFromJudge?: string;
  respondentType?: string;
  respondentOrganisation?: string;
  respondentFirstName?: string;
  respondentLastName?: string;
  respondentPhone1?: string;
  respondentPhone2?: string;
  et3ResponseRespondentEmployerType?: string;
  et3ResponseRespondentPreferredTitle?: string;
  et3ResponseRespondentContactName?: string;
  et3ResponseDXAddress?: string;
  et3ResponseContactReason?: string;
  et3ResponseLanguagePreference?: EnglishOrWelsh;
  responseStruckOutReason?: string;
  responseRespondentAddressLine1?: string;
  responseRespondentAddressLine2?: string;
  responseRespondentAddressLine3?: string;
  responseRespondentAddressPostTown?: string;
  responseRespondentAddressCounty?: string;
  responseRespondentAddressPostCode?: string;
  responseRespondentAddressCountry?: string;
  responseRespondentPhone1?: string;
  responseRespondentPhone2?: string;
  et3CompanyHouseDocumentBinaryUrl?: string;
  et3CompanyHouseDocumentFileName?: string;
  et3CompanyHouseDocumentUrl?: string;
  et3CompanyHouseDocumentCategoryId?: string;
  et3CompanyHouseDocumentUploadTimestamp?: string;
  et3IndividualInsolvencyDocumentBinaryUrl?: string;
  et3IndividualInsolvencyDocumentFileName?: string;
  et3IndividualInsolvencyDocumentUrl?: string;
  et3IndividualInsolvencyDocumentCategoryId?: string;
  et3IndividualInsolvencyDocumentUploadTimestamp?: string;
  et3VettingDocumentBinaryUrl?: string;
  et3VettingDocumentFileName?: string;
  et3VettingDocumentUrl?: string;
  et3VettingDocumentCategoryId?: string;
  et3VettingDocumentUploadTimestamp?: string;
  et3VettingCompleted?: YesOrNo;
  et3ResponseIsClaimantNameCorrect?: YesOrNo;
  et3ResponseClaimantNameCorrection?: string;
  et3ResponseRespondentCompanyNumber?: string;
  et3ResponseHearingRepresentative?: string[];
  et3ResponseHearingRespondent?: HearingPreferenceET3[];
  et3ResponseEmploymentCount?: string;
  et3ResponseMultipleSites?: YesOrNo;
  et3ResponseSiteEmploymentCount?: string;
  et3ResponseEmployerClaim?: YesOrNo;
  et3ResponseEmployerClaimDetails?: string;
  et3ResponseEmployerClaimDocumentBinaryUrl?: string;
  et3ResponseEmployerClaimDocumentFileName?: string;
  et3ResponseEmployerClaimDocumentUrl?: string;
  et3ResponseEmployerClaimDocumentCategoryId?: string;
  et3ResponseEmployerClaimDocumentUploadTimestamp?: string;
  et3ResponseRespondentSupportNeeded?: YesOrNoOrNotSure;
  et3ResponseAcasAgree?: YesOrNo;
  et3ResponseAcasAgreeReason?: string;
  et3ResponseAreDatesCorrect?: YesOrNoOrNotApplicable;
  et3ResponseEmploymentStartDate?: CaseDate;
  et3ResponseEmploymentEndDate?: CaseDate;
  et3ResponseEmploymentInformation?: string;
  et3ResponseContinuingEmployment?: YesOrNoOrNotApplicable;
  et3ResponseCorrectNoticeDetails?: string;
  et3ResponseIsPensionCorrect?: YesOrNoOrNotApplicable;
  et3ResponsePensionCorrectDetails?: string;
  et3ResponseRespondentContestClaim?: YesOrNo;
  et3ResponseContestClaimDocument?: DocumentTypeItem[];
  et3ResponseContestClaimDetails?: string;
  et3ResponseRespondentSupportDetails?: string;
  et3ResponseRespondentSupportDocumentBinaryUrl?: string;
  et3ResponseRespondentSupportDocumentFileName?: string;
  et3ResponseRespondentSupportDocumentUrl?: string;
  et3ResponseRespondentSupportDocumentCategoryId?: string;
  et3ResponseRespondentSupportDocumentUploadTimestamp?: string;
  et3FormBinaryUrl?: string;
  et3FormFileName?: string;
  et3FormUrl?: string;
  et3FormCategoryId?: string;
  et3FormUploadTimestamp?: string;
  et3FormWelshBinaryUrl?: string;
  et3FormWelshFileName?: string;
  et3FormWelshUrl?: string;
  et3FormWelshCategoryId?: string;
  et3FormWelshUploadTimestamp?: string;
  contactDetailsSection?: string;
  employerDetailsSection?: string;
  conciliationAndEmployeeDetailsSection?: string;
  payPensionBenefitDetailsSection?: string;
  contestClaimSection?: string;
  employersContractClaimSection?: string;
  respondentEnterPostcode?: string;
  responseRespondentEmail?: string;
  responseRespondentContactPreference?: EmailOrPost;
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
  idamId?: string;
  et3CaseDetailsLinksStatuses?: ET3CaseDetailsLinksStatuses;
  et3HubLinksStatuses?: ET3HubLinksStatuses;
  et3IsRespondentAddressCorrect?: YesOrNo;
  et3Status?: string;
}

export interface RespondentApiModel {
  respondentNumber?: number;
  respondentName?: string;
  respondentAddress1?: string;
  respondentAddress2?: string;
  respondentAddressTown?: string;
  respondentAddressCountry?: string;
  respondentAddressPostcode?: string;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
}

export interface Case {
  createdDate: string;
  lastModified: string;
  ethosCaseReference?: string;
  feeGroupReference?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dobDate?: CaseDate;
  address1?: string;
  address2?: string;
  addressTown?: string;
  addressCountry?: string;
  addressPostcode?: string;
  acasMultiple?: YesOrNo;
  claimantContactPreference?: EmailOrPost;
  claimantContactLanguagePreference?: EnglishOrWelsh;
  claimantHearingLanguagePreference?: EnglishOrWelsh;
  claimantRepresentedQuestion?: YesOrNo;
  caseSource?: string;
  representativeClaimantType?: RepresentedTypeC;
  caseType?: CaseType;
  caseTypeId?: CaseTypeId;
  telNumber?: string;
  validNoAcasReason?: YesOrNo;
  returnToExisting?: YesOrNo;
  jobTitle?: string;
  typeOfClaim?: string[];
  pastEmployer?: YesOrNo;
  noticeEnds?: CaseDate;
  noticePeriod?: YesOrNo;
  noticePeriodLength?: string;
  noticePeriodUnitPaid?: WeeksOrMonths;
  noticePeriodPaid?: string;
  noticePeriodAmountPaid?: string;
  noticePeriodUnit?: WeeksOrMonths;
  isStillWorking?: StillWorking;
  workAddress1?: string;
  workAddress2?: string;
  workAddressTown?: string;
  workAddressCountry?: string;
  workAddressPostcode?: string;
  startDate?: CaseDate;
  endDate?: CaseDate;
  avgWeeklyHrs?: number;
  payBeforeTax?: number;
  payAfterTax?: number;
  payInterval?: PayInterval;
  newJob?: YesOrNo;
  newJobStartDate?: CaseDate;
  newJobPay?: number;
  newJobPayInterval?: PayInterval;
  employeeBenefits?: YesOrNo;
  benefitsCharCount?: string;
  claimSummaryText?: string;
  claimSummaryFile?: Document;
  claimOutcome?: ClaimOutcomes[];
  compensationOutcome?: string;
  compensationAmount?: number;
  tribunalRecommendationOutcome?: string;
  claimTypeDiscrimination?: ClaimTypeDiscrimination[];
  claimTypePay?: ClaimTypePay[];
  tellUsWhatYouWant?: TellUsWhatYouWant[];
  tribunalRecommendationRequest?: string;
  whistleblowingClaim?: YesOrNo;
  whistleblowingEntityName?: string;
  linkedCases?: YesOrNo;
  linkedCasesDetail?: string;
  personalDetailsCheck?: YesOrNo;
  claimDetailsCheck?: YesOrNo;
  claimantWorkAddressQuestion?: YesOrNo;
  respondents?: RespondentET3Model[];
  addressAddressTypes?: AddressType[];
  addressAddresses?: Record<string, string>[];
  respondentAddressTypes?: AddressType[];
  respondentAddresses?: Record<string, string>[];
  workAddressTypes?: AddressType[];
  workAddresses?: Record<string, string>[];
  employmentAndRespondentCheck?: YesOrNo;
  ClaimantPcqId?: string;
  claimantPensionContribution?: YesOrNoOrNotApplicable;
  claimantPensionWeeklyContribution?: number;
  reasonableAdjustments?: YesOrNo;
  reasonableAdjustmentsDetail?: string;
  hearingPreferences?: HearingPreference[];
  hearingAssistance?: string;
  workPostcode?: string;
  respondentName?: string;
  claimantSex?: Sex;
  preferredTitle?: string;
  acasCert?: YesOrNo;
  acasCertNum?: string;
  noAcasReason?: NoAcasNumberReason;
  managingOffice?: string;
  tribunalCorrespondenceEmail?: string;
  tribunalCorrespondenceTelephone?: string;
  et1SubmittedForm?: DocumentDetail;
  submittedDate?: CaseDate;
  et3ResponseReceived?: boolean;
  et1OnlineSubmission?: string;
  hubLinksStatuses?: HubLinksStatuses;
  allEt1DocumentDetails?: DocumentDetail[];
  acknowledgementOfClaimLetterDetail?: DocumentDetail[];
  rejectionOfClaimDocumentDetail?: DocumentDetail[];
  responseAcknowledgementDocumentDetail?: DocumentDetail[];
  responseRejectionDocumentDetail?: DocumentDetail[];
  respondentResponseDeadline?: string;
  responseEt3FormDocumentDetail?: DocumentDetail[];
  otherClaim?: string;
  typeOfClaimString?: string;
  // TSE
  contactApplicationType?: string;
  contactApplicationText?: string;
  contactApplicationFile?: Document;
  copyToOtherPartyYesOrNo?: YesOrNo;
  copyToOtherPartyText?: string;
  genericTseApplicationCollection?: GenericTseApplicationTypeItem[];
  tseApplicationStoredCollection?: GenericTseApplicationTypeItem[];
  selectedGenericTseApplication?: GenericTseApplicationTypeItem;
  selectedStoredTseResponse?: TseRespondTypeItem;
  selectedStoredPseResponse?: TypeItem<PseResponseType>;
  storeState?: string;
  responseText?: string;
  hasSupportingMaterial?: YesOrNo;
  supportingMaterialFile?: Document;
  sendNotificationCollection?: SendNotificationTypeItem[];
  bundlesRespondentAgreedDocWith?: AgreedDocuments;
  bundlesRespondentAgreedDocWithBut?: string;
  bundlesRespondentAgreedDocWithNo?: string;
  // bundleDocuments contains both claimant and respondent uploaded bundles submission pdfs
  bundleDocuments?: DocumentTypeItem[];
  //Created for saving select order or request value;
  selectedRequestOrOrder?: SendNotificationTypeItem;
  hearingCollection?: HearingModel[];
  hearingDocumentsAreFor?: HearingModel['id'];
  whoseHearingDocumentsAreYouUploading?: WhoseHearingDocument;
  whatAreTheseDocuments?: WhatAreTheHearingDocuments;
  hearingDocument?: Document;
  formattedSelectedHearing?: string;

  /* Used to save the Rule 91 state to render the "Completed" page under various conditions, after submitting the CYA,
  all temporary fields such as copyToOtherPartyYesOrNo, contactApplicationText, etc. are cleared.*/
  rule90state?: boolean;
  documentCollection?: DocumentTypeItem[];
  respondentEnterPostcode?: string;
  workEnterPostcode?: string;
  addressEnterPostcode?: string;
  representatives?: Representative[];
  confirmCopied?: string;
  // indiciates if responding to a tribunal order/request or not when responding to an application
  isRespondingToRequestOrOrder?: boolean;
  updateDraftCaseError?: string;
  // Multiples
  multipleFlag?: YesOrNo;
  leadClaimant?: YesOrNo;
  caseStayed?: YesOrNo;
  //ET3 Response Form
  respondentDetails?: YesOrNo;
  claimantDetails?: YesOrNo;
  respondentResponse?: YesOrNo;
  preAcceptCase?: PreAcceptCase;
}

export const enum StillWorking {
  WORKING = 'Working',
  NOTICE = 'Notice',
  NO_LONGER_WORKING = 'No longer working',
}

export const enum NoAcasNumberReason {
  ANOTHER = 'Another person',
  NO_POWER = 'No Power',
  EMPLOYER = 'Employer already in touch',
  UNFAIR_DISMISSAL = 'Unfair Dismissal',
}

export interface CaseWithId extends Case, RespondentET3Model {
  id: string;
  state: CaseState;
}

export const enum YesOrNo {
  YES = 'Yes',
  NO = 'No',
}

export const enum YesOrNoOrNotSure {
  YES = 'Yes',
  NO = 'No',
  NOT_SURE = 'not sure',
}

export const enum YesOrNoOrNotApplicable {
  YES = 'Yes',
  NO = 'No',
  NOT_APPLICABLE = 'Not applicable',
}

export const enum CaseType {
  SINGLE = 'Single',
  MULTIPLE = 'Multiple',
}

export const enum CaseTypeId {
  ENGLAND_WALES = 'ET_EnglandWales',
  SCOTLAND = 'ET_Scotland',
}

export const enum WeeksOrMonths {
  WEEKS = 'Weeks',
  MONTHS = 'Months',
}

export const enum EmailOrPost {
  EMAIL = 'Email',
  POST = 'Post',
}

export const enum EnglishOrWelsh {
  ENGLISH = 'English',
  WELSH = 'Welsh',
}

export const enum Sex {
  MALE = 'Male',
  FEMALE = 'Female',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum ccdPreferredTitle {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  MS = 'Ms',
  OTHER = 'Other',
}

export const enum PayInterval {
  WEEKS = 'Weeks',
  MONTHS = 'Months',
  ANNUAL = 'Annual',
}

export const enum PayFrequency {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

export type DateParser = (property: string, body: UnknownRecord) => CaseDate;

export const enum CaseDataCacheKey {
  POSTCODE = 'workPostcode',
  CLAIMANT_REPRESENTED = 'claimantRepresentedQuestion',
  CASE_TYPE = 'caseType',
  TYPES_OF_CLAIM = 'typeOfClaim',
  OTHER_CLAIM_TYPE = 'otherClaimType',
  ACAS_MULTIPLE = 'acasMultiple',
  VALID_NO_ACAS_REASON = 'validNoAcasReason',
  RESPONSE_HUB_IDAM_LOGIN_CALLER_URL_WITH_CASE_ID = 'responseHubIdamLoginCallerUrlWithCaseId',
}

export const enum HearingPreference {
  VIDEO = 'Video',
  PHONE = 'Phone',
  NEITHER = 'Neither',
}

export const enum HearingPreferenceET3 {
  VIDEO = 'Video hearings',
  PHONE = 'Phone hearings',
}

export const enum AgreedDocuments {
  YES = 'Yes',
  AGREEDBUT = 'We have agreed but there are some disputed documents',
  NOTAGREED = 'No, we have not agreed and I want to provide my own documents',
}

export const enum WhoseHearingDocument {
  MINE = 'My hearing documents only',
  BOTH_PARTIES = 'Both parties’ hearing documents combined',
}

export const enum WhatAreTheHearingDocuments {
  ALL = 'All hearing documents',
  SUPPLEMENTARY = 'Supplementary or other documents',
  WITNESS_STATEMENTS = 'Witness statements only',
}

export interface Document {
  document_url: string;
  document_filename: string;
  document_binary_url: string;
  document_size?: number;
  document_mime_type?: string;
  createdOn?: string;
}

export interface UploadedDocumentType {
  document_binary_url: string;
  document_filename: string;
  document_url: string;
  category_id: string;
  upload_timestamp: string;
}

export interface Representative {
  hasMyHMCTSAccount?: YesOrNo;
  respondentId?: string;
}

export const enum TypeOfOrganisation {
  INDIVIDUAL = 'Individual',
  LIMITED_COMPANY = 'Limited company',
  PARTNERSHIP = 'Partnership',
  UNINCORPORATED_ASSOCIATION = 'Unincorporated association',
  OTHER = 'Other',
}

export interface RepresentedTypeC {
  representativeId?: string;
  nameOfRepresentative?: string;
  nameOfOrganisation?: string;
  representativeReference?: string;
  representativeOccupation?: string;
  representativeOccupationOther?: string;
  representativeAddress?: Et1Address;
  representativePhoneNumber?: string;
  representativeMobileNumber?: string;
  representativeEmailAddress?: string;
  representativePreference?: string;
  organisationId?: string;
  myHmctsOrganisation?: Organisation;
  hearingContactLanguage?: string[];
  contactLanguageQuestion?: string[];
  representativeAttendHearing?: string[];
}

export interface Organisation {
  organisationID?: string;
  organisationName?: string;
}
