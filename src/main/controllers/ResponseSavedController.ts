import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import ET3DataModelUtil from '../utils/ET3DataModelUtil';

export default class ResponseSavedController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);

    const respondentIndex = req.session.selectedRespondentIndex;
    const respondentCcdId = req.session.userCase.respondents[respondentIndex]?.ccdId;
    const redirectToResponse = `${PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER}/${userCase.id}/${respondentCcdId}${languageParam}`;

    const redirectToCaseList = PageUrls.CASE_LIST + languageParam;

    res.render(TranslationKeys.RESPONSE_SAVED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
      userCase,
      redirectToResponse,
      redirectToCaseList,
      respondentResponseDeadline: ET3DataModelUtil.getRespondentResponseDeadline(req),
      welshEnabled,
    });
  };
}
