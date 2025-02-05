import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import ObjectUtils from '../../utils/ObjectUtils';
import { getLanguageParam } from '../RouterHelpers';

import { isAdminResponseShareToRespondent, isDecisionShareToRespondent } from './ApplicationDetailsHelper';
import { getApplicationDisplayByClaimantCode } from './ContactTribunalHelper';

/**
 * Get claimant's applications
 * @param req request
 */
export const getClaimantsApplications = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const userCase = req.session.userCase;
  const claimantApps = (userCase.genericTseApplicationCollection || []).filter(app => isClaimantAppsShare(app));
  if (ObjectUtils.isEmpty(claimantApps)) {
    return [];
  }

  const url = req.url;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  claimantApps.forEach(app => {
    app.linkValue = getApplicationDisplayByClaimantCode(app.value.type, translations);
    app.redirectUrl = PageUrls.CLAIMANTS_APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(url);
    app.statusColor = linkStatusColorMap.get(<LinkStatus>app.value.applicationState);
    app.displayStatus = translations[app.value.applicationState];
  });
  return claimantApps;
};

/**
 * Check if claimant application is shared to respondent
 * @param app claimant's application
 */
export const isClaimantAppsShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value?.applicant !== Applicant.CLAIMANT) {
    return false;
  }

  if (app.value.type === application.ORDER_WITNESS_ATTEND.code) {
    return false;
  }

  if (app.value?.copyToOtherPartyYesOrNo === YesOrNo.YES) {
    return true;
  }

  if (
    ObjectUtils.isNotEmpty(app.value?.respondCollection) &&
    app.value?.respondCollection?.some((r: TseRespondTypeItem) => {
      return isAdminResponseShareToRespondent(r);
    })
  ) {
    return true;
  }

  if (
    ObjectUtils.isNotEmpty(app.value?.adminDecision) &&
    app.value?.adminDecision?.some((d: TseAdminDecisionItem) => {
      return isDecisionShareToRespondent(d);
    })
  ) {
    return true;
  }

  return false;
};
