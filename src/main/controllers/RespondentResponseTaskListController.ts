import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Respondent } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3HubLinksStatuses, SectionIndexToEt3HubLinkNames, linkStatusColorMap } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { handleUpdateHubLinksStatuses } from '../helpers/CaseHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getET3HubLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

const logger = getLogger('RespondentResponseTaskListController');

export default class RespondentResponseTaskListController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.NOT_IMPLEMENTED);

    let selectedRespondent: Respondent;
    for (const respondent of req.session.userCase.respondents) {
      if (respondent.idamId === req.session.user.id) {
        selectedRespondent = respondent;
        break;
      }
    }

    if (!selectedRespondent.et3HubLinksStatuses) {
      selectedRespondent.et3HubLinksStatuses = new ET3HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const et3HubLinksStatuses = selectedRespondent.et3HubLinksStatuses;
    const languageParam = getLanguageParam(req.url);

    const sections = Array.from(Array(SectionIndexToEt3HubLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: SectionIndexToEt3HubLinkNames[index].map(linkName => {
          const status = et3HubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: shouldCaseDetailsLinkBeClickable(status),
            url: () => getET3HubLinksUrlMap(languageParam).get(linkName),
            statusColor: () => linkStatusColorMap.get(status),
          };
        }),
      };
    });
    res.render(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      sections,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
