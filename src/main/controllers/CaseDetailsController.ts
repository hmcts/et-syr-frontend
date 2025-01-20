import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3Status } from '../definitions/definition';
import {
  ET3CaseDetailsLinkNames,
  LinkStatus,
  SectionIndexToEt3CaseDetailsLinkNames,
  linkStatusColorMap,
} from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { getApplicationRequestFromAdmin } from '../helpers/AdminNotificationHelper';
import { formatApiCaseDataToCaseWithId, formatDate, getDueDate } from '../helpers/ApiFormatter';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getET3CaseDetailsLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import { currentET3StatusFn } from '../helpers/state-sequence';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';
import ET3DataModelUtil from '../utils/ET3DataModelUtil';
import ET3Util from '../utils/ET3Util';

const DAYS_FOR_PROCESSING = 7;
export default class CaseDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const et1FormUrl = setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM);
    const respondToClaimUrl = setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_LANDING);
    const et3Response = setUrlLanguage(req, PageUrls.YOUR_RESPONSE_FORM);
    let respondentResponseDeadline: string = '';
    req.session.userCase = formatApiCaseDataToCaseWithId(
      (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.caseSubmissionReference)).data,
      req
    );
    req.session.selectedRespondentIndex = ET3Util.findSelectedRespondentIndex(req);
    if (CollectionUtils.isNotEmpty(req.session.errors)) {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CASE_LIST)));
    }
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];
    ET3DataModelUtil.setSelectedRespondentDataToCaseWithId(req);
    if (CollectionUtils.isNotEmpty(req.session.errors)) {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CASE_LIST)));
    }
    respondentResponseDeadline = ET3DataModelUtil.getRespondentResponseDeadline(req);
    const currentState = currentET3StatusFn(selectedRespondent);
    const et3CaseDetailsLinksStatuses = selectedRespondent.et3CaseDetailsLinksStatuses;
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
            url: () =>
              getET3CaseDetailsLinksUrlMap(languageParam, selectedRespondent.et3Status, req.session.userCase).get(
                linkName
              ),
            statusColor: () => linkStatusColorMap.get(status),
          };
        }),
      };
    });

    res.render(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase: req.session.userCase,
      currentState,
      sections,
      et1FormUrl,
      respondToClaimUrl,
      selectedRespondent: req.session.userCase.respondents[req.session.selectedRespondentIndex],
      et3Response,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(req.session.userCase.submittedDate), DAYS_FOR_PROCESSING),
      showAcknowledgementAlert:
        et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.RespondentResponse] === LinkStatus.NOT_STARTED_YET,
      showSavedResponseAlert: req.session.userCase.et3Status === ET3Status.IN_PROGRESS,
      showViewResponseAlert: req.session.userCase.responseReceived === YesOrNo.YES,
      respondentResponseDeadline,
      adminNotifications: getApplicationRequestFromAdmin(req.session.userCase.genericTseApplicationCollection, req),
      languageParam: getLanguageParam(req.url),
    });
  }
}
