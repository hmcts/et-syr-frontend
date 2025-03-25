import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getYourApplicationCollection } from '../helpers/controller/YourRequestAndApplicationsHelper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class YourRequestAndApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const isContactTribunalEnabled = await getFlagValue('et3-contact-tribunal', null);
    if (!isContactTribunalEnabled) {
      return res.redirect(PageUrls.HOLDING_PAGE + getLanguageParam(req.url));
    }

    res.render(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      appList: getYourApplicationCollection(req),
    });
  };
}
