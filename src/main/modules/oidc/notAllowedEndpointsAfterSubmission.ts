import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, languages } from '../../definitions/constants';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

export const notAllowedEndpointsAfterSubmission: string[] = [
  PageUrls.RESPONSE_SAVED,
  PageUrls.CHECK_YOUR_ANSWERS_ET3,
  PageUrls.RESPONDENT_RESPONSE_LANDING,
  PageUrls.RESPONDENT_RESPONSE_TASK_LIST,
  PageUrls.RESPONDENT_NAME,
  PageUrls.TYPE_OF_ORGANISATION,
  PageUrls.RESPONDENT_ADDRESS,
  PageUrls.RESPONDENT_ENTER_POST_CODE,
  PageUrls.RESPONDENT_SELECT_POST_CODE,
  PageUrls.RESPONDENT_ENTER_ADDRESS,
  PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
  PageUrls.RESPONDENT_DX_ADDRESS,
  PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
  PageUrls.RESPONDENT_CONTACT_PREFERENCES,
  PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS,
  PageUrls.HEARING_PREFERENCES,
  PageUrls.REASONABLE_ADJUSTMENTS,
  PageUrls.RESPONDENT_EMPLOYEES,
  PageUrls.RESPONDENT_SITES,
  PageUrls.RESPONDENT_SITE_EMPLOYEES,
  PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES,
  PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
  PageUrls.CLAIMANT_EMPLOYMENT_DATES,
  PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
  PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
  PageUrls.CLAIMANT_JOB_TITLE,
  PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
  PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
  PageUrls.CLAIMANT_PAY_DETAILS,
  PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
  PageUrls.CLAIMANT_NOTICE_PERIOD,
  PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
  PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
  PageUrls.RESPONDENT_CONTEST_CLAIM,
  PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
  PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM,
  PageUrls.EMPLOYERS_CONTRACT_CLAIM,
  PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
  PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
];

export const isRequestedUrlNotAllowedAfterSubmission = (req: AppRequest): boolean => {
  if (StringUtils.isBlank(req?.url)) {
    return false;
  }
  const removeWelshQueryString = req.url.replace(languages.WELSH_URL_PARAMETER, '');
  const removeEnglishQueryString = req.url.replace(languages.ENGLISH_URL_PARAMETER, '');
  return (
    (ObjectUtils.isEmpty(req?.session?.userCase) || YesOrNo.YES === req.session?.userCase?.responseReceived) &&
    (notAllowedEndpointsAfterSubmission.includes(removeWelshQueryString) ||
      notAllowedEndpointsAfterSubmission.includes(removeEnglishQueryString))
  );
};
