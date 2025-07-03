import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationsAccordionItems } from '../helpers/controller/ContactTribunalHelper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ContactTribunalController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const isContactTribunalEnabled = await getFlagValue('et3-contact-tribunal', null);
    const respondentRepresented = req.session.userCase?.respondentRepresented;

    if (!isContactTribunalEnabled) {
      return res.redirect(PageUrls.HOLDING_PAGE + getLanguageParam(req.url));
    }

    // if (!isClaimantSystemUser(req.session.userCase)) {
    //   return res.redirect(PageUrls.HOLDING_PAGE + getLanguageParam(req.url));
    // }

    const applicationsAccordionItems =
      respondentRepresented === undefined
        ? getApplicationsAccordionItems(req.url, {
            ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
          })
        : [];

    res.render(TranslationKeys.CONTACT_TRIBUNAL, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationsAccordionItems,
      respondentRepresented,
    });
  };
}
