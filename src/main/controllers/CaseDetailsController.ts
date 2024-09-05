import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { HubLinkStatus, HubLinksStatuses, sectionIndexToLinkNames, statusColorMap } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId, formatDate, getDueDate } from '../helpers/ApiFormatter';
import { handleUpdateHubLinksStatuses } from '../helpers/CaseHelpers';
import {
  getClaimantAppsAndUpdateStatusTag,
  getHubLinksUrlMap,
  shouldHubLinkBeClickable,
  userCaseContainsGeneralCorrespondence,
} from '../helpers/ResponseHubHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { currentStateFn } from '../helpers/state-sequence';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('CaseDetailsController');
const DAYS_FOR_PROCESSING = 7;
export default class CaseDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    try {
      req.session.userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.caseId)).data
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
    const userCase = req.session.userCase;
    if (!userCase.hubLinksStatuses || userCase.hubLinksStatuses['documents'] === HubLinkStatus.NOT_YET_AVAILABLE) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }
    const currentState = currentStateFn(userCase);
    const hubLinksStatuses = userCase.hubLinksStatuses;
    const languageParam = getLanguageParam(req.url);

    getClaimantAppsAndUpdateStatusTag(userCase);

    if (
      userCase?.documentCollection?.length ||
      userCaseContainsGeneralCorrespondence(userCase.sendNotificationCollection)
    ) {
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const sections = Array.from(Array(sectionIndexToLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: sectionIndexToLinkNames[index].map(linkName => {
          const status = hubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: shouldHubLinkBeClickable(status, linkName),
            url: () => getHubLinksUrlMap(languageParam).get(linkName),
            statusColor: () => statusColorMap.get(status),
          };
        }),
      };
    });

    res.render(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      currentState,
      sections,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showAcknowledgementAlert: true,
      respondentResponseDeadline: userCase?.respondentResponseDeadline,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}