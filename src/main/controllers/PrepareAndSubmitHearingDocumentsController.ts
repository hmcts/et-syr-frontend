import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import UrlUtils from '../utils/UrlUtils';

export default class PrepareAndSubmitHearingDocumentsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.AGREEING_DOCUMENTS);

    res.render(TranslationKeys.PREPARE_AND_SUBMIT_HEARING_DOCUMENTS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.PREPARE_AND_SUBMIT_HEARING_DOCUMENTS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      redirectUrl,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
