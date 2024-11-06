import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { SectionIndexToEt3CaseDetailsLinkNames, linkStatusColorMap } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId, formatDate, getDueDate } from '../helpers/ApiFormatter';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getET3CaseDetailsLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { currentET3StatusFn } from '../helpers/state-sequence';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import DateUtils from '../utils/DateUtils';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('CaseDetailsController');
const DAYS_FOR_PROCESSING = 7;
export default class CaseDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const et1FormUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const respondToClaimUrl = setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_LANDING);
    const et3Response = setUrlLanguage(req, PageUrls.RESPONDENT_ET3_RESPONSE);

    let showAcknowledgementAlert: boolean = false;
    let showViewResponseAlert: boolean = false;
    let respondentResponseDeadline: string = '';

    try {
      req.session.userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.caseSubmissionReference)).data,
        req
      );
      if (StringUtils.isNotBlank(req.session.userCase?.respondentResponseDeadline)) {
        respondentResponseDeadline = req.session.userCase.respondentResponseDeadline;
      } else {
        if (StringUtils.isNotBlank(req.session.userCase?.preAcceptCase?.dateAccepted)) {
          respondentResponseDeadline = DateUtils.addStringDate28Days(req.session.userCase?.preAcceptCase?.dateAccepted);
        }
      }
      // Check if Respond to claim acknowledgment needs to be shown or not
      req.session.userCase?.respondents.forEach(respondent => {
        if (respondent.responseContinue === YesOrNo.YES) {
          return (showAcknowledgementAlert = true);
        } else {
          showViewResponseAlert = true;
        }
      });
    } catch (error) {
      logger.error(error.message);
      return res.redirect('/not-found');
    }
    const userCase = req.session.userCase;
    req.session.selectedRespondentIndex = ET3Util.findSelectedRespondent(req);
    const currentState = currentET3StatusFn(req.session.userCase.respondents[req.session.selectedRespondentIndex]);
    logger.info(currentState.stateIndex as unknown as string);
    logger.info(currentState.states as unknown as string);
    logger.info(currentState.isAfter('CASE_DECIDED') as unknown as string);
    req.session.selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
    const et3CaseDetailsLinksStatuses =
      req.session.userCase.respondents[req.session.selectedRespondentIndex].et3CaseDetailsLinksStatuses;
    const languageParam = getLanguageParam(req.url);
    const sections = Array.from(Array(SectionIndexToEt3CaseDetailsLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: SectionIndexToEt3CaseDetailsLinkNames[index].map(linkName => {
          const status = et3CaseDetailsLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: shouldCaseDetailsLinkBeClickable(status),
            url: () => getET3CaseDetailsLinksUrlMap(languageParam).get(linkName),
            statusColor: () => linkStatusColorMap.get(status),
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
      et1FormUrl,
      respondToClaimUrl,
      selectedRespondent: req.session.userCase.respondents[req.session.selectedRespondentIndex],
      et3Response,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showAcknowledgementAlert,
      showViewResponseAlert,
      respondentResponseDeadline,
      languageParam: getLanguageParam(req.url),
    });
  }
}
