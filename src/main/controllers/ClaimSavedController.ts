import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { AuthUrls, PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class ClaimSavedController {
  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_TASK_LIST);
    res.render(TranslationKeys.CLAIM_SAVED, {
      ...req.t(TranslationKeys.CLAIM_SAVED, { returnObjects: true }),
      AuthUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
    });
  };
}
