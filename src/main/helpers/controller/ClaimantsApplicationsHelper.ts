import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import ObjectUtils from '../../utils/ObjectUtils';

import { updateAppsDisplayInfo } from './YourRequestAndApplicationsHelper';

/**
 * Get claimant's applications
 * @param req request
 */
export const getClaimantsApplications = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const claimantApps = (req.session.userCase.genericTseApplicationCollection || []).filter(app =>
    isClaimantApplicationShare(app)
  );
  return updateAppsDisplayInfo(claimantApps, req);
};

/**
 * Check if tribunal response is shared to respondent
 * @param response response
 */
export const isAdminResponseShareToRespondent = (response: TseRespondTypeItem): boolean => {
  return (
    response.value?.from === Applicant.ADMIN &&
    (response.value?.selectPartyNotify === Parties.BOTH_PARTIES ||
      response.value?.selectPartyNotify === Parties.RESPONDENT_ONLY)
  );
};

/**
 * Check if decision is shared to respondent
 * @param decision decision
 */
export const isDecisionShareToRespondent = (decision: TseAdminDecisionItem): boolean => {
  return (
    decision.value?.selectPartyNotify === Parties.BOTH_PARTIES ||
    decision.value?.selectPartyNotify === Parties.RESPONDENT_ONLY
  );
};

/**
 * Check if application is shared to respondent
 * @param app claimant's application
 */
export const isApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
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

  return (
    ObjectUtils.isNotEmpty(app.value?.adminDecision) &&
    app.value?.adminDecision?.some((d: TseAdminDecisionItem) => {
      return isDecisionShareToRespondent(d);
    })
  );
};

/**
 * Check if claimant's application is shared to respondent
 * @param app selected application
 */
export const isClaimantApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value?.applicant !== Applicant.CLAIMANT) {
    return false;
  }
  return isApplicationShare(app);
};
