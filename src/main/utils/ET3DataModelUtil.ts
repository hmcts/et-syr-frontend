import { ET3RequestModel } from '../definitions/ET3RequestModel';
import { CaseWithId, Respondent } from '../definitions/case';
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
    let selectedRespondent: Respondent;
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
      respondent: this.convertSelectedRespondentToRespondentType(selectedRespondent),
    };
  }

  public static convertSelectedRespondentToRespondentType(respondent: Respondent): RespondentType {
    return {
      response_status: respondent.responseStatus,
      responseToClaim: respondent.responseToClaim,
      rejection_reason: respondent.rejectionReason,
      rejection_reason_other: respondent.rejectionReasonOther,
      responseOutOfTime: respondent.responseOutOfTime,
      responseNotOnPrescribedForm: respondent.responseNotOnPrescribedForm,
      responseRequiredInfoAbsent: respondent.responseRequiredInfoAbsent,
      responseNotes: respondent.responseNotes,
      response_referred_to_judge: respondent.responseReferredToJudge,
      response_returned_from_judge: respondent.responseReturnedFromJudge,
      respondent_name: respondent.respondentName,
      respondentType: respondent.respondentType,
      respondentOrganisation: respondent.respondentOrganisation,
      respondentFirstName: respondent.respondentFirstName,
      respondentLastName: respondent.respondentLastName,
      respondent_ACAS_question: respondent.respondentACASQuestion,
      respondent_ACAS: respondent.respondentACAS,
      respondent_ACAS_no: respondent.respondentACASNo,
      respondent_address: respondent.respondentAddress,
      respondent_phone1: respondent.respondentPhone1,
      respondent_phone2: respondent.respondentPhone2,
      respondent_email: respondent.respondentEmail,
      respondent_contact_preference: respondent.respondentContactPreference,
      responseStruckOut: respondent.responseStruckOut,
      responseStruckOutDate: respondent.responseStruckOutDate,
      responseStruckOutChairman: respondent.responseStruckOutChairman,
      responseStruckOutReason: respondent.responseStruckOutReason,
      responseRespondentAddress: respondent.responseRespondentAddress,
      responseRespondentPhone1: respondent.responseRespondentPhone1,
      responseRespondentPhone2: respondent.responseRespondentPhone2,
      responseRespondentEmail: respondent.responseRespondentEmail,
      responseRespondentContactPreference: respondent.responseRespondentContactPreference,
      responseReceived: respondent.responseReceived,
      responseReceivedDate: respondent.responseReceivedDate,
      responseReceivedCount: respondent.responseReceivedCount,
      responseRespondentNameQuestion: respondent.responseRespondentNameQuestion,
      responseRespondentName: respondent.responseRespondentName,
      responseContinue: respondent.responseContinue,
      responseCounterClaim: respondent.responseCounterClaim,
      responseReference: respondent.responseReference,
      extensionRequested: respondent.extensionRequested,
      extensionGranted: respondent.extensionGranted,
      extensionDate: respondent.extensionDate,
      extensionResubmitted: respondent.extensionResubmitted,
      et3Vetting: respondent.et3Vetting,
      et3VettingCompleted: respondent.et3VettingCompleted,
      et3ResponseIsClaimantNameCorrect: respondent.et3ResponseIsClaimantNameCorrect,
      et3ResponseClaimantNameCorrection: respondent.et3ResponseClaimantNameCorrection,
      et3ResponseRespondentCompanyNumber: respondent.et3ResponseRespondentCompanyNumber,
      et3ResponseRespondentEmployerType: respondent.et3ResponseRespondentEmployerType,
      et3ResponseRespondentPreferredTitle: respondent.et3ResponseRespondentPreferredTitle,
      et3ResponseRespondentContactName: respondent.et3ResponseRespondentContactName,
      et3ResponseDXAddress: respondent.et3ResponseDXAddress,
      et3ResponseContactReason: respondent.et3ResponseContactReason,
      et3ResponseHearingRepresentative: respondent.et3ResponseHearingRepresentative,
      et3ResponseHearingRespondent: respondent.et3ResponseHearingRespondent,
      et3ResponseEmploymentCount: respondent.et3ResponseEmploymentCount,
      et3ResponseMultipleSites: respondent.et3ResponseMultipleSites,
      et3ResponseSiteEmploymentCount: respondent.et3ResponseSiteEmploymentCount,
      et3ResponseAcasAgree: respondent.et3ResponseAcasAgree,
      et3ResponseAcasAgreeReason: respondent.et3ResponseAcasAgreeReason,
      et3ResponseAreDatesCorrect: respondent.et3ResponseAreDatesCorrect,
      et3ResponseEmploymentStartDate: respondent.et3ResponseEmploymentStartDate,
      et3ResponseEmploymentEndDate: respondent.et3ResponseEmploymentEndDate,
      et3ResponseEmploymentInformation: respondent.et3ResponseEmploymentInformation,
      et3ResponseContinuingEmployment: respondent.et3ResponseContinuingEmployment,
      et3ResponseIsJobTitleCorrect: respondent.et3ResponseIsJobTitleCorrect,
      et3ResponseCorrectJobTitle: respondent.et3ResponseCorrectJobTitle,
      et3ResponseClaimantWeeklyHours: respondent.et3ResponseClaimantWeeklyHours,
      et3ResponseClaimantCorrectHours: respondent.et3ResponseClaimantCorrectHours,
      et3ResponseEarningDetailsCorrect: respondent.et3ResponseEarningDetailsCorrect,
      et3ResponsePayFrequency: respondent.et3ResponsePayFrequency,
      et3ResponsePayBeforeTax: respondent.et3ResponsePayBeforeTax,
      et3ResponsePayTakehome: respondent.et3ResponsePayTakehome,
      et3ResponseIsNoticeCorrect: respondent.et3ResponseIsNoticeCorrect,
      et3ResponseCorrectNoticeDetails: respondent.et3ResponseCorrectNoticeDetails,
      et3ResponseIsPensionCorrect: respondent.et3ResponseIsPensionCorrect,
      et3ResponsePensionCorrectDetails: respondent.et3ResponsePensionCorrectDetails,
      et3ResponseRespondentContestClaim: respondent.et3ResponseRespondentContestClaim,
      et3ResponseContestClaimDocument: respondent.et3ResponseContestClaimDocument,
      et3ResponseContestClaimDetails: respondent.et3ResponseContestClaimDetails,
      et3ResponseEmployerClaim: respondent.et3ResponseEmployerClaim,
      et3ResponseEmployerClaimDetails: respondent.et3ResponseEmployerClaimDetails,
      et3ResponseEmployerClaimDocument: respondent.et3ResponseEmployerClaimDocument,
      et3ResponseRespondentSupportNeeded: respondent.et3ResponseRespondentSupportNeeded,
      et3ResponseRespondentSupportDetails: respondent.et3ResponseRespondentSupportDetails,
      et3ResponseRespondentSupportDocument: respondent.et3ResponseRespondentSupportDocument,
      et3Form: respondent.et3Form,
      personalDetailsSection: respondent.personalDetailsSection,
      employmentDetailsSection: respondent.employmentDetailsSection,
      claimDetailsSection: respondent.claimDetailsSection,
      idamId: respondent.idamId,
      et3CaseDetailsLinksStatuses: respondent.et3CaseDetailsLinksStatuses,
      et3HubLinksStatuses: respondent.et3HubLinksStatuses,
      claimant_work_address: respondent.claimantWorkAddress,
      workAddress1: respondent.workAddress1,
      workAddress2: respondent.workAddress2,
      workAddressTown: respondent.workAddressTown,
      workAddressCountry: respondent.workAddressCountry,
      workAddressPostcode: respondent.workAddressPostcode,
    };
  }
}
