import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getEt3Section3 } from '../helpers/controller/CheckYourAnswersET3Helper';
import ET3Util from '../utils/ET3Util';

import BaseCYAController from './BaseCYAController';

export default class CheckYourAnswersEarlyConciliationAndEmployeeDetailsController extends BaseCYAController {
  constructor() {
    super('conciliationAndEmployeeDetailsSection');
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const linkStatus = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? LinkStatus.COMPLETED
      : LinkStatus.IN_PROGRESS;

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      linkStatus,
      PageUrls.CLAIMANT_PAY_DETAILS
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(
        TranslationKeys.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS as never,
        { returnObjects: true } as never
      ),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      sessionErrors: req.session.errors,
      form: this.formContent,
      et3ResponseSection3: getEt3Section3(
        userCase,
        sectionTranslations,
        InterceptPaths.CONCILIATION_AND_EMPLOYEE_DETAILS_CHANGE
      ),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
