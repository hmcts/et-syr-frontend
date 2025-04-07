import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3Status } from '../definitions/definition';
import {
  ET3CaseDetailsLinkNames,
  ET3CaseDetailsLinksStatuses,
  LinkStatus,
  SectionIndexToEt3CaseDetailsLinkNames,
  linkStatusColorMap,
} from '../definitions/links';
import { TseNotification } from '../definitions/notification/tseNotification';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId, formatDate, getDueDate } from '../helpers/ApiFormatter';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getET3CaseDetailsLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import { getET3CaseDetailsLinkNames } from '../helpers/controller/CaseDetailsHelper';
import { getAppNotifications } from '../helpers/notification/ApplicationNotificationHelper';
import { currentET3StatusFn } from '../helpers/state-sequence';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';
import ET3DataModelUtil from '../utils/ET3DataModelUtil';
import ET3Util from '../utils/ET3Util';

const DAYS_FOR_PROCESSING = 7;
export default class CaseDetailsController {
  public async get(req: AppRequest, res: Response): Promise<void> {
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

    const et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses = await getET3CaseDetailsLinkNames(
      selectedRespondent.et3CaseDetailsLinksStatuses,
      req
    );

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

    const appNotifications: TseNotification = getAppNotifications(
      req.session.userCase.genericTseApplicationCollection,
      req
    );

    res.render(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase: req.session.userCase,
      currentState: currentET3StatusFn(selectedRespondent),
      sections,
      et1FormUrl: setUrlLanguage(req, PageUrls.CLAIMANT_ET1_FORM),
      respondToClaimUrl: setUrlLanguage(req, PageUrls.RESPONDENT_RESPONSE_LANDING),
      selectedRespondent: req.session.userCase.respondents[req.session.selectedRespondentIndex],
      et3Response: setUrlLanguage(req, PageUrls.YOUR_RESPONSE_FORM),
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(req.session.userCase.submittedDate), DAYS_FOR_PROCESSING),
      showAcknowledgementAlert:
        et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.RespondentResponse] === LinkStatus.NOT_STARTED_YET,
      showSavedResponseAlert: req.session.userCase.et3Status === ET3Status.IN_PROGRESS,
      showViewResponseAlert: req.session.userCase.responseReceived === YesOrNo.YES,
      respondentResponseDeadline: ET3DataModelUtil.getRespondentResponseDeadline(req),
      appRequestNotifications: appNotifications.appRequestNotifications,
      appSubmitNotifications: appNotifications.appSubmitNotifications,
      languageParam: getLanguageParam(req.url),
    });
  }
}
