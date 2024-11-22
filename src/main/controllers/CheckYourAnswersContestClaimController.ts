import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getEt3Section5 } from '../helpers/controller/CheckYourAnswersET3Helper';
import ET3Util from '../utils/ET3Util';

import BaseCYAController from './BaseCYAController';

export default class CheckYourAnswersContestClaimController extends BaseCYAController {
  constructor() {
    super('contestClaimSection');
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const linkStatus = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? LinkStatus.COMPLETED
      : LinkStatus.IN_PROGRESS;

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContestClaim,
      linkStatus,
      PageUrls.EMPLOYERS_CONTRACT_CLAIM
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      sessionErrors: req.session.errors,
      form: this.formContent,
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.CONTEST_CLAIM_CHANGE),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
