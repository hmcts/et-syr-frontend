import { ET3RequestModel } from '../definitions/ET3RequestModel';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { RespondentType } from '../definitions/complexTypes/respondent';
import { ServiceErrors } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class ET3DataModelUtil {
  public static convertCaseWithIdToET3Request(
    caseWithId: CaseWithId,
    idamId: string,
    requestType: string,
    caseDetailsLinksSectionId: string,
    caseDetailsLinksSectionStatus: string,
    responseHubLinksSectionId: string,
    responseHubLinksSectionStatus: string
  ): ET3RequestModel {
    if (StringUtils.isBlank(idamId)) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_IDAM_ID_NOT_FOUND);
    }
    if (StringUtils.isBlank(requestType)) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_REQUEST_TYPE_NOT_FOUND);
    }
    let selectedRespondent: RespondentET3Model;
    for (const respondent of caseWithId.respondents) {
      if (respondent.idamId === idamId) {
        selectedRespondent = respondent;
        break;
      }
    }
    if (!selectedRespondent) {
      throw new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_RESPONDENT_NOT_FOUND);
    }
    return {
      caseSubmissionReference: caseWithId.id,
      caseTypeId: caseWithId.caseTypeId,
      requestType,
      caseDetailsLinksSectionId,
      caseDetailsLinksSectionStatus,
      responseHubLinksSectionId,
      responseHubLinksSectionStatus,
      respondent: this.convertSelectedRespondentToRespondentType(caseWithId, selectedRespondent),
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
      et3ResponseEmploymentStartDate: caseWithId.et3ResponseEmploymentStartDate,
      et3ResponseEmploymentEndDate: caseWithId.et3ResponseEmploymentEndDate,
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
    respondentType.idamId = selectedRespondent.idamId;
    return respondentType;
  }
}
