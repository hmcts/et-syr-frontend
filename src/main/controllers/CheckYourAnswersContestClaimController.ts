import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { CLAIM_TYPES, DefaultValues, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getEt3Section5 } from '../helpers/controller/CheckYourAnswersET3Helper';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';

import BaseCYAController from './BaseCYAController';

export default class CheckYourAnswersContestClaimController extends BaseCYAController {
  constructor() {
    super('contestClaimSection');
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const linkStatus = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? LinkStatus.COMPLETED
      : LinkStatus.IN_PROGRESS_CYA;
    let redirectUrl: string = PageUrls.RESPONDENT_RESPONSE_TASK_LIST;
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.typeOfClaim) &&
      (req.session.userCase.typeOfClaim.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) ||
        req.session.userCase.typeOfClaim.includes(TypesOfClaim.BREACH_OF_CONTRACT))
    ) {
      redirectUrl = PageUrls.EMPLOYERS_CONTRACT_CLAIM;
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContestClaim,
      linkStatus,
      redirectUrl
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    const documents = userCase.et3ResponseContestClaimDocument;
    // Join the shortDescriptions with a comma
    const contestClaimDocumentNames =
      userCase.et3ResponseContestClaimDocument !== undefined
        ? documents.map(document => document.value.shortDescription).join(', ')
        : DefaultValues.STRING_DASH;

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      sessionErrors: req.session.errors,
      form: this.formContent,
      contestClaimDocumentNames,
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.CONTEST_CLAIM_CHANGE),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
