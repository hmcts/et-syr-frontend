import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class InterruptionCardController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CASE_LIST_CHECK);
    res.render(TranslationKeys.INTERRUPTION_CARD, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.INTERRUPTION_CARD as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
    });
  }
}
