import { ET3RequestModel } from '../definitions/ET3RequestModel';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { RespondentSumType, RespondentType } from '../definitions/complexTypes/respondent';
import { FormFieldNames, LoggerConstants, ServiceErrors, ValidationErrors } from '../definitions/constants';
import { getLogger } from '../logger';

import CollectionUtils from './CollectionUtils';
import DateUtils from './DateUtils';
import ErrorUtils from './ErrorUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

const logger = getLogger('ET3DataModelUtils');

export default class ET3DataModelUtil {
  public static convertCaseWithIdToET3Request(
    req: AppRequest,
    requestType: string,
    caseDetailsLinksSectionId: string,
    caseDetailsLinksSectionStatus: string,
    responseHubLinksSectionId: string,
    responseHubLinksSectionStatus: string
  ): ET3RequestModel {
    const idamId = req.session?.user?.id;
    if (StringUtils.isBlank(idamId)) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_IDAM_ID_NOT_FOUND);
    }
    if (StringUtils.isBlank(requestType)) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_REQUEST_TYPE_NOT_FOUND);
    }
    const caseWithId = req.session?.userCase;
    const selectedRespondentIndex: number = req.session?.selectedRespondentIndex;
    if (
      NumberUtils.isEmpty(selectedRespondentIndex) ||
      CollectionUtils.isEmpty(caseWithId.respondents) ||
      ObjectUtils.isEmpty(caseWithId.respondents[selectedRespondentIndex])
    ) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_RESPONDENT_NOT_FOUND);
    }
    const selectedRespondent: RespondentET3Model = caseWithId.respondents[selectedRespondentIndex];
    return {
      caseSubmissionReference: caseWithId.id,
      caseTypeId: caseWithId.caseTypeId,
      requestType,
      caseDetailsLinksSectionId,
      caseDetailsLinksSectionStatus,
      responseHubLinksSectionId,
      responseHubLinksSectionStatus,
      respondent: this.convertSelectedRespondentToRespondentTypeItem(caseWithId, selectedRespondent),
    };
  }

  public static convertSelectedRespondentToRespondentTypeItem(
    caseWithId: CaseWithId,
    selectedRespondent: RespondentET3Model
  ): RespondentSumType {
    return {
      id: selectedRespondent.ccdId,
      value: this.convertSelectedRespondentToRespondentType(caseWithId, selectedRespondent),
    };
  }

  public static convertSelectedRespondentToRespondentType(
    caseWithId: CaseWithId,
    selectedRespondent: RespondentET3Model
  ): RespondentType {
    const respondentType: RespondentType = {
      response_status: caseWithId.responseStatus,
      responseToClaim: caseWithId.responseToClaim,
      rejection_reason: caseWithId.rejectionReason,
      rejection_reason_other: caseWithId.rejectionReasonOther,
      responseOutOfTime: caseWithId.responseOutOfTime,
      responseNotOnPrescribedForm: caseWithId.responseNotOnPrescribedForm,
      responseRequiredInfoAbsent: caseWithId.responseRequiredInfoAbsent,
      responseNotes: caseWithId.responseNotes,
      response_referred_to_judge: caseWithId.responseReferredToJudge,
      response_returned_from_judge: caseWithId.responseReturnedFromJudge,
      respondent_name: caseWithId.respondentName,
      respondentType: caseWithId.respondentType,
      respondentOrganisation: caseWithId.respondentOrganisation,
      respondentFirstName: caseWithId.respondentFirstName,
      respondentLastName: caseWithId.respondentLastName,
      respondent_ACAS_question: caseWithId.respondentACASQuestion,
      respondent_ACAS: caseWithId.respondentACAS,
      respondent_ACAS_no: caseWithId.respondentACASNo,
      respondent_address: {
        AddressLine1: caseWithId.respondentAddressLine1,
        AddressLine2: caseWithId.respondentAddressLine2,
        AddressLine3: caseWithId.respondentAddressLine3,
        PostTown: caseWithId.respondentAddressPostTown,
        County: caseWithId.respondentAddressCounty,
        PostCode: caseWithId.respondentAddressPostCode,
        Country: caseWithId.respondentAddressCountry,
      },
      respondent_phone1: caseWithId.respondentPhone1,
      respondent_phone2: caseWithId.respondentPhone2,
      respondent_email: caseWithId.respondentEmail,
      respondent_contact_preference: caseWithId.respondentContactPreference,
      responseStruckOut: caseWithId.responseStruckOut,
      responseStruckOutDate: caseWithId.responseStruckOutDate,
      responseStruckOutChairman: caseWithId.responseStruckOutChairman,
      responseStruckOutReason: caseWithId.responseStruckOutReason,
      responseRespondentAddress: {
        AddressLine1: caseWithId.responseRespondentAddressLine1,
        AddressLine2: caseWithId.responseRespondentAddressLine2,
        AddressLine3: caseWithId.responseRespondentAddressLine3,
        PostTown: caseWithId.responseRespondentAddressPostTown,
        County: caseWithId.responseRespondentAddressCounty,
        PostCode: caseWithId.responseRespondentAddressPostCode,
        Country: caseWithId.responseRespondentAddressCountry,
      },
      responseRespondentPhone1: caseWithId.responseRespondentPhone1,
      responseRespondentPhone2: caseWithId.responseRespondentPhone2,
      responseRespondentEmail: caseWithId.responseRespondentEmail,
      responseRespondentContactPreference: caseWithId.responseRespondentContactPreference,
      responseReceived: caseWithId.responseReceived,
      responseReceivedDate: caseWithId.responseReceivedDate,
      responseReceivedCount: caseWithId.responseReceivedCount,
      responseRespondentNameQuestion: caseWithId.responseRespondentNameQuestion,
      responseRespondentName: caseWithId.responseRespondentName,
      responseContinue: caseWithId.responseContinue,
      responseCounterClaim: caseWithId.responseCounterClaim,
      responseReference: caseWithId.responseReference,
      extensionRequested: caseWithId.extensionRequested,
      extensionGranted: caseWithId.extensionGranted,
      extensionDate: caseWithId.extensionDate,
      extensionResubmitted: caseWithId.extensionResubmitted,
      et3Vetting: {
        et3IsThereAnEt3Response: caseWithId.et3IsThereAnEt3Response,
        et3NoEt3Response: caseWithId.et3NoEt3Response,
        et3GeneralNotes: caseWithId.et3GeneralNotes,
        et3IsThereACompaniesHouseSearchDocument: caseWithId.et3IsThereACompaniesHouseSearchDocument,
        et3GeneralNotesCompanyHouse: caseWithId.et3GeneralNotesCompanyHouse,
        et3IsThereAnIndividualSearchDocument: caseWithId.et3IsThereAnIndividualSearchDocument,
        et3GeneralNotesIndividualInsolvency: caseWithId.et3GeneralNotesIndividualInsolvency,
        et3LegalIssue: caseWithId.et3LegalIssue,
        et3LegalIssueGiveDetails: caseWithId.et3LegalIssueGiveDetails,
        et3ContestClaimGiveDetails: caseWithId.et3ContestClaimGiveDetails,
        et3GeneralNotesLegalEntity: caseWithId.et3GeneralNotesLegalEntity,
        et3ResponseInTime: caseWithId.et3ResponseInTime,
        et3ResponseInTimeDetails: caseWithId.et3ResponseInTimeDetails,
        et3DoWeHaveRespondentsName: caseWithId.et3DoWeHaveRespondentsName,
        et3GeneralNotesRespondentName: caseWithId.et3GeneralNotesRespondentName,
        et3DoesRespondentsNameMatch: caseWithId.et3DoesRespondentsNameMatch,
        et3RespondentNameMismatchDetails: caseWithId.et3RespondentNameMismatchDetails,
        et3GeneralNotesRespondentNameMatch: caseWithId.et3GeneralNotesRespondentNameMatch,
        et3DoWeHaveRespondentsAddress: caseWithId.et3DoWeHaveRespondentsAddress,
        et3DoesRespondentsAddressMatch: caseWithId.et3DoesRespondentsAddressMatch,
        et3RespondentAddressMismatchDetails: caseWithId.et3RespondentAddressMismatchDetails,
        et3GeneralNotesRespondentAddress: caseWithId.et3GeneralNotesRespondentAddress,
        et3GeneralNotesAddressMatch: caseWithId.et3GeneralNotesAddressMatch,
        et3IsCaseListedForHearing: caseWithId.et3IsCaseListedForHearing,
        et3IsCaseListedForHearingDetails: caseWithId.et3IsCaseListedForHearingDetails,
        et3GeneralNotesCaseListed: caseWithId.et3GeneralNotesCaseListed,
        et3IsThisLocationCorrect: caseWithId.et3IsThisLocationCorrect,
        et3GeneralNotesTransferApplication: caseWithId.et3GeneralNotesTransferApplication,
        et3RegionalOffice: caseWithId.et3RegionalOffice,
        et3WhyWeShouldChangeTheOffice: caseWithId.et3WhyWeShouldChangeTheOffice,
        et3ContestClaim: caseWithId.et3ContestClaim,
        et3GeneralNotesContestClaim: caseWithId.et3GeneralNotesContestClaim,
        et3ContractClaimSection7: caseWithId.et3ContractClaimSection7,
        et3ContractClaimSection7Details: caseWithId.et3ContractClaimSection7Details,
        et3GeneralNotesContractClaimSection7: caseWithId.et3GeneralNotesContractClaimSection7,
        et3Rule26: caseWithId.et3Rule26,
        et3Rule26Details: caseWithId.et3Rule26Details,
        et3SuggestedIssues: caseWithId.et3SuggestedIssues,
        et3SuggestedIssuesStrikeOut: caseWithId.et3SuggestedIssuesStrikeOut,
        et3SuggestedIssueInterpreters: caseWithId.et3SuggestedIssueInterpreters,
        et3SuggestedIssueJurisdictional: caseWithId.et3SuggestedIssueJurisdictional,
        et3SuggestedIssueAdjustments: caseWithId.et3SuggestedIssueAdjustments,
        et3SuggestedIssueRule50: caseWithId.et3SuggestedIssueRule50,
        et3SuggestedIssueTimePoints: caseWithId.et3SuggestedIssueTimePoints,
        et3GeneralNotesRule26: caseWithId.et3GeneralNotesRule26,
        et3AdditionalInformation: caseWithId.et3AdditionalInformation,
      },
      et3VettingCompleted: caseWithId.et3VettingCompleted,
      et3ResponseIsClaimantNameCorrect: caseWithId.et3ResponseIsClaimantNameCorrect,
      et3ResponseClaimantNameCorrection: caseWithId.et3ResponseClaimantNameCorrection,
      et3ResponseRespondentCompanyNumber: caseWithId.et3ResponseRespondentCompanyNumber,
      et3ResponseRespondentEmployerType: caseWithId.et3ResponseRespondentEmployerType,
      et3ResponseRespondentPreferredTitle: caseWithId.et3ResponseRespondentPreferredTitle,
      et3ResponseRespondentContactName: caseWithId.et3ResponseRespondentContactName,
      et3ResponseDXAddress: caseWithId.et3ResponseDXAddress,
      et3ResponseContactReason: caseWithId.et3ResponseContactReason,
      et3ResponseLanguagePreference: caseWithId.et3ResponseLanguagePreference,
      et3ResponseHearingRepresentative: caseWithId.et3ResponseHearingRepresentative,
      et3ResponseHearingRespondent: caseWithId.et3ResponseHearingRespondent,
      et3ResponseEmploymentCount: caseWithId.et3ResponseEmploymentCount,
      et3ResponseMultipleSites: caseWithId.et3ResponseMultipleSites,
      et3ResponseSiteEmploymentCount: caseWithId.et3ResponseSiteEmploymentCount,
      et3ResponseAcasAgree: caseWithId.et3ResponseAcasAgree,
      et3ResponseAcasAgreeReason: caseWithId.et3ResponseAcasAgreeReason,
      et3ResponseAreDatesCorrect: caseWithId.et3ResponseAreDatesCorrect,
      et3ResponseEmploymentStartDate: DateUtils.convertCaseDateToApiDateStringYYYY_MM_DD(
        caseWithId.et3ResponseEmploymentStartDate
      ),
      et3ResponseEmploymentEndDate: DateUtils.convertCaseDateToApiDateStringYYYY_MM_DD(
        caseWithId.et3ResponseEmploymentEndDate
      ),
      et3ResponseEmploymentInformation: caseWithId.et3ResponseEmploymentInformation,
      et3ResponseContinuingEmployment: caseWithId.et3ResponseContinuingEmployment,
      et3ResponseIsJobTitleCorrect: caseWithId.et3ResponseIsJobTitleCorrect,
      et3ResponseCorrectJobTitle: caseWithId.et3ResponseCorrectJobTitle,
      et3ResponseClaimantWeeklyHours: caseWithId.et3ResponseClaimantWeeklyHours,
      et3ResponseClaimantCorrectHours: caseWithId.et3ResponseClaimantCorrectHours,
      et3ResponseEarningDetailsCorrect: caseWithId.et3ResponseEarningDetailsCorrect,
      et3ResponsePayFrequency: caseWithId.et3ResponsePayFrequency,
      et3ResponsePayBeforeTax: caseWithId.et3ResponsePayBeforeTax,
      et3ResponsePayTakehome: caseWithId.et3ResponsePayTakehome,
      et3ResponseIsNoticeCorrect: caseWithId.et3ResponseIsNoticeCorrect,
      et3ResponseCorrectNoticeDetails: caseWithId.et3ResponseCorrectNoticeDetails,
      et3ResponseIsPensionCorrect: caseWithId.et3ResponseIsPensionCorrect,
      et3ResponsePensionCorrectDetails: caseWithId.et3ResponsePensionCorrectDetails,
      et3ResponseRespondentContestClaim: caseWithId.et3ResponseRespondentContestClaim,
      et3ResponseContestClaimDocument: caseWithId.et3ResponseContestClaimDocument,
      et3ResponseContestClaimDetails: caseWithId.et3ResponseContestClaimDetails,
      et3ResponseEmployerClaim: caseWithId.et3ResponseEmployerClaim,
      et3ResponseEmployerClaimDetails: caseWithId.et3ResponseEmployerClaimDetails,
      et3ResponseRespondentSupportNeeded: caseWithId.et3ResponseRespondentSupportNeeded,
      et3ResponseRespondentSupportDetails: caseWithId.et3ResponseRespondentSupportDetails,
      contactDetailsSection: caseWithId.contactDetailsSection,
      employerDetailsSection: caseWithId.employerDetailsSection,
      conciliationAndEmployeeDetailsSection: caseWithId.conciliationAndEmployeeDetailsSection,
      payPensionBenefitDetailsSection: caseWithId.payPensionBenefitDetailsSection,
      contestClaimSection: caseWithId.contestClaimSection,
      employersContractClaimSection: caseWithId.employersContractClaimSection,
      idamId: StringUtils.isNotBlank(caseWithId.idamId) ? caseWithId.idamId : selectedRespondent.idamId,
      et3CaseDetailsLinksStatuses: caseWithId.et3CaseDetailsLinksStatuses,
      et3IsRespondentAddressCorrect: caseWithId.et3IsRespondentAddressCorrect,
      et3Status: caseWithId.et3Status ?? 'inProgress',
      et3HubLinksStatuses: caseWithId.et3HubLinksStatuses,
      et3FormWelsh: caseWithId.et3FormWelsh,
      et3Form: caseWithId.et3Form,
      claimant_work_address: {
        AddressLine1: caseWithId.claimantWorkAddressLine1,
        AddressLine2: caseWithId.claimantWorkAddressLine2,
        AddressLine3: caseWithId.claimantWorkAddressLine3,
        PostTown: caseWithId.claimantWorkAddressPostTown,
        County: caseWithId.claimantWorkAddressCounty,
        PostCode: caseWithId.claimantWorkAddressPostCode,
        Country: caseWithId.claimantWorkAddressCountry,
      },
      workAddress1: caseWithId.workAddressLine1,
      workAddress2: caseWithId.workAddressLine2,
      workAddressTown: caseWithId.workAddressTown,
      workAddressCountry: caseWithId.workAddressCountry,
      workAddressPostcode: caseWithId.workAddressPostcode,
    };
    if (
      StringUtils.isNotBlank(caseWithId.et3CompanyHouseDocumentBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3CompanyHouseDocumentUrl)
    ) {
      respondentType.et3Vetting.et3CompanyHouseDocument = {
        document_binary_url: caseWithId.et3CompanyHouseDocumentBinaryUrl,
        document_filename: caseWithId.et3CompanyHouseDocumentFileName,
        document_url: caseWithId.et3CompanyHouseDocumentUrl,
        category_id: caseWithId.et3CompanyHouseDocumentCategoryId,
        upload_timestamp: caseWithId.et3CompanyHouseDocumentUploadTimestamp,
      };
    }
    if (
      StringUtils.isNotBlank(caseWithId.et3IndividualInsolvencyDocumentBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3IndividualInsolvencyDocumentUrl)
    ) {
      respondentType.et3Vetting.et3IndividualInsolvencyDocument = {
        document_binary_url: caseWithId.et3IndividualInsolvencyDocumentBinaryUrl,
        document_filename: caseWithId.et3IndividualInsolvencyDocumentFileName,
        document_url: caseWithId.et3IndividualInsolvencyDocumentUrl,
        category_id: caseWithId.et3IndividualInsolvencyDocumentCategoryId,
        upload_timestamp: caseWithId.et3IndividualInsolvencyDocumentUploadTimestamp,
      };
    }
    if (
      StringUtils.isNotBlank(caseWithId.et3VettingDocumentBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3VettingDocumentUrl)
    ) {
      respondentType.et3Vetting.et3VettingDocument = {
        document_binary_url: caseWithId.et3VettingDocumentBinaryUrl,
        document_filename: caseWithId.et3VettingDocumentFileName,
        document_url: caseWithId.et3VettingDocumentUrl,
        category_id: caseWithId.et3VettingDocumentCategoryId,
        upload_timestamp: caseWithId.et3VettingDocumentUploadTimestamp,
      };
    }
    if (
      StringUtils.isNotBlank(caseWithId.et3ResponseEmployerClaimDocumentBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3ResponseEmployerClaimDocumentUrl)
    ) {
      respondentType.et3ResponseEmployerClaimDocument = {
        document_binary_url: caseWithId.et3ResponseEmployerClaimDocumentBinaryUrl,
        document_filename: caseWithId.et3ResponseEmployerClaimDocumentFileName,
        document_url: caseWithId.et3ResponseEmployerClaimDocumentUrl,
        category_id: caseWithId.et3ResponseEmployerClaimDocumentCategoryId,
        upload_timestamp: caseWithId.et3ResponseEmployerClaimDocumentUploadTimestamp,
      };
    }
    if (
      StringUtils.isNotBlank(caseWithId.et3ResponseRespondentSupportDocumentBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3ResponseRespondentSupportDocumentUrl)
    ) {
      respondentType.et3ResponseRespondentSupportDocument = {
        document_binary_url: caseWithId.et3ResponseRespondentSupportDocumentBinaryUrl,
        document_filename: caseWithId.et3ResponseRespondentSupportDocumentFileName,
        document_url: caseWithId.et3ResponseRespondentSupportDocumentUrl,
        category_id: caseWithId.et3ResponseRespondentSupportDocumentCategoryId,
        upload_timestamp: caseWithId.et3ResponseRespondentSupportDocumentUploadTimestamp,
      };
    }
    if (StringUtils.isNotBlank(caseWithId.et3FormBinaryUrl) && StringUtils.isNotBlank(caseWithId.et3FormUrl)) {
      respondentType.et3Form = {
        document_binary_url: caseWithId.et3FormBinaryUrl,
        document_filename: caseWithId.et3FormFileName,
        document_url: caseWithId.et3FormUrl,
        category_id: caseWithId.et3FormCategoryId,
        upload_timestamp: caseWithId.et3FormUploadTimestamp,
      };
    }
    if (
      StringUtils.isNotBlank(caseWithId.et3FormWelshBinaryUrl) &&
      StringUtils.isNotBlank(caseWithId.et3FormWelshUrl)
    ) {
      respondentType.et3FormWelsh = {
        document_binary_url: caseWithId.et3FormWelshBinaryUrl,
        document_filename: caseWithId.et3FormWelshFileName,
        document_url: caseWithId.et3FormWelshUrl,
        category_id: caseWithId.et3FormWelshCategoryId,
        upload_timestamp: caseWithId.et3FormWelshUploadTimestamp,
      };
    }
    respondentType.idamId = selectedRespondent.idamId;
    return respondentType;
  }

  public static setSelectedRespondentDataToCaseWithId(req: AppRequest): void {
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];
    if (ObjectUtils.isEmpty(selectedRespondent)) {
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.RESPONDENT_NOT_FOUND_BY_RESPONDENT_INDEX,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      logger.error(LoggerConstants.ERROR_RESPONDENT_NOT_FOUND_BY_RESPONDENT_INDEX);
      return;
    }
    req.session.userCase.responseStatus = selectedRespondent.responseStatus;
    req.session.userCase.responseToClaim = selectedRespondent.responseToClaim;
    req.session.userCase.rejectionReason = selectedRespondent.rejectionReason;
    req.session.userCase.rejectionReasonOther = selectedRespondent.rejectionReasonOther;
    req.session.userCase.responseOutOfTime = selectedRespondent.responseOutOfTime;
    req.session.userCase.responseNotOnPrescribedForm = selectedRespondent.responseNotOnPrescribedForm;
    req.session.userCase.responseRequiredInfoAbsent = selectedRespondent.responseRequiredInfoAbsent;
    req.session.userCase.responseNotes = selectedRespondent.responseNotes;
    req.session.userCase.responseReferredToJudge = selectedRespondent.responseReferredToJudge;
    req.session.userCase.responseReturnedFromJudge = selectedRespondent.responseReturnedFromJudge;
    req.session.userCase.respondentName = selectedRespondent.respondentName;
    req.session.userCase.respondentType = selectedRespondent.respondentType;
    req.session.userCase.respondentOrganisation = selectedRespondent.respondentOrganisation;
    req.session.userCase.respondentFirstName = selectedRespondent.respondentFirstName;
    req.session.userCase.respondentLastName = selectedRespondent.respondentLastName;
    req.session.userCase.respondentACASQuestion = selectedRespondent.respondentACASQuestion;
    req.session.userCase.respondentACAS = selectedRespondent.respondentACAS;
    req.session.userCase.respondentACASNo = selectedRespondent.respondentACASNo;
    req.session.userCase.respondentAddress = selectedRespondent.respondentAddress;
    req.session.userCase.respondentAddressLine1 = selectedRespondent.respondentAddressLine1;
    req.session.userCase.respondentAddressLine2 = selectedRespondent.respondentAddressLine2;
    req.session.userCase.respondentAddressLine3 = selectedRespondent.respondentAddressLine3;
    req.session.userCase.respondentAddressPostTown = selectedRespondent.respondentAddressPostTown;
    req.session.userCase.respondentAddressCounty = selectedRespondent.respondentAddressCounty;
    req.session.userCase.respondentAddressPostCode = selectedRespondent.respondentAddressPostCode;
    req.session.userCase.respondentAddressCountry = selectedRespondent.respondentAddressCountry;
    req.session.userCase.respondentPhone1 = selectedRespondent.respondentPhone1;
    req.session.userCase.respondentPhone2 = selectedRespondent.respondentPhone2;
    req.session.userCase.respondentEmail = selectedRespondent.respondentEmail;
    req.session.userCase.respondentContactPreference = selectedRespondent.respondentContactPreference;
    req.session.userCase.responseStruckOut = selectedRespondent.responseStruckOut;
    req.session.userCase.responseStruckOutDate = selectedRespondent.responseStruckOutDate;
    req.session.userCase.responseStruckOutChairman = selectedRespondent.responseStruckOutChairman;
    req.session.userCase.responseStruckOutReason = selectedRespondent.responseStruckOutReason;
    req.session.userCase.responseRespondentAddress = selectedRespondent.responseRespondentAddress;
    req.session.userCase.responseRespondentAddressLine1 = selectedRespondent.responseRespondentAddressLine1;
    req.session.userCase.responseRespondentAddressLine2 = selectedRespondent.responseRespondentAddressLine2;
    req.session.userCase.responseRespondentAddressLine3 = selectedRespondent.responseRespondentAddressLine3;
    req.session.userCase.responseRespondentAddressPostTown = selectedRespondent.responseRespondentAddressPostTown;
    req.session.userCase.responseRespondentAddressCounty = selectedRespondent.responseRespondentAddressCounty;
    req.session.userCase.responseRespondentAddressPostCode = selectedRespondent.responseRespondentAddressPostCode;
    req.session.userCase.responseRespondentAddressCountry = selectedRespondent.responseRespondentAddressCountry;
    req.session.userCase.responseRespondentPhone1 = selectedRespondent.responseRespondentPhone1;
    req.session.userCase.responseRespondentPhone2 = selectedRespondent.responseRespondentPhone2;
    req.session.userCase.responseRespondentEmail = selectedRespondent.responseRespondentEmail;
    req.session.userCase.responseRespondentContactPreference = selectedRespondent.responseRespondentContactPreference;
    req.session.userCase.responseReceived = selectedRespondent.responseReceived;
    req.session.userCase.responseReceivedDate = selectedRespondent.responseReceivedDate;
    req.session.userCase.responseReceivedCount = selectedRespondent.responseReceivedCount;
    req.session.userCase.responseRespondentNameQuestion = selectedRespondent.responseRespondentNameQuestion;
    req.session.userCase.responseRespondentName = selectedRespondent.responseRespondentName;
    req.session.userCase.responseContinue = selectedRespondent.responseContinue;
    req.session.userCase.responseCounterClaim = selectedRespondent.responseCounterClaim;
    req.session.userCase.responseReference = selectedRespondent.responseReference;
    req.session.userCase.extensionRequested = selectedRespondent.extensionRequested;
    req.session.userCase.extensionGranted = selectedRespondent.extensionGranted;
    req.session.userCase.extensionDate = selectedRespondent.extensionDate;
    req.session.userCase.extensionResubmitted = selectedRespondent.extensionResubmitted;
    req.session.userCase.et3Vetting = selectedRespondent.et3Vetting;
    req.session.userCase.et3IsThereAnEt3Response = selectedRespondent.et3IsThereAnEt3Response;
    req.session.userCase.et3NoEt3Response = selectedRespondent.et3NoEt3Response;
    req.session.userCase.et3GeneralNotes = selectedRespondent.et3GeneralNotes;
    req.session.userCase.et3IsThereACompaniesHouseSearchDocument =
      selectedRespondent.et3IsThereACompaniesHouseSearchDocument;
    req.session.userCase.et3GeneralNotesCompanyHouse = selectedRespondent.et3GeneralNotesCompanyHouse;
    req.session.userCase.et3IsThereAnIndividualSearchDocument = selectedRespondent.et3IsThereAnIndividualSearchDocument;
    req.session.userCase.et3GeneralNotesIndividualInsolvency = selectedRespondent.et3GeneralNotesIndividualInsolvency;
    req.session.userCase.et3LegalIssue = selectedRespondent.et3LegalIssue;
    req.session.userCase.et3LegalIssueGiveDetails = selectedRespondent.et3LegalIssueGiveDetails;
    req.session.userCase.et3ContestClaimGiveDetails = selectedRespondent.et3ContestClaimGiveDetails;
    req.session.userCase.et3GeneralNotesLegalEntity = selectedRespondent.et3GeneralNotesLegalEntity;
    req.session.userCase.et3ResponseInTime = selectedRespondent.et3ResponseInTime;
    req.session.userCase.et3ResponseInTimeDetails = selectedRespondent.et3ResponseInTimeDetails;
    req.session.userCase.et3DoWeHaveRespondentsName = selectedRespondent.et3DoWeHaveRespondentsName;
    req.session.userCase.et3GeneralNotesRespondentName = selectedRespondent.et3GeneralNotesRespondentName;
    req.session.userCase.et3DoesRespondentsNameMatch = selectedRespondent.et3DoesRespondentsNameMatch;
    req.session.userCase.et3RespondentNameMismatchDetails = selectedRespondent.et3RespondentNameMismatchDetails;
    req.session.userCase.et3GeneralNotesRespondentNameMatch = selectedRespondent.et3GeneralNotesRespondentNameMatch;
    req.session.userCase.et3DoWeHaveRespondentsAddress = selectedRespondent.et3DoWeHaveRespondentsAddress;
    req.session.userCase.et3DoesRespondentsAddressMatch = selectedRespondent.et3DoesRespondentsAddressMatch;
    req.session.userCase.et3RespondentAddressMismatchDetails = selectedRespondent.et3RespondentAddressMismatchDetails;
    req.session.userCase.et3GeneralNotesRespondentAddress = selectedRespondent.et3GeneralNotesRespondentAddress;
    req.session.userCase.et3GeneralNotesAddressMatch = selectedRespondent.et3GeneralNotesAddressMatch;
    req.session.userCase.et3IsCaseListedForHearing = selectedRespondent.et3IsCaseListedForHearing;
    req.session.userCase.et3IsCaseListedForHearingDetails = selectedRespondent.et3IsCaseListedForHearingDetails;
    req.session.userCase.et3GeneralNotesCaseListed = selectedRespondent.et3GeneralNotesCaseListed;
    req.session.userCase.et3IsThisLocationCorrect = selectedRespondent.et3IsThisLocationCorrect;
    req.session.userCase.et3GeneralNotesTransferApplication = selectedRespondent.et3GeneralNotesTransferApplication;
    req.session.userCase.et3RegionalOffice = selectedRespondent.et3RegionalOffice;
    req.session.userCase.et3WhyWeShouldChangeTheOffice = selectedRespondent.et3WhyWeShouldChangeTheOffice;
    req.session.userCase.et3ContestClaim = selectedRespondent.et3ContestClaim;
    req.session.userCase.et3GeneralNotesContestClaim = selectedRespondent.et3GeneralNotesContestClaim;
    req.session.userCase.et3ContractClaimSection7 = selectedRespondent.et3ContractClaimSection7;
    req.session.userCase.et3ContractClaimSection7Details = selectedRespondent.et3ContractClaimSection7Details;
    req.session.userCase.et3GeneralNotesContractClaimSection7 = selectedRespondent.et3GeneralNotesContractClaimSection7;
    req.session.userCase.et3Rule26 = selectedRespondent.et3Rule26;
    req.session.userCase.et3Rule26Details = selectedRespondent.et3Rule26Details;
    req.session.userCase.et3SuggestedIssues = selectedRespondent.et3SuggestedIssues;
    req.session.userCase.et3SuggestedIssuesStrikeOut = selectedRespondent.et3SuggestedIssuesStrikeOut;
    req.session.userCase.et3SuggestedIssueInterpreters = selectedRespondent.et3SuggestedIssueInterpreters;
    req.session.userCase.et3SuggestedIssueJurisdictional = selectedRespondent.et3SuggestedIssueJurisdictional;
    req.session.userCase.et3SuggestedIssueAdjustments = selectedRespondent.et3SuggestedIssueAdjustments;
    req.session.userCase.et3SuggestedIssueRule50 = selectedRespondent.et3SuggestedIssueRule50;
    req.session.userCase.et3SuggestedIssueTimePoints = selectedRespondent.et3SuggestedIssueTimePoints;
    req.session.userCase.et3GeneralNotesRule26 = selectedRespondent.et3GeneralNotesRule26;
    req.session.userCase.et3AdditionalInformation = selectedRespondent.et3AdditionalInformation;
    req.session.userCase.et3VettingCompleted = selectedRespondent.et3VettingCompleted;
    req.session.userCase.et3ResponseIsClaimantNameCorrect = selectedRespondent.et3ResponseIsClaimantNameCorrect;
    req.session.userCase.et3ResponseClaimantNameCorrection = selectedRespondent.et3ResponseClaimantNameCorrection;
    req.session.userCase.et3ResponseRespondentCompanyNumber = selectedRespondent.et3ResponseRespondentCompanyNumber;
    req.session.userCase.et3ResponseRespondentEmployerType = selectedRespondent.et3ResponseRespondentEmployerType;
    req.session.userCase.et3ResponseRespondentPreferredTitle = selectedRespondent.et3ResponseRespondentPreferredTitle;
    req.session.userCase.et3ResponseRespondentContactName = selectedRespondent.et3ResponseRespondentContactName;
    req.session.userCase.et3ResponseDXAddress = selectedRespondent.et3ResponseDXAddress;
    req.session.userCase.et3ResponseContactReason = selectedRespondent.et3ResponseContactReason;
    req.session.userCase.et3ResponseLanguagePreference = selectedRespondent.et3ResponseLanguagePreference;
    req.session.userCase.et3ResponseHearingRepresentative = selectedRespondent.et3ResponseHearingRepresentative;
    req.session.userCase.et3ResponseHearingRespondent = selectedRespondent.et3ResponseHearingRespondent;
    req.session.userCase.et3ResponseEmploymentCount = selectedRespondent.et3ResponseEmploymentCount;
    req.session.userCase.et3ResponseMultipleSites = selectedRespondent.et3ResponseMultipleSites;
    req.session.userCase.et3ResponseSiteEmploymentCount = selectedRespondent.et3ResponseSiteEmploymentCount;
    req.session.userCase.et3ResponseAcasAgree = selectedRespondent.et3ResponseAcasAgree;
    req.session.userCase.et3ResponseAcasAgreeReason = selectedRespondent.et3ResponseAcasAgreeReason;
    req.session.userCase.et3ResponseAreDatesCorrect = selectedRespondent.et3ResponseAreDatesCorrect;
    req.session.userCase.et3ResponseEmploymentStartDate = selectedRespondent.et3ResponseEmploymentStartDate;
    req.session.userCase.et3ResponseEmploymentEndDate = selectedRespondent.et3ResponseEmploymentEndDate;
    req.session.userCase.et3ResponseEmploymentInformation = selectedRespondent.et3ResponseEmploymentInformation;
    req.session.userCase.et3ResponseContinuingEmployment = selectedRespondent.et3ResponseContinuingEmployment;
    req.session.userCase.et3ResponseIsJobTitleCorrect = selectedRespondent.et3ResponseIsJobTitleCorrect;
    req.session.userCase.et3ResponseCorrectJobTitle = selectedRespondent.et3ResponseCorrectJobTitle;
    req.session.userCase.et3ResponseClaimantWeeklyHours = selectedRespondent.et3ResponseClaimantWeeklyHours;
    req.session.userCase.et3ResponseClaimantCorrectHours = selectedRespondent.et3ResponseClaimantCorrectHours;
    req.session.userCase.et3ResponseEarningDetailsCorrect = selectedRespondent.et3ResponseEarningDetailsCorrect;
    req.session.userCase.et3ResponsePayFrequency = selectedRespondent.et3ResponsePayFrequency;
    req.session.userCase.et3ResponsePayBeforeTax = selectedRespondent.et3ResponsePayBeforeTax;
    req.session.userCase.et3ResponsePayTakehome = selectedRespondent.et3ResponsePayTakehome;
    req.session.userCase.et3ResponseIsNoticeCorrect = selectedRespondent.et3ResponseIsNoticeCorrect;
    req.session.userCase.et3ResponseCorrectNoticeDetails = selectedRespondent.et3ResponseCorrectNoticeDetails;
    req.session.userCase.et3ResponseIsPensionCorrect = selectedRespondent.et3ResponseIsPensionCorrect;
    req.session.userCase.et3ResponsePensionCorrectDetails = selectedRespondent.et3ResponsePensionCorrectDetails;
    req.session.userCase.et3ResponseRespondentContestClaim = selectedRespondent.et3ResponseRespondentContestClaim;
    req.session.userCase.et3ResponseContestClaimDocument = selectedRespondent.et3ResponseContestClaimDocument;
    req.session.userCase.et3ResponseContestClaimDetails = selectedRespondent.et3ResponseContestClaimDetails;
    req.session.userCase.et3ResponseEmployerClaim = selectedRespondent.et3ResponseEmployerClaim;
    req.session.userCase.et3ResponseEmployerClaimDetails = selectedRespondent.et3ResponseEmployerClaimDetails;
    req.session.userCase.et3ResponseRespondentSupportNeeded = selectedRespondent.et3ResponseRespondentSupportNeeded;
    req.session.userCase.et3ResponseRespondentSupportDetails = selectedRespondent.et3ResponseRespondentSupportDetails;
    req.session.userCase.contactDetailsSection = selectedRespondent.contactDetailsSection;
    req.session.userCase.employerDetailsSection = selectedRespondent.employerDetailsSection;
    req.session.userCase.conciliationAndEmployeeDetailsSection =
      selectedRespondent.conciliationAndEmployeeDetailsSection;
    req.session.userCase.payPensionBenefitDetailsSection = selectedRespondent.payPensionBenefitDetailsSection;
    req.session.userCase.contestClaimSection = selectedRespondent.contestClaimSection;
    req.session.userCase.employersContractClaimSection = selectedRespondent.employersContractClaimSection;
    req.session.userCase.idamId = selectedRespondent.idamId;
    req.session.userCase.et3CaseDetailsLinksStatuses = selectedRespondent.et3CaseDetailsLinksStatuses;
    req.session.userCase.et3IsRespondentAddressCorrect = selectedRespondent.et3IsRespondentAddressCorrect;
    req.session.userCase.et3Status = selectedRespondent.et3Status;
    req.session.userCase.et3HubLinksStatuses = selectedRespondent.et3HubLinksStatuses;
    req.session.userCase.claimantWorkAddress = selectedRespondent.claimantWorkAddress;
    req.session.userCase.claimantWorkAddressLine1 = selectedRespondent.claimantWorkAddressLine1;
    req.session.userCase.claimantWorkAddressLine2 = selectedRespondent.claimantWorkAddressLine2;
    req.session.userCase.claimantWorkAddressLine3 = selectedRespondent.claimantWorkAddressLine3;
    req.session.userCase.claimantWorkAddressPostTown = selectedRespondent.claimantWorkAddressPostTown;
    req.session.userCase.claimantWorkAddressCounty = selectedRespondent.claimantWorkAddressCounty;
    req.session.userCase.claimantWorkAddressPostCode = selectedRespondent.claimantWorkAddressPostCode;
    req.session.userCase.claimantWorkAddressCountry = selectedRespondent.claimantWorkAddressCountry;
    req.session.userCase.workAddressLine1 = selectedRespondent.workAddressLine1;
    req.session.userCase.workAddressLine2 = selectedRespondent.workAddressLine2;
    req.session.userCase.workAddressTown = selectedRespondent.workAddressTown;
    req.session.userCase.workAddressCountry = selectedRespondent.workAddressCountry;
    req.session.userCase.workAddressPostcode = selectedRespondent.workAddressPostcode;
    req.session.userCase.et3CompanyHouseDocumentBinaryUrl = selectedRespondent.et3CompanyHouseDocumentBinaryUrl;
    req.session.userCase.et3CompanyHouseDocumentUrl = selectedRespondent.et3CompanyHouseDocumentUrl;
    req.session.userCase.et3CompanyHouseDocumentBinaryUrl = selectedRespondent.et3CompanyHouseDocumentBinaryUrl;
    req.session.userCase.et3CompanyHouseDocumentFileName = selectedRespondent.et3CompanyHouseDocumentFileName;
    req.session.userCase.et3CompanyHouseDocumentUrl = selectedRespondent.et3CompanyHouseDocumentUrl;
    req.session.userCase.et3CompanyHouseDocumentCategoryId = selectedRespondent.et3CompanyHouseDocumentCategoryId;
    req.session.userCase.et3CompanyHouseDocumentUploadTimestamp =
      selectedRespondent.et3CompanyHouseDocumentUploadTimestamp;
    req.session.userCase.et3IndividualInsolvencyDocumentBinaryUrl =
      selectedRespondent.et3IndividualInsolvencyDocumentBinaryUrl;
    req.session.userCase.et3IndividualInsolvencyDocumentUrl = selectedRespondent.et3IndividualInsolvencyDocumentUrl;
    req.session.userCase.et3IndividualInsolvencyDocumentBinaryUrl =
      selectedRespondent.et3IndividualInsolvencyDocumentBinaryUrl;
    req.session.userCase.et3IndividualInsolvencyDocumentFileName =
      selectedRespondent.et3IndividualInsolvencyDocumentFileName;
    req.session.userCase.et3IndividualInsolvencyDocumentUrl = selectedRespondent.et3IndividualInsolvencyDocumentUrl;
    req.session.userCase.et3IndividualInsolvencyDocumentCategoryId =
      selectedRespondent.et3IndividualInsolvencyDocumentCategoryId;
    req.session.userCase.et3IndividualInsolvencyDocumentUploadTimestamp =
      selectedRespondent.et3IndividualInsolvencyDocumentUploadTimestamp;
    req.session.userCase.et3VettingDocumentBinaryUrl = selectedRespondent.et3VettingDocumentBinaryUrl;
    req.session.userCase.et3VettingDocumentUrl = selectedRespondent.et3VettingDocumentUrl;
    req.session.userCase.et3VettingDocumentBinaryUrl = selectedRespondent.et3VettingDocumentBinaryUrl;
    req.session.userCase.et3VettingDocumentFileName = selectedRespondent.et3VettingDocumentFileName;
    req.session.userCase.et3VettingDocumentUrl = selectedRespondent.et3VettingDocumentUrl;
    req.session.userCase.et3VettingDocumentCategoryId = selectedRespondent.et3VettingDocumentCategoryId;
    req.session.userCase.et3VettingDocumentUploadTimestamp = selectedRespondent.et3VettingDocumentUploadTimestamp;
    // Employer Claim Document Section
    req.session.userCase.et3ResponseEmployerClaimDocument = selectedRespondent.et3ResponseEmployerClaimDocument;

    req.session.userCase.et3ResponseEmployerClaimDocumentUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_url;
    req.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_binary_url;
    req.session.userCase.et3ResponseEmployerClaimDocumentFileName =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_filename;
    req.session.userCase.et3ResponseEmployerClaimDocumentUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_url;
    req.session.userCase.et3ResponseEmployerClaimDocumentCategoryId =
      selectedRespondent.et3ResponseEmployerClaimDocument?.category_id;
    req.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp =
      selectedRespondent.et3ResponseEmployerClaimDocument?.upload_timestamp;

    selectedRespondent.et3ResponseEmployerClaimDocumentUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_url;
    selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_binary_url;
    selectedRespondent.et3ResponseEmployerClaimDocumentFileName =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_filename;
    selectedRespondent.et3ResponseEmployerClaimDocumentUrl =
      selectedRespondent.et3ResponseEmployerClaimDocument?.document_url;
    selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId =
      selectedRespondent.et3ResponseEmployerClaimDocument?.category_id;
    selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp =
      selectedRespondent.et3ResponseEmployerClaimDocument?.upload_timestamp;
    // End Of Employer Claim Document Section
    req.session.userCase.et3ResponseRespondentSupportDocumentBinaryUrl =
      selectedRespondent.et3ResponseRespondentSupportDocumentBinaryUrl;
    req.session.userCase.et3ResponseRespondentSupportDocumentUrl =
      selectedRespondent.et3ResponseRespondentSupportDocumentUrl;

    req.session.userCase.et3ResponseRespondentSupportDocumentBinaryUrl =
      selectedRespondent.et3ResponseRespondentSupportDocumentBinaryUrl;
    req.session.userCase.et3ResponseRespondentSupportDocumentFileName =
      selectedRespondent.et3ResponseRespondentSupportDocumentFileName;
    req.session.userCase.et3ResponseRespondentSupportDocumentUrl =
      selectedRespondent.et3ResponseRespondentSupportDocumentUrl;
    req.session.userCase.et3ResponseRespondentSupportDocumentCategoryId =
      selectedRespondent.et3ResponseRespondentSupportDocumentCategoryId;
    req.session.userCase.et3ResponseRespondentSupportDocumentUploadTimestamp =
      selectedRespondent.et3ResponseRespondentSupportDocumentUploadTimestamp;

    req.session.userCase.et3FormBinaryUrl = selectedRespondent.et3FormBinaryUrl;
    req.session.userCase.et3FormFileName = selectedRespondent.et3FormFileName;
    req.session.userCase.et3FormUrl = selectedRespondent.et3FormUrl;
    req.session.userCase.et3FormCategoryId = selectedRespondent.et3FormCategoryId;
    req.session.userCase.et3FormUploadTimestamp = selectedRespondent.et3FormUploadTimestamp;
    req.session.userCase.idamId = selectedRespondent.idamId;
  }

  public static getRespondentResponseDeadline(req: AppRequest): string {
    if (StringUtils.isNotBlank(req.session.userCase?.respondentResponseDeadline)) {
      return req.session.userCase.respondentResponseDeadline;
    }
    if (StringUtils.isNotBlank(req.session.userCase?.preAcceptCase?.dateAccepted)) {
      return DateUtils.addStringDate28Days(req.session.userCase?.preAcceptCase?.dateAccepted);
    }
  }
}
