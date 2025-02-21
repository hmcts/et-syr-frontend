import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecision,
  TseAdminDecisionItem,
  TseRespondType,
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

const isClaimantApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
  return app.value?.applicant === Applicant.CLAIMANT && isApplicationShare(app);
};

/**
 * Check if tribunal response is shared to respondent
 * @param response response
 */
export const isAdminResponseShareToRespondent = (response: TseRespondType): boolean => {
  if (!response) {
    return false;
  }
  return (
    response.from === Applicant.ADMIN &&
    (response.selectPartyNotify === Parties.BOTH_PARTIES || response.selectPartyNotify === Parties.RESPONDENT_ONLY)
  );
};

/**
 * Check if decision is shared to respondent
 * @param decision decision
 */
export const isDecisionShareToRespondent = (decision: TseAdminDecision): boolean => {
  if (!decision) {
    return false;
  }
  return decision.selectPartyNotify === Parties.BOTH_PARTIES || decision.selectPartyNotify === Parties.RESPONDENT_ONLY;
};

/**
 * Check if application is shared to respondent
 * @param app claimant's application
 */
export const isApplicationShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value?.type === application.ORDER_WITNESS_ATTEND.code) {
    return false;
  }

  if (app.value?.copyToOtherPartyYesOrNo === YesOrNo.YES) {
    return true;
  }

  if (
    ObjectUtils.isNotEmpty(app.value?.respondCollection) &&
    app.value?.respondCollection?.some((r: TseRespondTypeItem) => {
      return isAdminResponseShareToRespondent(r.value);
    })
  ) {
    return true;
  }

  return (
    ObjectUtils.isNotEmpty(app.value?.adminDecision) &&
    app.value?.adminDecision?.some((d: TseAdminDecisionItem) => {
      return isDecisionShareToRespondent(d.value);
    })
  );
};
