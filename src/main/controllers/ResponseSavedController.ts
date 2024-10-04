import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class ResponseSavedController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/case-details/${userCase?.id}${languageParam}`;

    res.render(TranslationKeys.RESPONSE_SAVED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
      applicationDeadline: userCase.respondentResponseDeadline,
      userCase,
      redirectUrl,
      welshEnabled,
    });
  };
}
