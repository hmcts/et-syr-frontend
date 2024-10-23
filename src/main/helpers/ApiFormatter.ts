import { CreateCaseBody, RespondentRequestBody, UpdateCaseBody } from '../definitions/api/caseApiBody';
import {
  CaseApiDataResponse,
  CaseData,
  DocumentApiModel,
  HearingBundleType,
  RepresentativeApiModel,
  RespondentApiModel,
} from '../definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest, UserDetails } from '../definitions/appRequest';
import {
  CaseDataCacheKey,
  CaseDate,
  CaseWithId,
  Document,
  EnglishOrWelsh,
  Representative,
  RespondentET3Model,
  YesOrNo,
  ccdPreferredTitle,
} from '../definitions/case';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { GenericTseApplicationTypeItem, sortByDate } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { RespondentType } from '../definitions/complexTypes/respondent';
import {
  AllDocumentTypeValue,
  AllDocumentTypes,
  CcdDataModel,
  TYPE_OF_CLAIMANT,
  acceptanceDocTypes,
  et1DocTypes,
  et3AttachmentDocTypes,
  et3FormDocTypes,
  rejectionDocTypes,
  responseAcceptedDocTypes,
  responseRejectedDocTypes,
} from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';
import { TypeItem } from '../definitions/util-types';
import ET3Util from '../utils/ET3Util';
import { isDateEmpty } from '../validators/dateValidators';

import { retrieveCurrentLocale } from './ApplicationTableRecordTranslationHelper';
import { returnTranslatedDateString } from './DateHelper';
import { combineDocuments } from './DocumentHelpers';

export function toApiFormatCreate(
  userDataMap: Map<CaseDataCacheKey, string>,
  userDetails: UserDetails
): CreateCaseBody {
  const caseBody: CreateCaseBody = {
    post_code: userDataMap.get(CaseDataCacheKey.POSTCODE),
    case_data: {
      caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
      claimantRepresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
      typesOfClaim: JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM)),
      caseSource: CcdDataModel.CASE_SOURCE,
      claimant_TypeOfClaimant: TYPE_OF_CLAIMANT,
      claimantIndType: {
        claimant_first_names: userDetails.givenName,
        claimant_last_name: userDetails.familyName,
      },
      claimantType: {
        claimant_email_address: userDetails.email,
      },
      claimantRequests: {
        other_claim: userDataMap.get(CaseDataCacheKey.OTHER_CLAIM_TYPE),
      },
      triageQuestions: {
        postcode: userDataMap.get(CaseDataCacheKey.POSTCODE),
        claimantRepresentedQuestion: userDataMap.get(CaseDataCacheKey.CLAIMANT_REPRESENTED),
        caseType: userDataMap.get(CaseDataCacheKey.CASE_TYPE),
        acasMultiple: userDataMap.get(CaseDataCacheKey.ACAS_MULTIPLE),
        typesOfClaim: JSON.parse(userDataMap.get(CaseDataCacheKey.TYPES_OF_CLAIM)),
      },
    },
  };
  if (userDataMap.get(CaseDataCacheKey.VALID_NO_ACAS_REASON) !== undefined) {
    caseBody.case_data.triageQuestions.validNoAcasReason = userDataMap.get(CaseDataCacheKey.VALID_NO_ACAS_REASON);
  }
  return caseBody;
}

export function formatApiCaseDataToCaseWithId(fromApiCaseData: CaseApiDataResponse, req?: AppRequest): CaseWithId {
  const caseWithId: CaseWithId = {
    id: fromApiCaseData.id,
    // used for mapping respondent with the case
    ccdId: fromApiCaseData.id,
    ClaimantPcqId: fromApiCaseData.case_data?.ClaimantPcqId,
    ethosCaseReference: fromApiCaseData.case_data?.ethosCaseReference,
    feeGroupReference: fromApiCaseData.case_data?.feeGroupReference,
    managingOffice: fromApiCaseData.case_data?.managingOffice,
    tribunalCorrespondenceEmail: fromApiCaseData.case_data?.tribunalCorrespondenceEmail,
    tribunalCorrespondenceTelephone: fromApiCaseData.case_data?.tribunalCorrespondenceTelephone,
    state: fromApiCaseData.state,
    caseTypeId: fromApiCaseData.case_type_id,
    claimantRepresentedQuestion: fromApiCaseData.case_data?.claimantRepresentedQuestion,
    caseType: fromApiCaseData.case_data?.caseType,
    firstName: fromApiCaseData.case_data?.claimantIndType?.claimant_first_names,
    lastName: fromApiCaseData.case_data?.claimantIndType?.claimant_last_name,
    email: fromApiCaseData.case_data?.claimantType?.claimant_email_address,
    telNumber: fromApiCaseData.case_data?.claimantType?.claimant_phone_number,
    address1: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.AddressLine1,
    address2: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.AddressLine2,
    addressTown: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.PostTown,
    addressPostcode: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.PostCode,
    addressEnterPostcode: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.PostCode,
    addressCountry: fromApiCaseData.case_data?.claimantType?.claimant_addressUK?.Country,
    typeOfClaim: fromApiCaseData.case_data?.typesOfClaim,
    dobDate: parseDateFromString(fromApiCaseData.case_data?.claimantIndType?.claimant_date_of_birth),
    claimantSex: fromApiCaseData.case_data?.claimantIndType?.claimant_sex,
    preferredTitle: returnPreferredTitle(
      fromApiCaseData.case_data?.claimantIndType?.claimant_preferred_title,
      fromApiCaseData.case_data?.claimantIndType?.claimant_title_other
    ),
    jobTitle: fromApiCaseData.case_data?.claimantOtherType?.claimant_occupation,
    startDate: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_from),
    endDate: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_to),
    noticePeriod: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period,
    noticePeriodUnit: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period_unit,
    noticePeriodLength: fromApiCaseData.case_data?.claimantOtherType?.claimant_notice_period_duration,
    avgWeeklyHrs: fromApiCaseData.case_data?.claimantOtherType?.claimant_average_weekly_hours,
    payBeforeTax: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_before_tax,
    payAfterTax: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_after_tax,
    payInterval: fromApiCaseData.case_data?.claimantOtherType?.claimant_pay_cycle,
    claimantPensionContribution: fromApiCaseData.case_data?.claimantOtherType?.claimant_pension_contribution,
    claimantPensionWeeklyContribution:
      fromApiCaseData.case_data?.claimantOtherType?.claimant_pension_weekly_contribution,
    employeeBenefits: fromApiCaseData.case_data?.claimantOtherType?.claimant_benefits,
    newJob: fromApiCaseData.case_data?.newEmploymentType?.new_job,
    newJobStartDate: parseDateFromString(fromApiCaseData.case_data?.newEmploymentType?.newly_employed_from),
    newJobPay: fromApiCaseData.case_data?.newEmploymentType?.new_pay_before_tax,
    newJobPayInterval: fromApiCaseData.case_data?.newEmploymentType?.new_job_pay_interval,
    benefitsCharCount: fromApiCaseData.case_data?.claimantOtherType?.claimant_benefits_detail,
    pastEmployer: fromApiCaseData.case_data?.claimantOtherType?.pastEmployer,
    isStillWorking: fromApiCaseData.case_data?.claimantOtherType?.stillWorking,
    reasonableAdjustments: fromApiCaseData.case_data?.claimantHearingPreference?.reasonable_adjustments,
    reasonableAdjustmentsDetail: fromApiCaseData.case_data?.claimantHearingPreference?.reasonable_adjustments_detail,
    personalDetailsCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.personalDetailsCheck,
    noticeEnds: parseDateFromString(fromApiCaseData.case_data?.claimantOtherType?.claimant_employed_notice_period),
    hearingPreferences: fromApiCaseData.case_data?.claimantHearingPreference?.hearing_preferences,
    hearingAssistance: fromApiCaseData.case_data?.claimantHearingPreference?.hearing_assistance,
    claimantContactPreference: fromApiCaseData.case_data?.claimantType?.claimant_contact_preference,
    claimantContactLanguagePreference: fromApiCaseData.case_data?.claimantHearingPreference?.contact_language,
    claimantHearingLanguagePreference: fromApiCaseData.case_data?.claimantHearingPreference?.hearing_language,
    claimTypeDiscrimination: fromApiCaseData.case_data?.claimantRequests?.discrimination_claims,
    claimTypePay: fromApiCaseData.case_data?.claimantRequests?.pay_claims,
    claimSummaryText: fromApiCaseData.case_data?.claimantRequests?.claim_description,
    claimSummaryFile: fromApiCaseData.case_data?.claimantRequests?.claim_description_document,
    tellUsWhatYouWant: fromApiCaseData.case_data?.claimantRequests?.claim_outcome,
    tribunalRecommendationRequest: fromApiCaseData.case_data?.claimantRequests?.claimant_tribunal_recommendation,
    whistleblowingClaim: fromApiCaseData.case_data?.claimantRequests?.whistleblowing,
    whistleblowingEntityName: fromApiCaseData.case_data?.claimantRequests?.whistleblowing_authority,
    linkedCases: fromApiCaseData.case_data?.claimantRequests?.linked_cases,
    linkedCasesDetail: fromApiCaseData.case_data?.claimantRequests?.linked_cases_detail,
    compensationOutcome: fromApiCaseData.case_data?.claimantRequests?.claimant_compensation_text,
    compensationAmount: fromApiCaseData.case_data?.claimantRequests?.claimant_compensation_amount,
    otherClaim: fromApiCaseData?.case_data?.claimantRequests?.other_claim,
    employmentAndRespondentCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.employmentAndRespondentCheck,
    claimDetailsCheck: fromApiCaseData.case_data?.claimantTaskListChecks?.claimDetailsCheck,
    createdDate: convertFromTimestampString(fromApiCaseData.created_date, req),
    lastModified: convertFromTimestampString(fromApiCaseData.last_modified, req),
    respondents: mapRespondents(fromApiCaseData.case_data?.respondentCollection),
    claimantWorkAddressQuestion: fromApiCaseData.case_data?.claimantWorkAddressQuestion,
    workAddress1: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.AddressLine1,
    workAddress2: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.AddressLine2,
    workAddressTown: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.PostTown,
    workAddressCountry: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.Country,
    workAddressPostcode: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.PostCode,
    workEnterPostcode: fromApiCaseData.case_data?.claimantWorkAddress?.claimant_work_address?.PostCode,
    et3ResponseReceived: hasResponseFromRespondentList(fromApiCaseData.case_data),
    submittedDate: parseDateFromString(fromApiCaseData?.case_data?.receiptDate),
    hubLinksStatuses: fromApiCaseData?.case_data?.hubLinksStatuses,
    et1SubmittedForm: returnSubmittedEt1Form(
      fromApiCaseData.case_data?.claimantHearingPreference?.contact_language,
      fromApiCaseData.case_data?.documentCollection
    ),
    acknowledgementOfClaimLetterDetail: setDocumentValues(
      fromApiCaseData?.case_data?.servingDocumentCollection,
      acceptanceDocTypes
    ),
    rejectionOfClaimDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.documentCollection,
      rejectionDocTypes
    ),
    responseAcknowledgementDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.et3NotificationDocCollection,
      responseAcceptedDocTypes
    ),
    responseRejectionDocumentDetail: setDocumentValues(
      fromApiCaseData?.case_data?.et3NotificationDocCollection,
      responseRejectedDocTypes
    ),
    respondentResponseDeadline: getDueDate(fromApiCaseData.case_data?.claimServedDate, 28),
    responseEt3FormDocumentDetail: [
      ...combineDocuments(
        setDocumentValues(fromApiCaseData?.case_data?.et3NotificationDocCollection, responseAcceptedDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.et3NotificationDocCollection, responseRejectedDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.documentCollection, et3FormDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.documentCollection, et3AttachmentDocTypes),
        setDocumentValues(fromApiCaseData?.case_data?.et3ResponseContestClaimDocument, undefined, true)
      ),
    ],
    genericTseApplicationCollection: sortApplicationByDate(fromApiCaseData.case_data?.genericTseApplicationCollection),
    tseApplicationStoredCollection: fromApiCaseData?.case_data?.tseApplicationStoredCollection,
    sendNotificationCollection: fromApiCaseData.case_data?.sendNotificationCollection,
    hearingCollection: fromApiCaseData?.case_data?.hearingCollection,
    documentCollection: fromApiCaseData.case_data?.documentCollection,
    representatives: mapRepresentatives(fromApiCaseData.case_data?.repCollection),
    bundleDocuments: [
      ...combineDocuments<DocumentTypeItem>(
        mapBundlesDocs(
          fromApiCaseData.case_data?.bundlesClaimantCollection,
          AllDocumentTypes.CLAIMANT_HEARING_DOCUMENT
        ),
        mapBundlesDocs(
          fromApiCaseData.case_data?.bundlesRespondentCollection,
          AllDocumentTypes.RESPONDENT_HEARING_DOCUMENT
        )
      ),
    ],
    multipleFlag: fromApiCaseData?.case_data?.multipleFlag,
    leadClaimant: fromApiCaseData?.case_data?.leadClaimant,
    caseStayed: fromApiCaseData?.case_data?.batchCaseStayed,
  };
  if (req?.session) {
    req.session.selectedRespondentIndex = ET3Util.findSelectedRespondentByCaseWithId(req, caseWithId);
  }
  mapResponseApiDataToCaseWithId(fromApiCaseData, caseWithId, req);
  return caseWithId;
}

function mapResponseApiDataToCaseWithId(
  fromApiCaseData: CaseApiDataResponse,
  caseWithId: CaseWithId,
  req: AppRequest
): void {
  const selectedRespondentIndex: number = req?.session?.selectedRespondentIndex;
  if (
    selectedRespondentIndex !== undefined &&
    selectedRespondentIndex >= 0 &&
    selectedRespondentIndex < fromApiCaseData.case_data.respondentCollection.length
  ) {
    const selectedRespondent: RespondentApiModel =
      fromApiCaseData.case_data.respondentCollection[selectedRespondentIndex];
    caseWithId.respondentName = selectedRespondent.value?.respondent_name;
    caseWithId.workAddressLine1 = selectedRespondent.value?.workAddress1;
    caseWithId.workAddressLine2 = selectedRespondent.value?.workAddress2;
    caseWithId.workAddressLine3 = undefined;
    caseWithId.workAddressTown = selectedRespondent.value?.workAddressTown;
    caseWithId.workAddressCountry = selectedRespondent.value?.workAddressCountry;
    caseWithId.workAddressPostcode = selectedRespondent.value?.workAddressPostcode;
    caseWithId.workAddressCounty = undefined;
    caseWithId.acasCert = selectedRespondent.value?.et3ResponseAcasAgree;
    caseWithId.acasCertNum = selectedRespondent.value?.respondent_ACAS;
    caseWithId.noAcasReason = selectedRespondent.value?.respondent_ACAS_no;
    caseWithId.respondentACASNo = selectedRespondent.value?.respondent_ACAS_no;
    caseWithId.claimantWorkAddressLine1 = selectedRespondent.value?.claimant_work_address?.AddressLine1;
    caseWithId.claimantWorkAddressLine2 = selectedRespondent.value?.claimant_work_address?.AddressLine2;
    caseWithId.claimantWorkAddressLine3 = selectedRespondent.value?.claimant_work_address?.AddressLine3;
    caseWithId.claimantWorkAddressCountry = selectedRespondent.value?.claimant_work_address?.Country;
    caseWithId.claimantWorkAddressPostCode = selectedRespondent.value?.claimant_work_address?.PostCode;
    caseWithId.claimantWorkAddressCounty = selectedRespondent.value?.claimant_work_address?.County;
    caseWithId.claimantWorkAddressPostTown = selectedRespondent.value?.claimant_work_address?.PostTown;
    caseWithId.responseReceived = selectedRespondent.value?.responseReceived;
    caseWithId.responseStatus = selectedRespondent.value?.response_status;
    caseWithId.responseToClaim = selectedRespondent.value?.responseToClaim;
    caseWithId.rejectionReason = selectedRespondent.value?.rejection_reason;
    caseWithId.respondentAddressLine1 = selectedRespondent.value?.respondent_address?.AddressLine1;
    caseWithId.respondentAddressLine2 = selectedRespondent.value?.respondent_address?.AddressLine2;
    caseWithId.respondentAddressLine3 = selectedRespondent.value?.respondent_address?.AddressLine3;
    caseWithId.respondentAddressCountry = selectedRespondent.value?.respondent_address?.Country;
    caseWithId.respondentAddressPostCode = selectedRespondent.value?.respondent_address?.PostCode;
    caseWithId.respondentAddressCounty = selectedRespondent.value?.respondent_address?.County;
    caseWithId.respondentAddressPostTown = selectedRespondent.value?.respondent_address?.PostTown;
    caseWithId.respondentACASQuestion = selectedRespondent.value?.respondent_ACAS_question;
    caseWithId.respondentACAS = selectedRespondent.value?.respondent_ACAS;
    caseWithId.rejectionReasonOther = selectedRespondent.value?.rejection_reason_other;
    caseWithId.responseOutOfTime = selectedRespondent.value?.responseOutOfTime;
    caseWithId.responseNotOnPrescribedForm = selectedRespondent.value?.responseNotOnPrescribedForm;
    caseWithId.et3ResponseEmploymentInformation = selectedRespondent.value?.et3ResponseEmploymentInformation;
    caseWithId.et3ResponseContinuingEmployment = selectedRespondent.value?.et3ResponseContinuingEmployment;
    caseWithId.et3ResponseIsJobTitleCorrect = selectedRespondent.value?.et3ResponseIsJobTitleCorrect;
    caseWithId.et3ResponseCorrectJobTitle = selectedRespondent.value?.et3ResponseCorrectJobTitle;
    caseWithId.et3ResponseClaimantWeeklyHours = selectedRespondent.value?.et3ResponseClaimantWeeklyHours;
    caseWithId.et3ResponseClaimantCorrectHours = selectedRespondent.value?.et3ResponseClaimantCorrectHours;
    caseWithId.et3ResponseEarningDetailsCorrect = selectedRespondent.value?.et3ResponseEarningDetailsCorrect;
    caseWithId.et3ResponsePayFrequency = selectedRespondent.value?.et3ResponsePayFrequency;
    caseWithId.et3ResponsePayBeforeTax = selectedRespondent.value?.et3ResponsePayBeforeTax;
    caseWithId.et3ResponsePayTakehome = selectedRespondent.value?.et3ResponsePayTakehome;
    caseWithId.respondentEmail = selectedRespondent.value?.respondent_email;
    caseWithId.responseStruckOut = selectedRespondent.value?.responseStruckOut;
    caseWithId.respondentContactPreference = selectedRespondent.value?.respondent_contact_preference;
    caseWithId.responseStruckOutDate = selectedRespondent.value?.responseStruckOutDate;
    caseWithId.responseStruckOutChairman = selectedRespondent.value?.responseStruckOutChairman;
    caseWithId.et3ResponseIsNoticeCorrect = selectedRespondent.value?.et3ResponseIsNoticeCorrect;
    caseWithId.responseRequiredInfoAbsent = selectedRespondent.value?.responseRequiredInfoAbsent;
    caseWithId.responseNotes = selectedRespondent.value?.responseNotes;
    caseWithId.responseReferredToJudge = selectedRespondent.value?.response_referred_to_judge;
    caseWithId.responseReturnedFromJudge = selectedRespondent.value?.response_returned_from_judge;
    caseWithId.respondentType = selectedRespondent.value?.respondentType;
    caseWithId.respondentOrganisation = selectedRespondent.value?.respondentOrganisation;
    caseWithId.respondentFirstName = selectedRespondent.value?.respondentFirstName;
    caseWithId.respondentLastName = selectedRespondent.value?.respondentLastName;
    caseWithId.respondentPhone1 = selectedRespondent.value?.respondent_phone1;
    caseWithId.respondentPhone2 = selectedRespondent.value?.respondent_phone2;
    caseWithId.et3ResponseRespondentEmployerType = selectedRespondent.value?.et3ResponseRespondentEmployerType;
    caseWithId.et3ResponseRespondentPreferredTitle = selectedRespondent.value?.et3ResponseRespondentPreferredTitle;
    caseWithId.et3ResponseRespondentContactName = selectedRespondent.value?.et3ResponseRespondentContactName;
    caseWithId.et3ResponseDXAddress = selectedRespondent.value?.et3ResponseDXAddress;
    caseWithId.et3ResponseContactReason = selectedRespondent.value?.et3ResponseContactReason;
    caseWithId.et3ResponseLanguagePreference = selectedRespondent.value?.et3ResponseLanguagePreference;
    caseWithId.responseStruckOutReason = selectedRespondent.value?.responseStruckOutReason;
    caseWithId.responseRespondentAddressLine1 = selectedRespondent.value?.responseRespondentAddress?.AddressLine1;
    caseWithId.responseRespondentAddressLine2 = selectedRespondent.value?.responseRespondentAddress?.AddressLine2;
    caseWithId.responseRespondentAddressLine3 = selectedRespondent.value?.responseRespondentAddress?.AddressLine3;
    caseWithId.responseRespondentAddressPostTown = selectedRespondent.value?.responseRespondentAddress?.PostTown;
    caseWithId.responseRespondentAddressCounty = selectedRespondent.value?.responseRespondentAddress?.County;
    caseWithId.responseRespondentAddressPostCode = selectedRespondent.value?.responseRespondentAddress?.PostCode;
    caseWithId.responseRespondentAddressCountry = selectedRespondent.value?.responseRespondentAddress?.Country;
    caseWithId.responseRespondentPhone1 = selectedRespondent.value?.responseRespondentPhone1;
    caseWithId.responseRespondentPhone2 = selectedRespondent.value?.responseRespondentPhone2;
    caseWithId.et3IsThereAnEt3Response = selectedRespondent.value?.et3Vetting?.et3IsThereAnEt3Response;
    caseWithId.et3NoEt3Response = selectedRespondent.value?.et3Vetting?.et3NoEt3Response;
    caseWithId.et3GeneralNotes = selectedRespondent.value?.et3Vetting?.et3GeneralNotes;
    caseWithId.et3IsThereACompaniesHouseSearchDocument =
      selectedRespondent.value?.et3Vetting?.et3IsThereACompaniesHouseSearchDocument;
    caseWithId.et3CompanyHouseDocumentBinaryUrl =
      selectedRespondent.value?.et3Vetting?.et3CompanyHouseDocument?.document_binary_url;
    caseWithId.et3CompanyHouseDocumentFileName =
      selectedRespondent.value?.et3Vetting?.et3CompanyHouseDocument?.document_filename;
    caseWithId.et3CompanyHouseDocumentUrl = selectedRespondent.value?.et3Vetting?.et3CompanyHouseDocument?.document_url;
    caseWithId.et3CompanyHouseDocumentCategoryId =
      selectedRespondent.value?.et3Vetting?.et3CompanyHouseDocument?.category_id;
    caseWithId.et3CompanyHouseDocumentUploadTimestamp =
      selectedRespondent.value?.et3Vetting?.et3CompanyHouseDocument?.upload_timestamp;
    caseWithId.et3GeneralNotesCompanyHouse = selectedRespondent.value?.et3Vetting?.et3GeneralNotesCompanyHouse;
    caseWithId.et3IsThereAnIndividualSearchDocument =
      selectedRespondent.value?.et3Vetting?.et3IsThereAnIndividualSearchDocument;
    caseWithId.et3IndividualInsolvencyDocumentBinaryUrl =
      selectedRespondent.value?.et3Vetting?.et3IndividualInsolvencyDocument?.document_binary_url;
    caseWithId.et3IndividualInsolvencyDocumentFileName =
      selectedRespondent.value?.et3Vetting?.et3IndividualInsolvencyDocument?.document_filename;
    caseWithId.et3IndividualInsolvencyDocumentUrl =
      selectedRespondent.value?.et3Vetting?.et3IndividualInsolvencyDocument?.document_url;
    caseWithId.et3IndividualInsolvencyDocumentCategoryId =
      selectedRespondent.value?.et3Vetting?.et3IndividualInsolvencyDocument?.category_id;
    caseWithId.et3IndividualInsolvencyDocumentUploadTimestamp =
      selectedRespondent.value?.et3Vetting?.et3IndividualInsolvencyDocument?.upload_timestamp;
    caseWithId.et3GeneralNotesIndividualInsolvency =
      selectedRespondent.value?.et3Vetting?.et3GeneralNotesIndividualInsolvency;
    caseWithId.et3LegalIssue = selectedRespondent.value?.et3Vetting?.et3LegalIssue;
    caseWithId.et3LegalIssueGiveDetails = selectedRespondent.value?.et3Vetting?.et3LegalIssueGiveDetails;
    caseWithId.et3GeneralNotesLegalEntity = selectedRespondent.value?.et3Vetting?.et3GeneralNotesLegalEntity;
    caseWithId.et3ResponseInTime = selectedRespondent.value?.et3Vetting?.et3ResponseInTime;
    caseWithId.et3ResponseInTimeDetails = selectedRespondent.value?.et3Vetting?.et3ResponseInTimeDetails;
    caseWithId.et3DoWeHaveRespondentsName = selectedRespondent.value?.et3Vetting?.et3DoWeHaveRespondentsName;
    caseWithId.et3GeneralNotesRespondentName = selectedRespondent.value?.et3Vetting?.et3DoWeHaveRespondentsName;
    caseWithId.et3DoesRespondentsNameMatch = selectedRespondent.value?.et3Vetting?.et3DoesRespondentsNameMatch;
    caseWithId.et3RespondentNameMismatchDetails =
      selectedRespondent.value?.et3Vetting?.et3RespondentNameMismatchDetails;
    caseWithId.et3GeneralNotesRespondentNameMatch =
      selectedRespondent.value?.et3Vetting?.et3GeneralNotesRespondentNameMatch;
    caseWithId.et3DoWeHaveRespondentsAddress = selectedRespondent.value?.et3Vetting?.et3DoWeHaveRespondentsAddress;
    caseWithId.et3DoesRespondentsAddressMatch = selectedRespondent.value?.et3Vetting?.et3DoesRespondentsAddressMatch;
    caseWithId.et3RespondentAddressMismatchDetails =
      selectedRespondent.value?.et3Vetting?.et3RespondentAddressMismatchDetails;
    caseWithId.et3GeneralNotesRespondentAddress =
      selectedRespondent.value?.et3Vetting?.et3GeneralNotesRespondentAddress;
    caseWithId.et3GeneralNotesAddressMatch = selectedRespondent.value?.et3Vetting?.et3GeneralNotesAddressMatch;
    caseWithId.et3IsCaseListedForHearing = selectedRespondent.value?.et3Vetting?.et3IsCaseListedForHearing;
    caseWithId.et3IsCaseListedForHearingDetails =
      selectedRespondent.value?.et3Vetting?.et3IsCaseListedForHearingDetails;
    caseWithId.et3GeneralNotesCaseListed = selectedRespondent.value?.et3Vetting?.et3GeneralNotesCaseListed;
    caseWithId.et3IsThisLocationCorrect = selectedRespondent.value?.et3Vetting?.et3IsThisLocationCorrect;
    caseWithId.et3GeneralNotesTransferApplication =
      selectedRespondent.value?.et3Vetting?.et3GeneralNotesTransferApplication;
    caseWithId.et3RegionalOffice = selectedRespondent.value?.et3Vetting?.et3RegionalOffice;
    caseWithId.et3WhyWeShouldChangeTheOffice = selectedRespondent.value?.et3Vetting?.et3WhyWeShouldChangeTheOffice;
    caseWithId.et3ContestClaim = selectedRespondent.value?.et3Vetting?.et3ContestClaim;
    caseWithId.et3ContestClaimGiveDetails = selectedRespondent.value?.et3Vetting?.et3ContestClaimGiveDetails;
    caseWithId.et3GeneralNotesContestClaim = selectedRespondent.value?.et3Vetting?.et3GeneralNotesContestClaim;
    caseWithId.et3ContractClaimSection7 = selectedRespondent.value?.et3Vetting?.et3ContractClaimSection7;
    caseWithId.et3ContractClaimSection7Details = selectedRespondent.value?.et3Vetting?.et3ContractClaimSection7Details;
    caseWithId.et3GeneralNotesContractClaimSection7 =
      selectedRespondent.value?.et3Vetting?.et3GeneralNotesContractClaimSection7;
    caseWithId.et3Rule26 = selectedRespondent.value?.et3Vetting?.et3Rule26;
    caseWithId.et3Rule26Details = selectedRespondent.value?.et3Vetting?.et3Rule26Details;
    caseWithId.et3SuggestedIssues = selectedRespondent.value?.et3Vetting?.et3SuggestedIssues;
    caseWithId.et3SuggestedIssuesStrikeOut = selectedRespondent.value?.et3Vetting?.et3SuggestedIssuesStrikeOut;
    caseWithId.et3SuggestedIssueInterpreters = selectedRespondent.value?.et3Vetting?.et3SuggestedIssueInterpreters;
    caseWithId.et3SuggestedIssueJurisdictional = selectedRespondent.value?.et3Vetting?.et3SuggestedIssueJurisdictional;
    caseWithId.et3SuggestedIssueAdjustments = selectedRespondent.value?.et3Vetting?.et3SuggestedIssueAdjustments;
    caseWithId.et3SuggestedIssueRule50 = selectedRespondent.value?.et3Vetting?.et3SuggestedIssueRule50;
    caseWithId.et3SuggestedIssueTimePoints = selectedRespondent.value?.et3Vetting?.et3SuggestedIssueTimePoints;
    caseWithId.et3GeneralNotesRule26 = selectedRespondent.value?.et3Vetting?.et3GeneralNotesRule26;
    caseWithId.et3AdditionalInformation = selectedRespondent.value?.et3Vetting?.et3AdditionalInformation;
    caseWithId.et3VettingDocumentBinaryUrl =
      selectedRespondent.value?.et3Vetting?.et3VettingDocument?.document_binary_url;
    caseWithId.et3VettingDocumentFileName = selectedRespondent.value?.et3Vetting?.et3VettingDocument?.document_filename;
    caseWithId.et3VettingDocumentUrl = selectedRespondent.value?.et3Vetting?.et3VettingDocument?.document_url;
    caseWithId.et3VettingDocumentCategoryId = selectedRespondent.value?.et3Vetting?.et3VettingDocument?.category_id;
    caseWithId.et3VettingDocumentUploadTimestamp =
      selectedRespondent.value?.et3Vetting?.et3VettingDocument?.upload_timestamp;
    caseWithId.et3VettingCompleted = selectedRespondent.value?.et3VettingCompleted;
    caseWithId.et3ResponseIsClaimantNameCorrect = selectedRespondent.value?.et3ResponseIsClaimantNameCorrect;
    caseWithId.et3ResponseClaimantNameCorrection = selectedRespondent.value?.et3ResponseClaimantNameCorrection;
    caseWithId.et3ResponseRespondentCompanyNumber = selectedRespondent.value?.et3ResponseRespondentCompanyNumber;
    caseWithId.et3ResponseHearingRepresentative = selectedRespondent.value?.et3ResponseHearingRepresentative;
    caseWithId.et3ResponseHearingRespondent = selectedRespondent.value?.et3ResponseHearingRespondent;
    caseWithId.et3ResponseEmploymentCount = selectedRespondent.value?.et3ResponseEmploymentCount;
    caseWithId.et3ResponseMultipleSites = selectedRespondent.value?.et3ResponseMultipleSites;
    caseWithId.et3ResponseSiteEmploymentCount = selectedRespondent.value?.et3ResponseSiteEmploymentCount;
    caseWithId.et3ResponseEmployerClaim = selectedRespondent.value?.et3ResponseEmployerClaim;
    caseWithId.et3ResponseEmployerClaimDetails = selectedRespondent.value?.et3ResponseEmployerClaimDetails;
    caseWithId.et3ResponseEmployerClaimDocumentBinaryUrl =
      selectedRespondent.value?.et3ResponseEmployerClaimDocument?.document_binary_url;
    caseWithId.et3ResponseEmployerClaimDocumentFileName =
      selectedRespondent.value?.et3ResponseEmployerClaimDocument?.document_filename;
    caseWithId.et3ResponseEmployerClaimDocumentUrl =
      selectedRespondent.value?.et3ResponseEmployerClaimDocument?.document_url;
    caseWithId.et3ResponseEmployerClaimDocumentCategoryId =
      selectedRespondent.value?.et3ResponseEmployerClaimDocument?.category_id;
    caseWithId.et3ResponseEmployerClaimDocumentUploadTimestamp =
      selectedRespondent.value?.et3ResponseEmployerClaimDocument?.upload_timestamp;
    caseWithId.et3ResponseRespondentSupportNeeded = selectedRespondent.value?.et3ResponseRespondentSupportNeeded;
    caseWithId.et3ResponseAcasAgree = selectedRespondent.value?.et3ResponseAcasAgree;
    caseWithId.et3ResponseAcasAgreeReason = selectedRespondent.value?.et3ResponseAcasAgreeReason;
    caseWithId.et3ResponseAreDatesCorrect = selectedRespondent.value?.et3ResponseAreDatesCorrect;
    caseWithId.et3ResponseEmploymentStartDate = selectedRespondent.value?.et3ResponseEmploymentStartDate;
    caseWithId.et3ResponseEmploymentEndDate = selectedRespondent.value?.et3ResponseEmploymentEndDate;
    caseWithId.et3ResponseCorrectNoticeDetails = selectedRespondent.value?.et3ResponseCorrectNoticeDetails;
    caseWithId.et3ResponseIsPensionCorrect = selectedRespondent.value?.et3ResponseIsPensionCorrect;
    caseWithId.et3ResponsePensionCorrectDetails = selectedRespondent.value?.et3ResponsePensionCorrectDetails;
    caseWithId.et3ResponseRespondentContestClaim = selectedRespondent.value?.et3ResponseRespondentContestClaim;
    caseWithId.et3ResponseContestClaimDocument = selectedRespondent.value?.et3ResponseContestClaimDocument;
    caseWithId.et3ResponseContestClaimDetails = selectedRespondent.value?.et3ResponseContestClaimDetails;
    caseWithId.et3ResponseRespondentSupportDetails = selectedRespondent.value?.et3ResponseRespondentSupportDetails;
    caseWithId.et3ResponseRespondentSupportDocumentBinaryUrl =
      selectedRespondent.value?.et3ResponseRespondentSupportDocument?.document_binary_url;
    caseWithId.et3ResponseRespondentSupportDocumentFileName =
      selectedRespondent.value?.et3ResponseRespondentSupportDocument?.document_filename;
    caseWithId.et3ResponseRespondentSupportDocumentUrl =
      selectedRespondent.value?.et3ResponseRespondentSupportDocument?.document_url;
    caseWithId.et3ResponseRespondentSupportDocumentCategoryId =
      selectedRespondent.value?.et3ResponseRespondentSupportDocument?.category_id;
    caseWithId.et3ResponseRespondentSupportDocumentUploadTimestamp =
      selectedRespondent.value?.et3ResponseRespondentSupportDocument?.upload_timestamp;
    caseWithId.et3FormBinaryUrl = selectedRespondent.value?.et3Form?.document_binary_url;
    caseWithId.et3FormFileName = selectedRespondent.value?.et3Form?.document_filename;
    caseWithId.et3FormUrl = selectedRespondent.value?.et3Form?.document_url;
    caseWithId.et3FormCategoryId = selectedRespondent.value?.et3Form?.category_id;
    caseWithId.et3FormUploadTimestamp = selectedRespondent.value?.et3Form?.upload_timestamp;
    caseWithId.contactDetailsSection = selectedRespondent.value?.contactDetailsSection;
    caseWithId.employerDetailsSection = selectedRespondent.value?.employerDetailsSection;
    caseWithId.conciliationAndEmployeeDetailsSection = selectedRespondent.value?.conciliationAndEmployeeDetailsSection;
    caseWithId.payPensionBenefitDetailsSection = selectedRespondent.value?.payPensionBenefitDetailsSection;
    caseWithId.contestClaimSection = selectedRespondent.value?.contestClaimSection;
    caseWithId.employersContractClaimSection = selectedRespondent.value?.employersContractClaimSection;
    caseWithId.respondentEnterPostcode = selectedRespondent.value?.respondent_address.PostCode;
    caseWithId.responseRespondentEmail = selectedRespondent.value?.responseRespondentEmail;
    caseWithId.responseRespondentContactPreference = selectedRespondent.value?.responseRespondentContactPreference;
    caseWithId.responseReceivedDate = selectedRespondent.value?.responseReceivedDate;
    caseWithId.responseReceivedCount = selectedRespondent.value?.responseReceivedCount;
    caseWithId.responseRespondentNameQuestion = selectedRespondent.value?.responseRespondentNameQuestion;
    caseWithId.responseRespondentName = selectedRespondent.value?.responseRespondentName;
    caseWithId.responseContinue = selectedRespondent.value?.responseContinue;
    caseWithId.responseCounterClaim = selectedRespondent.value?.responseCounterClaim;
    caseWithId.responseReference = selectedRespondent.value?.responseReference;
    caseWithId.extensionRequested = selectedRespondent.value?.extensionRequested;
    caseWithId.extensionGranted = selectedRespondent.value?.extensionGranted;
    caseWithId.extensionDate = selectedRespondent.value?.extensionDate;
    caseWithId.extensionResubmitted = selectedRespondent.value?.extensionResubmitted;
    caseWithId.idamId = selectedRespondent.value?.idamId;
    caseWithId.et3CaseDetailsLinksStatuses = selectedRespondent.value?.et3CaseDetailsLinksStatuses;
    caseWithId.et3HubLinksStatuses = selectedRespondent.value?.et3HubLinksStatuses;
  }
}

export function toApiFormat(caseItem: CaseWithId): UpdateCaseBody {
  const updateCaseBody = getUpdateCaseBody(caseItem);
  if (updateCaseBody.case_data.triageQuestions !== undefined) {
    updateCaseBody.case_data.triageQuestions.typesOfClaim = updateCaseBody.case_data.typesOfClaim;
  }
  return updateCaseBody;
}
export function getUpdateCaseBody(caseItem: CaseWithId): UpdateCaseBody {
  return {
    case_id: caseItem.id,
    case_type_id: caseItem.caseTypeId,
    case_data: {
      caseType: caseItem.caseType,
      claimantRepresentedQuestion: caseItem.claimantRepresentedQuestion,
      caseSource: CcdDataModel.CASE_SOURCE,
      claimant_TypeOfClaimant: TYPE_OF_CLAIMANT,
      typesOfClaim: caseItem.typeOfClaim,
      ClaimantPcqId: caseItem.ClaimantPcqId,
      claimantIndType: {
        claimant_first_names: caseItem.firstName,
        claimant_last_name: caseItem.lastName,
        claimant_date_of_birth: formatDate(caseItem.dobDate),
        claimant_sex: caseItem.claimantSex,
        claimant_preferred_title: isValidPreferredTitle(caseItem.preferredTitle),
        claimant_title_other: isOtherTitle(caseItem.preferredTitle),
      },
      claimantType: {
        claimant_email_address: caseItem.email,
        claimant_phone_number: caseItem.telNumber,
        claimant_contact_preference: caseItem.claimantContactPreference,
        claimant_addressUK: {
          AddressLine1: caseItem.address1,
          AddressLine2: caseItem.address2,
          PostTown: caseItem.addressTown,
          PostCode: caseItem.addressPostcode,
          Country: caseItem.addressCountry,
        },
      },
      claimantOtherType: {
        pastEmployer: caseItem.pastEmployer,
        stillWorking: caseItem.isStillWorking,
        claimant_occupation: caseItem.jobTitle,
        claimant_employed_from: formatDate(caseItem.startDate),
        claimant_notice_period: caseItem.noticePeriod,
        claimant_notice_period_unit: caseItem.noticePeriodUnit,
        claimant_notice_period_duration: caseItem.noticePeriodLength,
        claimant_average_weekly_hours: caseItem.avgWeeklyHrs,
        claimant_pay_before_tax: formatToCcdAcceptedNumber(caseItem.payBeforeTax),
        claimant_pay_after_tax: formatToCcdAcceptedNumber(caseItem.payAfterTax),
        claimant_pay_cycle: caseItem.payInterval,
        claimant_pension_contribution: caseItem.claimantPensionContribution,
        claimant_pension_weekly_contribution: caseItem.claimantPensionWeeklyContribution,
        claimant_benefits: caseItem.employeeBenefits,
        claimant_benefits_detail: caseItem.benefitsCharCount,
        claimant_employed_notice_period: formatDate(caseItem.noticeEnds),
        claimant_employed_to: formatDate(caseItem.endDate),
      },
      newEmploymentType: {
        new_job: caseItem.newJob,
        newly_employed_from: formatDate(caseItem.newJobStartDate),
        new_pay_before_tax: formatToCcdAcceptedNumber(caseItem.newJobPay),
        new_job_pay_interval: caseItem.newJobPayInterval,
      },
      claimantHearingPreference: {
        reasonable_adjustments: caseItem.reasonableAdjustments,
        reasonable_adjustments_detail: caseItem.reasonableAdjustmentsDetail,
        hearing_preferences: caseItem.hearingPreferences,
        hearing_assistance: caseItem.hearingAssistance,
        contact_language: caseItem.claimantContactLanguagePreference,
        hearing_language: caseItem.claimantHearingLanguagePreference,
      },
      claimantRequests: {
        discrimination_claims: caseItem.claimTypeDiscrimination,
        pay_claims: caseItem.claimTypePay,
        claim_description: caseItem.claimSummaryText,
        claim_outcome: caseItem.tellUsWhatYouWant,
        claimant_compensation_text: caseItem.compensationOutcome,
        claimant_compensation_amount: formatToCcdAcceptedNumber(caseItem.compensationAmount),
        claimant_tribunal_recommendation: caseItem.tribunalRecommendationRequest,
        whistleblowing: caseItem.whistleblowingClaim,
        whistleblowing_authority: caseItem.whistleblowingEntityName,
        linked_cases: caseItem.linkedCases,
        linked_cases_detail: caseItem.linkedCasesDetail,
        claim_description_document: caseItem.claimSummaryFile,
        other_claim: caseItem.otherClaim,
      },
      claimantTaskListChecks: {
        personalDetailsCheck: caseItem.personalDetailsCheck,
        employmentAndRespondentCheck: caseItem.employmentAndRespondentCheck,
        claimDetailsCheck: caseItem.claimDetailsCheck,
      },
      claimantWorkAddress: {
        claimant_work_address: {
          AddressLine1: caseItem.workAddress1,
          AddressLine2: caseItem.workAddress2,
          PostTown: caseItem.workAddressTown,
          Country: caseItem.workAddressCountry,
          PostCode: caseItem.workAddressPostcode,
        },
      },
      respondentCollection: setRespondentApiFormat(caseItem.respondents),
      claimantWorkAddressQuestion: caseItem.claimantWorkAddressQuestion,
      hubLinksStatuses: caseItem.hubLinksStatuses,
    },
  };
}

export function fromApiFormatDocument(document: DocumentUploadResponse): Document {
  const mimeType = getFileExtension(document?.originalDocumentName);
  return {
    document_url: document.uri,
    document_filename: document.originalDocumentName,
    document_binary_url: document._links.binary.href,
    document_size: parseInt(document.size),
    document_mime_type: mimeType,
  };
}

export const formatToCcdAcceptedNumber = (amount: number): number => {
  if (amount === undefined) {
    return;
  }
  return parseFloat(amount.toString().replace(/,/g, ''));
};

export const formatDate = (date: CaseDate): string => {
  if (!date || isDateEmpty(date)) {
    return null;
  }
  return `${date.year}-${date.month.padStart(2, '0')}-${date.day.padStart(2, '0')}`;
};

export const parseDateFromString = (date: string): CaseDate => {
  if (date) {
    return {
      year: date.substring(0, 4),
      month: date.substring(5, 7),
      day: date.substring(8, 10),
    };
  }
};

export const isValidPreferredTitle = (title: string): string => {
  if (title === undefined || title === '') {
    return undefined;
  }
  const titleValues = Object.values(ccdPreferredTitle);
  for (const titleValue of titleValues) {
    if (title.toLocaleLowerCase() === titleValue.toLocaleLowerCase()) {
      return titleValue;
    }
  }
  return ccdPreferredTitle.OTHER;
};

export const isOtherTitle = (title: string): string => {
  if (title === undefined || title === '') {
    return undefined;
  }
  const titleValues = Object.values(ccdPreferredTitle);
  for (const titleValue of titleValues) {
    if (title.toLocaleLowerCase() === titleValue.toLocaleLowerCase()) {
      return undefined;
    }
  }
  return title;
};

export const returnPreferredTitle = (preferredTitle?: string, otherTitle?: string): string => {
  if (otherTitle) {
    return otherTitle;
  } else {
    return preferredTitle;
  }
};

function convertFromTimestampString(responseDate: string, req: AppRequest) {
  const dateComponent = responseDate.substring(0, responseDate.indexOf('T'));
  return returnTranslatedDateString(dateComponent, retrieveCurrentLocale(req?.url));
}

export const getDueDate = (date: string, daysUntilDue: number): string => {
  if (!date) {
    return;
  }
  const deadline = new Date(date);
  if (deadline instanceof Date && !isNaN(deadline.getTime())) {
    deadline.setDate(deadline.getDate() + daysUntilDue);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(deadline));
  }
};

export const mapRespondents = (respondents: RespondentApiModel[]): RespondentET3Model[] => {
  if (respondents === undefined) {
    return;
  }
  return respondents.map(respondent => {
    const respondentVal = mapRespondent(respondent.value);
    respondentVal.ccdId = respondent.id;
    return respondentVal;
  });
};

export const mapRespondent = (respondent: RespondentType): RespondentET3Model => {
  return {
    respondentName: respondent?.respondent_name,
    respondentAddressLine1: respondent?.respondent_address?.AddressLine1,
    respondentAddressLine2: respondent?.respondent_address?.AddressLine2,
    respondentAddressPostTown: respondent?.respondent_address?.PostTown,
    respondentAddressCountry: respondent?.respondent_address?.Country,
    respondentAddressPostCode: respondent?.respondent_address?.PostCode,
    respondentEnterPostcode: respondent?.respondent_address?.PostCode,
    acasCert: respondent?.respondent_ACAS_question,
    acasCertNum: respondent?.respondent_ACAS,
    noAcasReason: respondent?.respondent_ACAS_no,
    respondentOrganisation: respondent?.respondentOrganisation,
    respondentAddress: respondent?.respondent_address,
    respondentACASQuestion: respondent?.respondent_ACAS_question,
    respondentACAS: respondent?.respondent_ACAS,
    respondentACASNo: respondent?.respondent_ACAS_no,
    claimantWorkAddress: respondent?.claimant_work_address,
    responseReceived: respondent?.responseReceived,
    responseStatus: respondent?.response_status,
    responseToClaim: respondent?.responseToClaim,
    rejectionReason: respondent?.rejection_reason,
    rejectionReasonOther: respondent?.rejection_reason_other,
    responseOutOfTime: respondent?.responseOutOfTime,
    responseNotOnPrescribedForm: respondent?.responseNotOnPrescribedForm,
    responseRequiredInfoAbsent: respondent?.responseRequiredInfoAbsent,
    responseNotes: respondent?.responseNotes,
    responseReferredToJudge: respondent?.response_referred_to_judge,
    responseReturnedFromJudge: respondent?.response_returned_from_judge,
    respondentType: respondent?.respondentType,
    respondentFirstName: respondent?.respondentFirstName,
    respondentLastName: respondent?.respondentLastName,
    respondentPhone1: respondent?.respondent_phone1,
    respondentPhone2: respondent?.respondent_phone2,
    respondentEmail: respondent?.respondent_email,
    respondentContactPreference: respondent?.respondent_contact_preference,
    responseStruckOut: respondent?.responseStruckOut,
    responseStruckOutDate: respondent?.responseStruckOutDate,
    responseStruckOutChairman: respondent?.responseStruckOutChairman,
    responseStruckOutReason: respondent?.responseStruckOutReason,
    responseRespondentAddress: respondent?.responseRespondentAddress,
    responseRespondentPhone1: respondent?.responseRespondentPhone1,
    responseRespondentPhone2: respondent?.responseRespondentPhone2,
    responseRespondentEmail: respondent?.responseRespondentEmail,
    responseRespondentContactPreference: respondent?.responseRespondentContactPreference,
    responseReceivedDate: respondent?.responseReceivedDate,
    responseReceivedCount: respondent?.responseReceivedCount,
    responseRespondentNameQuestion: respondent?.responseRespondentNameQuestion,
    responseRespondentName: respondent?.responseRespondentName,
    responseContinue: respondent?.responseContinue,
    responseCounterClaim: respondent?.responseCounterClaim,
    responseReference: respondent?.responseReference,
    extensionRequested: respondent?.extensionRequested,
    extensionGranted: respondent?.extensionGranted,
    extensionDate: respondent?.extensionDate,
    extensionResubmitted: respondent?.extensionResubmitted,
    et3Vetting: respondent?.et3Vetting,
    et3VettingCompleted: respondent?.et3VettingCompleted,
    et3ResponseIsClaimantNameCorrect: respondent?.et3ResponseIsClaimantNameCorrect,
    et3ResponseClaimantNameCorrection: respondent?.et3ResponseClaimantNameCorrection,
    et3ResponseRespondentCompanyNumber: respondent?.et3ResponseRespondentCompanyNumber,
    et3ResponseRespondentEmployerType: respondent?.et3ResponseRespondentEmployerType,
    et3ResponseRespondentPreferredTitle: respondent?.et3ResponseRespondentPreferredTitle,
    et3ResponseRespondentContactName: respondent?.et3ResponseRespondentContactName,
    et3ResponseDXAddress: respondent?.et3ResponseDXAddress,
    et3ResponseContactReason: respondent?.et3ResponseContactReason,
    et3ResponseLanguagePreference: respondent?.et3ResponseLanguagePreference,
    et3ResponseHearingRepresentative: respondent?.et3ResponseHearingRepresentative,
    et3ResponseHearingRespondent: respondent?.et3ResponseHearingRespondent,
    et3ResponseEmploymentCount: respondent?.et3ResponseEmploymentCount,
    et3ResponseMultipleSites: respondent?.et3ResponseMultipleSites,
    et3ResponseSiteEmploymentCount: respondent?.et3ResponseSiteEmploymentCount,
    et3ResponseAcasAgree: respondent?.et3ResponseAcasAgree,
    et3ResponseAcasAgreeReason: respondent?.et3ResponseAcasAgreeReason,
    et3ResponseAreDatesCorrect: respondent?.et3ResponseAreDatesCorrect,
    et3ResponseEmploymentStartDate: respondent?.et3ResponseEmploymentStartDate,
    et3ResponseEmploymentEndDate: respondent?.et3ResponseEmploymentEndDate,
    et3ResponseEmploymentInformation: respondent?.et3ResponseEmploymentInformation,
    et3ResponseContinuingEmployment: respondent?.et3ResponseContinuingEmployment,
    et3ResponseIsJobTitleCorrect: respondent?.et3ResponseIsJobTitleCorrect,
    et3ResponseCorrectJobTitle: respondent?.et3ResponseCorrectJobTitle,
    et3ResponseClaimantWeeklyHours: respondent?.et3ResponseClaimantWeeklyHours,
    et3ResponseClaimantCorrectHours: respondent?.et3ResponseClaimantCorrectHours,
    et3ResponseEarningDetailsCorrect: respondent?.et3ResponseEarningDetailsCorrect,
    et3ResponsePayFrequency: respondent?.et3ResponsePayFrequency,
    et3ResponsePayBeforeTax: respondent?.et3ResponsePayBeforeTax,
    et3ResponsePayTakehome: respondent?.et3ResponsePayTakehome,
    et3ResponseIsNoticeCorrect: respondent?.et3ResponseIsNoticeCorrect,
    et3ResponseCorrectNoticeDetails: respondent?.et3ResponseCorrectNoticeDetails,
    et3ResponseIsPensionCorrect: respondent?.et3ResponseIsPensionCorrect,
    et3ResponsePensionCorrectDetails: respondent?.et3ResponsePensionCorrectDetails,
    et3ResponseRespondentContestClaim: respondent?.et3ResponseRespondentContestClaim,
    et3ResponseContestClaimDocument: respondent?.et3ResponseContestClaimDocument,
    et3ResponseContestClaimDetails: respondent?.et3ResponseContestClaimDetails,
    et3ResponseEmployerClaim: respondent?.et3ResponseEmployerClaim,
    et3ResponseEmployerClaimDetails: respondent?.et3ResponseEmployerClaimDetails,
    et3ResponseEmployerClaimDocument: respondent?.et3ResponseEmployerClaimDocument,
    et3ResponseRespondentSupportNeeded: respondent?.et3ResponseRespondentSupportNeeded,
    et3ResponseRespondentSupportDetails: respondent?.et3ResponseRespondentSupportDetails,
    et3ResponseRespondentSupportDocument: respondent?.et3ResponseRespondentSupportDocument,
    et3Form: respondent?.et3Form,
    contactDetailsSection: respondent?.contactDetailsSection,
    employerDetailsSection: respondent?.employerDetailsSection,
    conciliationAndEmployeeDetailsSection: respondent?.conciliationAndEmployeeDetailsSection,
    payPensionBenefitDetailsSection: respondent?.payPensionBenefitDetailsSection,
    contestClaimSection: respondent?.contestClaimSection,
    employersContractClaimSection: respondent?.employersContractClaimSection,
    workAddressLine1: respondent?.workAddress1,
    workAddressLine2: respondent?.workAddress2,
    workAddressTown: respondent?.workAddressTown,
    workAddressCountry: respondent?.workAddressCountry,
    workAddressPostcode: respondent?.workAddressPostcode,
    idamId: respondent?.idamId,
    et3CaseDetailsLinksStatuses: respondent?.et3CaseDetailsLinksStatuses,
    et3HubLinksStatuses: respondent?.et3HubLinksStatuses,
  };
};

export const mapRepresentatives = (representatives: RepresentativeApiModel[]): Representative[] => {
  return representatives?.map(rep => {
    return {
      hasMyHMCTSAccount: rep.value.myHmctsYesNo,
      respondentId: rep.value.respondentId,
    };
  });
};

export const setRespondentApiFormat = (respondents: RespondentET3Model[]): RespondentRequestBody[] => {
  if (respondents === undefined) {
    return;
  }
  return respondents.map(respondent => {
    return {
      value: {
        respondent_name: respondent.respondentName,
        respondent_address: {
          AddressLine1: respondent.respondentAddressLine1,
          AddressLine2: respondent.respondentAddressLine2,
          PostTown: respondent.respondentAddressPostTown,
          Country: respondent.respondentAddressCountry,
          PostCode: respondent.respondentAddressPostCode,
        },
        respondent_ACAS_question: respondent.acasCert,
        respondent_ACAS: respondent.acasCertNum,
        respondent_ACAS_no: respondent.noAcasReason,
      },
      id: respondent.ccdId,
    };
  });
};

export const returnSubmittedEt1Form = (
  lang: EnglishOrWelsh,
  documentCollection?: DocumentApiModel[]
): DocumentDetail => {
  if (documentCollection === undefined) {
    return;
  }

  const documentDetailCollection = setDocumentValues(documentCollection, et1DocTypes);

  if (documentDetailCollection !== undefined) {
    if (lang === EnglishOrWelsh.WELSH && documentDetailCollection.length > 1) {
      return documentDetailCollection[1];
    }
    return documentDetailCollection[0];
  }
};

export const setDocumentValues = (
  documentCollection: DocumentApiModel[],
  docType?: string[],
  isEt3Supporting?: boolean
): DocumentDetail[] => {
  if (!documentCollection) {
    return;
  }

  const foundDocuments = documentCollection
    .filter(doc => !docType || docType.includes(doc.value.typeOfDocument))
    .map(doc => {
      return {
        id: getDocId(doc.value?.uploadedDocument?.document_url),
        description: !docType ? '' : doc.value?.shortDescription,
        type: isEt3Supporting ? 'et3Supporting' : doc.value.typeOfDocument,
      };
    });
  return foundDocuments.length ? foundDocuments : undefined;
};

export const getDocId = (url: string): string => {
  return url?.substring(url.lastIndexOf('/') + 1, url.length);
};

export const getFileExtension = (fileName: string): string => {
  if (!fileName) {
    return '';
  }
  return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
};

const hasResponseFromRespondentList = (caseData: CaseData): boolean => {
  if (caseData?.respondentCollection) {
    return caseData.respondentCollection.some(r => r.value.responseReceived === YesOrNo.YES);
  }

  return false;
};

const sortApplicationByDate = (items: GenericTseApplicationTypeItem[]): GenericTseApplicationTypeItem[] => {
  if (items?.length === 0) {
    return [];
  }

  items?.sort(sortByDate);

  return items;
};

export const mapBundlesDocs = (
  bundles: TypeItem<HearingBundleType>[],
  bundleType: AllDocumentTypeValue
): DocumentTypeItem[] | undefined => {
  return !bundles?.length
    ? undefined
    : bundles.map<DocumentTypeItem>(item => ({
        id: '',
        value: {
          shortDescription: item.value.formattedSelectedHearing || bundleType,
          uploadedDocument: item.value.uploadFile,
          typeOfDocument: bundleType,
          creationDate: '',
        },
      }));
};
