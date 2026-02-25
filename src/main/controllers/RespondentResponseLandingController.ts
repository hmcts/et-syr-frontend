import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3Status } from '../definitions/definition';
import { LinkStatus, getResponseHubLinkStatusesByRespondentHubLinkStatuses } from '../definitions/links';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

export default class RespondentResponseLandingController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_TASK_LIST);
    // Initialize et3HubLinksStatuses with defaults if null/undefined, following the pattern from RespondentUtil.java
    const et3HubLinksStatuses = getResponseHubLinkStatusesByRespondentHubLinkStatuses(
      req.session.userCase.et3HubLinksStatuses
    );
    //check at least one et3CaseDetailsLinksStatuses is not NOT_STARTED and CANNOT_START to show 'continue'
    const isAnEt3SectionStatusNotStarted = Object.values(et3HubLinksStatuses).some(
      status => status !== LinkStatus.NOT_STARTED_YET && status !== LinkStatus.CANNOT_START_YET
    );

    res.render(TranslationKeys.RESPONDENT_RESPONSE_LANDING, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_LANDING as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      responseSaved: req.session.userCase.et3Status === ET3Status.IN_PROGRESS && isAnEt3SectionStatusNotStarted,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
