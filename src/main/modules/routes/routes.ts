import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';
// eslint-disable-next-line import/no-named-as-default
import rateLimit from 'express-rate-limit';
import multer, { FileFilterCallback } from 'multer';

import AcasEarlyConciliationCertificateController from '../../controllers/AcasEarlyConciliationCertificateController';
import ApplicationDetailsController from '../../controllers/ApplicationDetailsController';
import ApplicationSubmittedController from '../../controllers/ApplicationSubmittedController';
import AppointLegalRepController from '../../controllers/AppointLegalRepController';
import AttachmentController from '../../controllers/AttachmentController';
import CaseDetailsController from '../../controllers/CaseDetailsController';
import CaseListCheckController from '../../controllers/CaseListCheckController';
import CaseListController from '../../controllers/CaseListController';
import CaseNumberCheckController from '../../controllers/CaseNumberCheckController';
import ChangeDetailsController from '../../controllers/ChangeDetailsController';
import ChangeLegalRepresentativeController from '../../controllers/ChangeLegalRepresentativeController';
import CheckYourAnswersContactDetailsController from '../../controllers/CheckYourAnswersContactDetailsController';
import CheckYourAnswersContestClaimController from '../../controllers/CheckYourAnswersContestClaimController';
import CheckYourAnswersET3Controller from '../../controllers/CheckYourAnswersET3Controller';
import CheckYourAnswersEarlyConciliationAndEmployeeDetailsController from '../../controllers/CheckYourAnswersEarlyConciliationAndEmployeeDetailsController';
import CheckYourAnswersEmployersContractClaimController from '../../controllers/CheckYourAnswersEmployersContractClaimController';
import CheckYourAnswersHearingPreferencesController from '../../controllers/CheckYourAnswersHearingPreferencesController';
import CheckYourAnswersPayPensionAndBenefitsController from '../../controllers/CheckYourAnswersPayPensionAndBenefitsController';
import ChecklistController from '../../controllers/ChecklistController';
import ClaimantAverageWeeklyWorkHoursController from '../../controllers/ClaimantAverageWeeklyWorkHoursController';
import ClaimantContactDetailsController from '../../controllers/ClaimantContactDetailsController';
import ClaimantET1FormController from '../../controllers/ClaimantET1FormController';
import ClaimantEmploymentDatesController from '../../controllers/ClaimantEmploymentDatesController';
import ClaimantEmploymentDatesEnterController from '../../controllers/ClaimantEmploymentDatesEnterController';
import ClaimantJobTitleController from '../../controllers/ClaimantJobTitleController';
import ClaimantNoticePeriodController from '../../controllers/ClaimantNoticePeriodController';
import ClaimantPayDetailsController from '../../controllers/ClaimantPayDetailsController';
import ClaimantPayDetailsEnterController from '../../controllers/ClaimantPayDetailsEnterController';
import ClaimantPensionAndBenefitsController from '../../controllers/ClaimantPensionAndBenefitsController';
import ClaimantsApplicationsController from '../../controllers/ClaimantsApplicationsController';
import ContactTribunalCYAController from '../../controllers/ContactTribunalCYAController';
import ContactTribunalCYAOfflineController from '../../controllers/ContactTribunalCYAOfflineController';
import ContactTribunalController from '../../controllers/ContactTribunalController';
import ContactTribunalSelectedController from '../../controllers/ContactTribunalSelectedController';
import ContactTribunalStoreCompleteController from '../../controllers/ContactTribunalStoreCompleteController';
import ContactTribunalStoreController from '../../controllers/ContactTribunalStoreController';
import ContactTribunalSubmitCompleteController from '../../controllers/ContactTribunalSubmitCompleteController';
import ContactTribunalSubmitController from '../../controllers/ContactTribunalSubmitController';
import ContactTribunalSubmitStoredController from '../../controllers/ContactTribunalSubmitStoredController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import CopyToOtherPartyController from '../../controllers/CopyToOtherPartyController';
import CopyToOtherPartyOfflineController from '../../controllers/CopyToOtherPartyOfflineController';
import DocumentsController from '../../controllers/DocumentsController';
import EmployersContractClaimController from '../../controllers/EmployersContractClaimController';
import EmployersContractClaimDetailsController from '../../controllers/EmployersContractClaimDetailsController';
import GetCaseDocumentController from '../../controllers/GetCaseDocumentController';
import HearingPreferencesController from '../../controllers/HearingPreferencesController';
import HoldingPageController from '../../controllers/HoldingPageController';
import HomeController from '../../controllers/HomeController';
import IsClaimantEmploymentWithRespondentContinuingController from '../../controllers/IsClaimantEmploymentWithRespondentContinuingController';
import NewSelfAssignmentRequestController from '../../controllers/NewSelfAssignmentRequestController';
import NotificationController from '../../controllers/NotificationController';
import NotificationDetailsController from '../../controllers/NotificationDetailsController';
import OtherRespondentApplicationsController from '../../controllers/OtherRespondentApplicationsController';
import ReasonableAdjustmentsController from '../../controllers/ReasonableAdjustmentsController';
import RemoveFileController from '../../controllers/RemoveFileController';
import RespondToApplicationCYAController from '../../controllers/RespondToApplicationCYAController';
import RespondToApplicationCompleteController from '../../controllers/RespondToApplicationCompleteController';
import RespondToApplicationController from '../../controllers/RespondToApplicationController';
import RespondToApplicationCopyToOtherPartyController from '../../controllers/RespondToApplicationCopyToOtherPartyController';
import RespondToApplicationSubmitController from '../../controllers/RespondToApplicationSubmitController';
import RespondToApplicationSupportingMaterialController from '../../controllers/RespondToApplicationSupportingMaterialController';
import RespondToNotificationCYAController from '../../controllers/RespondToNotificationCYAController';
import RespondToNotificationCYAOfflineController from '../../controllers/RespondToNotificationCYAOfflineController';
import RespondToNotificationCompleteController from '../../controllers/RespondToNotificationCompleteController';
import RespondToNotificationController from '../../controllers/RespondToNotificationController';
import RespondToNotificationCopyController from '../../controllers/RespondToNotificationCopyController';
import RespondToNotificationCopyOfflineController from '../../controllers/RespondToNotificationCopyOfflineController';
import RespondToNotificationSubmitController from '../../controllers/RespondToNotificationSubmitController';
import RespondentAddressController from '../../controllers/RespondentAddressController';
import RespondentContactPhoneNumberController from '../../controllers/RespondentContactPhoneNumberController';
import RespondentContactPreferencesController from '../../controllers/RespondentContactPreferencesController';
import RespondentContestClaimController from '../../controllers/RespondentContestClaimController';
import RespondentContestClaimReasonController from '../../controllers/RespondentContestClaimReasonController';
import RespondentDXAddressController from '../../controllers/RespondentDXAddressController';
import RespondentEmployeesController from '../../controllers/RespondentEmployeesController';
import RespondentEnterAddressController from '../../controllers/RespondentEnterAddressController';
import RespondentEnterPostCodeController from '../../controllers/RespondentEnterPostCodeController';
import RespondentNameController from '../../controllers/RespondentNameController';
import RespondentPreferredContactNameController from '../../controllers/RespondentPreferredContactNameController';
import RespondentResponseLandingController from '../../controllers/RespondentResponseLandingController';
import RespondentResponseTaskListController from '../../controllers/RespondentResponseTaskListController';
import RespondentSelectPostCodeController from '../../controllers/RespondentSelectPostCodeController';
import RespondentSiteEmployeesController from '../../controllers/RespondentSiteEmployeesController';
import RespondentSitesController from '../../controllers/RespondentSitesController';
import ResponseSavedController from '../../controllers/ResponseSavedController';
import ReturnToExistingResponseController from '../../controllers/ReturnToExistingResponseController';
import SelfAssignmentCheckController from '../../controllers/SelfAssignmentCheckController';
import SelfAssignmentFormController from '../../controllers/SelfAssignmentFormController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import TypeOfOrganisationController from '../../controllers/TypeOfOrganisationController';
import YourRequestAndApplicationsController from '../../controllers/YourRequestAndApplicationsController';
import YourResponseFormController from '../../controllers/YourResponseFormController';
import { AppRequest } from '../../definitions/appRequest';
import { FILE_SIZE_LIMIT, FormFieldNames, InterceptPaths, PageUrls, Urls } from '../../definitions/constants';

const handleUploads = multer({
  limits: {
    fileSize: FILE_SIZE_LIMIT,
  },
  fileFilter: (req: AppRequest, file: Express.Multer.File, callback: FileFilterCallback) => {
    req.fileTooLarge = parseInt(req.headers['content-length']) > FILE_SIZE_LIMIT;
    return callback(null, !req.fileTooLarge);
  },
});

const respondentContestClaimReasonLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
});

const employersContractClaimDetailsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again later.',
});

export class Routes {
  public enableFor(app: Application): void {
    // Singleton controllers:
    const respondentContestClaimReasonController = new RespondentContestClaimReasonController();
    const employersContractClaimDetailsController = new EmployersContractClaimDetailsController();
    app.get(InterceptPaths.CHANGE_DETAILS, new ChangeDetailsController().get);
    // Page URLs
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.CASE_LIST_CHECK, new CaseListCheckController().get);
    app.get(PageUrls.YOUR_RESPONSE_FORM, new YourResponseFormController().get);
    app.get(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().post);
    app.get(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().post);
    app.get(PageUrls.CASE_LIST, new CaseListController().get);
    app.get(PageUrls.CASE_DETAILS_WITH_CASE_ID_RESPONDENT_CCD_ID_PARAMETERS, new CaseDetailsController().get);
    app.get(PageUrls.NEW_SELF_ASSIGNMENT_REQUEST, new NewSelfAssignmentRequestController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.APPLICATION_SUBMITTED, new ApplicationSubmittedController().get);
    app.get(PageUrls.RESPONSE_SAVED, new ResponseSavedController().get);
    app.get(PageUrls.CHECK_YOUR_ANSWERS_ET3, new CheckYourAnswersET3Controller().get);
    app.post(PageUrls.CHECK_YOUR_ANSWERS_ET3, new CheckYourAnswersET3Controller().post);
    // hub links
    app.get(PageUrls.CLAIMANT_ET1_FORM, new ClaimantET1FormController().get);
    app.get(PageUrls.CLAIMANT_CONTACT_DETAILS, new ClaimantContactDetailsController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_LANDING, new RespondentResponseLandingController().get);
    // ET3 task list
    app.get(PageUrls.RESPONDENT_RESPONSE_TASK_LIST, new RespondentResponseTaskListController().get);
    // 1. Tell us about the respondent (contact-details)
    app.get(PageUrls.RESPONDENT_NAME, new RespondentNameController().get);
    app.post(PageUrls.RESPONDENT_NAME, new RespondentNameController().post);
    app.get(PageUrls.TYPE_OF_ORGANISATION, new TypeOfOrganisationController().get);
    app.post(PageUrls.TYPE_OF_ORGANISATION, new TypeOfOrganisationController().post);
    app.get(PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().get);
    app.post(PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().post);
    app.get(PageUrls.RESPONDENT_ENTER_POST_CODE, new RespondentEnterPostCodeController().get);
    app.post(PageUrls.RESPONDENT_ENTER_POST_CODE, new RespondentEnterPostCodeController().post);
    app.get(PageUrls.RESPONDENT_SELECT_POST_CODE, new RespondentSelectPostCodeController().get);
    app.post(PageUrls.RESPONDENT_SELECT_POST_CODE, new RespondentSelectPostCodeController().post);
    app.get(PageUrls.RESPONDENT_ENTER_ADDRESS, new RespondentEnterAddressController().get);
    app.post(PageUrls.RESPONDENT_ENTER_ADDRESS, new RespondentEnterAddressController().post);
    app.get(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME, new RespondentPreferredContactNameController().get);
    app.post(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME, new RespondentPreferredContactNameController().post);
    app.get(PageUrls.RESPONDENT_DX_ADDRESS, new RespondentDXAddressController().get);
    app.post(PageUrls.RESPONDENT_DX_ADDRESS, new RespondentDXAddressController().post);
    app.get(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER, new RespondentContactPhoneNumberController().get);
    app.post(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER, new RespondentContactPhoneNumberController().post);
    app.get(PageUrls.RESPONDENT_CONTACT_PREFERENCES, new RespondentContactPreferencesController().get);
    app.post(PageUrls.RESPONDENT_CONTACT_PREFERENCES, new RespondentContactPreferencesController().post);
    app.get(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS, new CheckYourAnswersContactDetailsController().get);
    app.post(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS, new CheckYourAnswersContactDetailsController().post);
    // 1. Tell us about the respondent (hearing preferences)
    app.get(PageUrls.HEARING_PREFERENCES, new HearingPreferencesController().get);
    app.post(PageUrls.HEARING_PREFERENCES, new HearingPreferencesController().post);
    app.get(PageUrls.REASONABLE_ADJUSTMENTS, new ReasonableAdjustmentsController().get);
    app.post(PageUrls.REASONABLE_ADJUSTMENTS, new ReasonableAdjustmentsController().post);
    app.get(PageUrls.RESPONDENT_EMPLOYEES, new RespondentEmployeesController().get);
    app.post(PageUrls.RESPONDENT_EMPLOYEES, new RespondentEmployeesController().post);
    app.get(PageUrls.RESPONDENT_SITES, new RespondentSitesController().get);
    app.post(PageUrls.RESPONDENT_SITES, new RespondentSitesController().post);
    app.get(PageUrls.RESPONDENT_SITE_EMPLOYEES, new RespondentSiteEmployeesController().get);
    app.post(PageUrls.RESPONDENT_SITE_EMPLOYEES, new RespondentSiteEmployeesController().post);
    app.get(PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES, new CheckYourAnswersHearingPreferencesController().get);
    app.post(PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES, new CheckYourAnswersHearingPreferencesController().post);
    // 2. Tell us about the claimant (early-conciliation-and-employee-details)
    app.get(PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE, new AcasEarlyConciliationCertificateController().get);
    app.post(PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE, new AcasEarlyConciliationCertificateController().post);
    app.get(PageUrls.CLAIMANT_EMPLOYMENT_DATES, new ClaimantEmploymentDatesController().get);
    app.post(PageUrls.CLAIMANT_EMPLOYMENT_DATES, new ClaimantEmploymentDatesController().post);
    app.get(PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER, new ClaimantEmploymentDatesEnterController().get);
    app.post(PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER, new ClaimantEmploymentDatesEnterController().post);
    app.get(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      new IsClaimantEmploymentWithRespondentContinuingController().get
    );
    app.post(
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      new IsClaimantEmploymentWithRespondentContinuingController().post
    );
    app.get(PageUrls.CLAIMANT_JOB_TITLE, new ClaimantJobTitleController().get);
    app.post(PageUrls.CLAIMANT_JOB_TITLE, new ClaimantJobTitleController().post);
    app.get(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, new ClaimantAverageWeeklyWorkHoursController().get);
    app.post(PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, new ClaimantAverageWeeklyWorkHoursController().post);
    app.get(
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
      new CheckYourAnswersEarlyConciliationAndEmployeeDetailsController().get
    );
    app.post(
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
      new CheckYourAnswersEarlyConciliationAndEmployeeDetailsController().post
    );
    // 2. Tell us about the claimant (pay-pension-and-benefits)
    app.get(PageUrls.CLAIMANT_PAY_DETAILS, new ClaimantPayDetailsController().get);
    app.post(PageUrls.CLAIMANT_PAY_DETAILS, new ClaimantPayDetailsController().post);
    app.get(PageUrls.CLAIMANT_PAY_DETAILS_ENTER, new ClaimantPayDetailsEnterController().get);
    app.post(PageUrls.CLAIMANT_PAY_DETAILS_ENTER, new ClaimantPayDetailsEnterController().post);
    app.get(PageUrls.CLAIMANT_NOTICE_PERIOD, new ClaimantNoticePeriodController().get);
    app.post(PageUrls.CLAIMANT_NOTICE_PERIOD, new ClaimantNoticePeriodController().post);
    app.get(PageUrls.CLAIMANT_PENSION_AND_BENEFITS, new ClaimantPensionAndBenefitsController().get);
    app.post(PageUrls.CLAIMANT_PENSION_AND_BENEFITS, new ClaimantPensionAndBenefitsController().post);
    app.get(
      PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
      new CheckYourAnswersPayPensionAndBenefitsController().get
    );
    app.post(
      PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
      new CheckYourAnswersPayPensionAndBenefitsController().post
    );
    // 3. Give us your response (contest-claim)
    app.get(PageUrls.RESPONDENT_CONTEST_CLAIM, new RespondentContestClaimController().get);
    app.post(PageUrls.RESPONDENT_CONTEST_CLAIM, new RespondentContestClaimController().post);
    app.get(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON, respondentContestClaimReasonController.get);
    app.post(
      PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
      respondentContestClaimReasonLimiter,
      handleUploads.single('contestClaimDocument'),
      respondentContestClaimReasonController.post
    );
    app.get(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, new CheckYourAnswersContestClaimController().get);
    app.post(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, new CheckYourAnswersContestClaimController().post);
    app.get(PageUrls.EMPLOYERS_CONTRACT_CLAIM, new EmployersContractClaimController().get);
    app.post(PageUrls.EMPLOYERS_CONTRACT_CLAIM, new EmployersContractClaimController().post);
    app.get(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS, employersContractClaimDetailsController.get);
    app.post(
      PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
      employersContractClaimDetailsLimiter,
      handleUploads.single('claimSummaryFile'),
      new EmployersContractClaimDetailsController().post
    );
    app.get(
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      new CheckYourAnswersEmployersContractClaimController().get
    );
    app.post(
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      new CheckYourAnswersEmployersContractClaimController().post
    );
    // Contact the tribunal about your case
    app.get(PageUrls.HOLDING_PAGE, new HoldingPageController().get);
    app.get(PageUrls.CONTACT_TRIBUNAL, new ContactTribunalController().get);
    app.get(PageUrls.CONTACT_TRIBUNAL_SELECTED, new ContactTribunalSelectedController().get);
    app.post(
      PageUrls.CONTACT_TRIBUNAL_SELECTED,
      limiter,
      handleUploads.single(FormFieldNames.CONTACT_TRIBUNAL_SELECTED.CONTACT_APPLICATION_FILE_NAME),
      new ContactTribunalSelectedController().post
    );
    app.get(PageUrls.COPY_TO_OTHER_PARTY, new CopyToOtherPartyController().get);
    app.post(PageUrls.COPY_TO_OTHER_PARTY, new CopyToOtherPartyController().post);
    app.get(PageUrls.COPY_TO_OTHER_PARTY_OFFLINE, new CopyToOtherPartyOfflineController().get);
    app.post(PageUrls.COPY_TO_OTHER_PARTY_OFFLINE, new CopyToOtherPartyOfflineController().post);
    app.get(PageUrls.CONTACT_TRIBUNAL_CYA, new ContactTribunalCYAController().get);
    app.get(PageUrls.CONTACT_TRIBUNAL_CYA_OFFLINE, new ContactTribunalCYAOfflineController().get);
    app.get(InterceptPaths.CONTACT_TRIBUNAL_SUBMIT, new ContactTribunalSubmitController().get);
    app.get(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE, new ContactTribunalSubmitCompleteController().get);
    app.get(InterceptPaths.CONTACT_TRIBUNAL_STORE, new ContactTribunalStoreController().get);
    app.get(PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE, new ContactTribunalStoreCompleteController().get);
    app.get(PageUrls.STORED_APPLICATION_SUBMIT, new ContactTribunalSubmitStoredController().get);
    app.post(PageUrls.STORED_APPLICATION_SUBMIT, new ContactTribunalSubmitStoredController().post);
    // Your request and applications
    app.get(PageUrls.YOUR_REQUEST_AND_APPLICATIONS, new YourRequestAndApplicationsController().get);
    app.get(PageUrls.CLAIMANTS_APPLICATIONS, new ClaimantsApplicationsController().get);
    app.get(PageUrls.OTHER_RESPONDENT_APPLICATIONS, new OtherRespondentApplicationsController().get);
    app.get(PageUrls.APPLICATION_DETAILS, new ApplicationDetailsController().get);
    app.get(PageUrls.RESPOND_TO_APPLICATION, new RespondToApplicationController().get);
    app.post(PageUrls.RESPOND_TO_APPLICATION, new RespondToApplicationController().post);
    app.get(
      PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL,
      new RespondToApplicationSupportingMaterialController().get
    );
    app.post(
      PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL,
      limiter,
      handleUploads.single(FormFieldNames.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL.SUPPORTING_MATERIAL_FILE),
      new RespondToApplicationSupportingMaterialController().post
    );
    app.get(
      PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY,
      new RespondToApplicationCopyToOtherPartyController().get
    );
    app.post(
      PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY,
      new RespondToApplicationCopyToOtherPartyController().post
    );
    app.get(PageUrls.RESPOND_TO_APPLICATION_CYA, new RespondToApplicationCYAController().get);
    app.get(InterceptPaths.RESPOND_TO_APPLICATION_SUBMIT, new RespondToApplicationSubmitController().get);
    app.get(PageUrls.RESPOND_TO_APPLICATION_COMPLETE, new RespondToApplicationCompleteController().get);
    // Notification
    app.get(PageUrls.NOTIFICATIONS, new NotificationController().get);
    app.get(PageUrls.NOTIFICATION_DETAILS, new NotificationDetailsController().get);
    app.get(PageUrls.RESPOND_TO_NOTIFICATION, new RespondToNotificationController().get);
    app.post(
      PageUrls.RESPOND_TO_NOTIFICATION,
      limiter,
      handleUploads.single(FormFieldNames.RESPOND_TO_NOTIFICATION.SUPPORTING_MATERIAL_FILE),
      new RespondToNotificationController().post
    );
    app.get(PageUrls.RESPOND_TO_NOTIFICATION_COPY, new RespondToNotificationCopyController().get);
    app.post(PageUrls.RESPOND_TO_NOTIFICATION_COPY, new RespondToNotificationCopyController().post);
    app.get(PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE, new RespondToNotificationCopyOfflineController().get);
    app.post(PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE, new RespondToNotificationCopyOfflineController().post);
    app.get(PageUrls.RESPOND_TO_NOTIFICATION_CYA, new RespondToNotificationCYAController().get);
    app.get(PageUrls.RESPOND_TO_NOTIFICATION_CYA_OFFLINE, new RespondToNotificationCYAOfflineController().get);
    app.get(InterceptPaths.RESPOND_TO_NOTIFICATION_SUBMIT, new RespondToNotificationSubmitController().get);
    app.get(PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE, new RespondToNotificationCompleteController().get);
    // others
    app.get(PageUrls.RETURN_TO_EXISTING_RESPONSE, new ReturnToExistingResponseController().get);
    app.post(PageUrls.RETURN_TO_EXISTING_RESPONSE, new ReturnToExistingResponseController().post);
    app.get(Urls.EXTEND_SESSION, new SessionTimeoutController().getExtendSession);
    app.get(PageUrls.GET_CASE_DOCUMENT, new GetCaseDocumentController().get);
    app.get(PageUrls.GET_SUPPORTING_MATERIAL, new AttachmentController().get);
    app.post(PageUrls.CASE_NUMBER_CHECK, new CaseNumberCheckController().post);
    app.get(PageUrls.CASE_NUMBER_CHECK, new CaseNumberCheckController().get);
    app.get(PageUrls.DOCUMENTS, new DocumentsController().get);
    app.get(PageUrls.REMOVE_FILE, new RemoveFileController().get);
    app.get(PageUrls.APPOINT_LEGAL_REPRESENTATIVE, new AppointLegalRepController().get);
    app.get(PageUrls.CHANGE_LEGAL_REPRESENTATIVE, new ChangeLegalRepresentativeController().get);
    app.post(PageUrls.CHANGE_LEGAL_REPRESENTATIVE, new ChangeLegalRepresentativeController().post);
    app.get(
      Urls.INFO,
      infoRequestHandler({
        extraBuildInfo: {
          host: os.hostname(),
          name: 'et-syr-frontend',
          uptime: process.uptime(),
        },
        info: {},
      })
    );
  }
}
