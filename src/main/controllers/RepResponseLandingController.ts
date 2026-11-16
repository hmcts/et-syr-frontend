import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class RepResponseLandingController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    res.render(TranslationKeys.RESPONDENT_RESPONSE_LANDING, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_LANDING as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_LANDING_FOR_REP as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl: setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_TASK_LIST),
      languageParam: getLanguageParam(req.url),
      hideContactUs: true,
    });
  }
}
