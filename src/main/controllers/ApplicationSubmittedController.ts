import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { retrieveCurrentLocale } from '../helpers/ApplicationTableRecordTranslationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ApplicationSubmittedController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/case-details/${userCase?.id}${languageParam}`;
    const applicationDate = new Date();
    applicationDate.setDate(applicationDate.getDate() + 7);
    const dateString = applicationDate.toLocaleDateString(retrieveCurrentLocale(req?.url), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    res.render(TranslationKeys.APPLICATION_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_SUBMITTED, { returnObjects: true }),
      applicationDate: dateString,
      userCase,
      redirectUrl,
      welshEnabled,
    });
  };
}
