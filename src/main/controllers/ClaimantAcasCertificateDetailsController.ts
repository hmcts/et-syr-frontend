import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ClaimantAcasCertificateDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ACAS_CERTIFICATE_DETAILS);
    const acasCertDoc = setUrlLanguage(req, PageUrls.NOT_IMPLEMENTED);
    // TODO: acasCert, acasCertDesc and acasCertDate
    res.render(TranslationKeys.CLAIMANT_ACAS_CERTIFICATE_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CLAIMANT_ACAS_CERTIFICATE_DETAILS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      useCase: req.session.userCase,
      redirectUrl,
      acasCertDoc,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
