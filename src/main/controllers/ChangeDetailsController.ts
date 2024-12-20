import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls, RedirectKeys } from '../definitions/constants';
import { setChangeAnswersUrlLanguage, setCheckAnswersLanguage } from '../helpers/LanguageHelper';
import { returnValidUrl } from '../helpers/RouterHelpers';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    const languageParam = setChangeAnswersUrlLanguage(req);
    let redirectUrl;
    // Contact Preferences Change
    if (req.query.redirect === RedirectKeys.RESPONDENT_CONTACT_PREFERENCES) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.RESPONDENT_CONTACT_PREFERENCES);
      redirectUrl = req.url.replace(InterceptPaths.RESPONDENT_CONTACT_PREFERENCES, languageParam);
    } // Section 1.1 - contact-details
    else if (req.query.redirect === RedirectKeys.CONTACT_DETAILS) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS);
      redirectUrl = req.url.replace(InterceptPaths.CONTACT_DETAILS_CHANGE, languageParam);
    } // Section 1.2 employer-details
    else if (req.query.redirect === RedirectKeys.EMPLOYER_DETAILS) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES);
      redirectUrl = req.url.replace(InterceptPaths.EMPLOYER_DETAILS_CHANGE, languageParam);
    } // Section 2.1 conciliation-and-employee-details
    else if (req.query.redirect === RedirectKeys.CONCILIATION_AND_EMPLOYEE_DETAILS) {
      req.session.returnUrl = setCheckAnswersLanguage(
        req,
        PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS
      );
      redirectUrl = req.url.replace(InterceptPaths.CONCILIATION_AND_EMPLOYEE_DETAILS_CHANGE, languageParam);
    } // Section 2.2 pay-pension-benefit-details
    else if (req.query.redirect === RedirectKeys.PAY_PENSION_BENEFIT_DETAILS) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
      redirectUrl = req.url.replace(InterceptPaths.PAY_PENSION_BENEFITS_CHANGE, languageParam);
    } // Section 3.1 contest-claim
    else if (req.query.redirect === RedirectKeys.CONTEST_CLAIM) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
      redirectUrl = req.url.replace(InterceptPaths.CONTEST_CLAIM_CHANGE, languageParam);
    } // Section 3.2 contest-claim
    else if (req.query.redirect === RedirectKeys.EMPLOYERS_CONTRACT_CLAIM) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
      redirectUrl = req.url.replace(InterceptPaths.EMPLOYERS_CONTRACT_CLAIM_CHANGE, languageParam);
    } // FINAL CYA Section
    else if (req.query.redirect === RedirectKeys.ANSWERS) {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_ET3);
      redirectUrl = req.url.replace(InterceptPaths.ANSWERS_CHANGE, languageParam);
    } else {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    res.redirect(returnValidUrl(redirectUrl));
  };
}
