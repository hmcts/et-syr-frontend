import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { HubLinksStatuses, sectionIndexToLinkNames, statusColorMap } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId, formatDate, getDueDate } from '../helpers/ApiFormatter';
import { handleUpdateHubLinksStatuses } from '../helpers/CaseHelpers';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getHubLinksUrlMap, shouldHubLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { currentStateFn } from '../helpers/state-sequence';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('CaseDetailsController');
const DAYS_FOR_PROCESSING = 7;
export default class CaseDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const respondToClaimUrl = setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_LANDING);
    let showAcknowledgementAlert: boolean = false;
    try {
      req.session.userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.caseId)).data
      );
      // Check if Respond to claim acknowledgment needs to be shown or not
      req.session.userCase?.respondents.forEach(respondent => {
        if (respondent.responseContinue === YesOrNo.YES) {
          return (showAcknowledgementAlert = true);
        }
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
    const userCase = req.session.userCase;
    if (!userCase.hubLinksStatuses) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }
    const currentState = currentStateFn(userCase);
    const hubLinksStatuses = userCase.hubLinksStatuses;
    const languageParam = getLanguageParam(req.url);

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
      respondToClaimUrl,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showAcknowledgementAlert,
      respondentResponseDeadline: userCase?.respondentResponseDeadline,
      languageParam: getLanguageParam(req.url),
    });
  }
}
