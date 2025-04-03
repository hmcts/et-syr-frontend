import { AppRequest } from '../../definitions/appRequest';
import { ApplicationList } from '../../definitions/applicationList';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationType,
  TseAdminDecision,
  TseAdminDecisionItem,
  TseRespondType,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesNotify } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import ObjectUtils from '../../utils/ObjectUtils';
import { isApplicantClaimant } from '../GenericTseApplicationHelper';

import { updateAppsDisplayInfo } from './YourRequestAndApplicationsHelper';

/**
 * Get claimant's applications
 * @param req request
 */
export const getClaimantsApplications = (req: AppRequest): ApplicationList[] => {
  const claimantApps = (req.session.userCase.genericTseApplicationCollection || []).filter(app =>
    isClaimantApplicationShare(app.value)
  );
  return updateAppsDisplayInfo(claimantApps, req);
};

/**
 * Check if claimant's application is shared to other party
 * @param app application
 */
export const isClaimantApplicationShare = (app: GenericTseApplicationType): boolean => {
  return isApplicantClaimant(app) && isApplicationShare(app);
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
    (response.selectPartyNotify === PartiesNotify.BOTH_PARTIES ||
      response.selectPartyNotify === PartiesNotify.RESPONDENT_ONLY)
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
  return (
    decision.selectPartyNotify === PartiesNotify.BOTH_PARTIES ||
    decision.selectPartyNotify === PartiesNotify.RESPONDENT_ONLY
  );
};

/**
 * Check if application is shared to respondent
 * @param app claimant's application
 */
export const isApplicationShare = (app: GenericTseApplicationType): boolean => {
  if (
    app.type === application.ORDER_WITNESS_ATTEND.code ||
    app.type === application.ORDER_WITNESS_ATTEND.claimant ||
    app.type === application.ORDER_WITNESS_ATTEND.claimantLegalRep
  ) {
    return false;
  }

  if (app.copyToOtherPartyYesOrNo === YesOrNo.YES) {
    return true;
  }

  if (
    ObjectUtils.isNotEmpty(app.respondCollection) &&
    app.respondCollection?.some((r: TseRespondTypeItem) => {
      return isAdminResponseShareToRespondent(r.value);
    })
  ) {
    return true;
  }

  return (
    ObjectUtils.isNotEmpty(app.adminDecision) &&
    app.adminDecision?.some((d: TseAdminDecisionItem) => {
      return isDecisionShareToRespondent(d.value);
    })
  );
};
