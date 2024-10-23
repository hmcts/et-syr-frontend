import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import AcasEarlyConciliationCertificateController from '../../controllers/AcasEarlyConciliationCertificateController';
import ApplicationSubmittedController from '../../controllers/ApplicationSubmittedController';
import CaseDetailsController from '../../controllers/CaseDetailsController';
import CaseListCheckController from '../../controllers/CaseListCheckController';
import CaseListController from '../../controllers/CaseListController';
import ChangeDetailsController from '../../controllers/ChangeDetailsController';
import CheckYourAnswersContactDetailsController from '../../controllers/CheckYourAnswersContactDetailsController';
import CheckYourAnswersContestClaimController from '../../controllers/CheckYourAnswersContestClaimController';
import CheckYourAnswersET3Controller from '../../controllers/CheckYourAnswersET3Controller';
import CheckYourAnswersEarlyConciliationAndEmployeeDetailsController from '../../controllers/CheckYourAnswersEarlyConciliationAndEmployeeDetailsController';
import CheckYourAnswersEmployersContractClaimController from '../../controllers/CheckYourAnswersEmployersContractClaimController';
import CheckYourAnswersHearingPreferencesController from '../../controllers/CheckYourAnswersHearingPreferencesController';
import CheckYourAnswersPayPensionAndBenefitsController from '../../controllers/CheckYourAnswersPayPensionAndBenefitsController';
import ChecklistController from '../../controllers/ChecklistController';
import ClaimantAcasCertificateDetailsController from '../../controllers/ClaimantAcasCertificateDetailsController';
import ClaimantAverageWeeklyWorkHoursController from '../../controllers/ClaimantAverageWeeklyWorkHoursController';
import ClaimantET1FormController from '../../controllers/ClaimantET1FormController';
import ClaimantET1FormDetailsController from '../../controllers/ClaimantET1FormDetailsController';
import ClaimantEmploymentDatesController from '../../controllers/ClaimantEmploymentDatesController';
import ClaimantEmploymentDatesEnterController from '../../controllers/ClaimantEmploymentDatesEnterController';
import ClaimantJobTitleController from '../../controllers/ClaimantJobTitleController';
import ClaimantNoticePeriodController from '../../controllers/ClaimantNoticePeriodController';
import ClaimantPayDetailsController from '../../controllers/ClaimantPayDetailsController';
import ClaimantPayDetailsEnterController from '../../controllers/ClaimantPayDetailsEnterController';
import ClaimantPensionAndBenefitsController from '../../controllers/ClaimantPensionAndBenefitsController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import ET1FormViewController from '../../controllers/ET1FormViewController';
import ET3ResponseController from '../../controllers/ET3ResponseController';
import EmployersContractClaimController from '../../controllers/EmployersContractClaimController';
import EmployersContractClaimDetailsController from '../../controllers/EmployersContractClaimDetailsController';
import HearingPreferencesController from '../../controllers/HearingPreferencesController';
import HomeController from '../../controllers/HomeController';
import IsClaimantEmploymentWithRespondentContinuingController from '../../controllers/IsClaimantEmploymentWithRespondentContinuingController';
import NewSelfAssignmentRequestController from '../../controllers/NewSelfAssignmentRequestController';
import ReasonableAdjustmentsController from '../../controllers/ReasonableAdjustmentsController';
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
import SelfAssignmentCheckController from '../../controllers/SelfAssignmentCheckController';
import SelfAssignmentFormController from '../../controllers/SelfAssignmentFormController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import TypeOfOrganisationController from '../../controllers/TypeOfOrganisationController';
import { InterceptPaths, PageUrls, Urls } from '../../definitions/constants';

export class Routes {
  public enableFor(app: Application): void {
    app.get(InterceptPaths.CHANGE_DETAILS, new ChangeDetailsController().get);
    // Page URLs
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.CASE_LIST_CHECK, new CaseListCheckController().get);
    app.get(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().post);
    app.get(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().post);
    app.get(PageUrls.CASE_LIST, new CaseListController().get);
    app.get(PageUrls.CASE_DETAILS_WITH_CASE_ID_PARAMETER, new CaseDetailsController().get);
    app.get(PageUrls.NEW_SELF_ASSIGNMENT_REQUEST, new NewSelfAssignmentRequestController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.APPLICATION_SUBMITTED, new ApplicationSubmittedController().get);
    app.get(PageUrls.RESPONSE_SAVED, new ResponseSavedController().get);
    app.get(PageUrls.RESPONDENT_ET3_RESPONSE, new ET3ResponseController().get);
    app.get(PageUrls.CHECK_YOUR_ANSWERS_ET3, new CheckYourAnswersET3Controller().get);
    // hub links
    app.get(PageUrls.CLAIMANT_ET1_FORM, new ClaimantET1FormController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_LANDING, new RespondentResponseLandingController().get);
    // Claimant Form & Cert
    app.get(PageUrls.CLAIMANT_ET1_FORM_DETAILS, new ClaimantET1FormDetailsController().get);
    app.get(PageUrls.CLAIMANT_ACAS_CERTIFICATE_DETAILS, new ClaimantAcasCertificateDetailsController().get);
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
    app.get(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON, new RespondentContestClaimReasonController().get);
    app.post(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON, new RespondentContestClaimReasonController().post);
    app.get(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, new CheckYourAnswersContestClaimController().get);
    app.post(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, new CheckYourAnswersContestClaimController().post);
    app.get(PageUrls.EMPLOYERS_CONTRACT_CLAIM, new EmployersContractClaimController().get);
    app.post(PageUrls.EMPLOYERS_CONTRACT_CLAIM, new EmployersContractClaimController().post);
    app.get(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS, new EmployersContractClaimDetailsController().get);
    app.post(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS, new EmployersContractClaimDetailsController().post);
    app.get(
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      new CheckYourAnswersEmployersContractClaimController().get
    );
    app.post(
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      new CheckYourAnswersEmployersContractClaimController().post
    );
    app.get(Urls.EXTEND_SESSION, new SessionTimeoutController().getExtendSession);
    app.get(PageUrls.ET1_FORM_VIEW, new ET1FormViewController().get);
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
