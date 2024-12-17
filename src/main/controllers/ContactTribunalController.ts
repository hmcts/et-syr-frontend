import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationsAccordionItems } from '../helpers/controller/ContactTribunalHelper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ContactTribunalController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const isContactTribunalEnabled = await getFlagValue('contact-tribunal-enabled', null);
    if (!isContactTribunalEnabled) {
      return res.redirect(PageUrls.HOLDING_PAGE + getLanguageParam(req.url));
    }

    res.render(TranslationKeys.CONTACT_TRIBUNAL, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationsAccordionItems: getApplicationsAccordionItems(req.url, {
        ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
      }),
    });
  }
}
