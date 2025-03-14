import { UserDetails } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { GenericTseApplicationType } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';

import { isResponseToTribunalRequired } from './GenericTseApplicationHelper';
import { isDecisionShareToRespondent } from './controller/ClaimantsApplicationsHelper';
import { isYourApplication } from './controller/YourRequestAndApplicationsHelper';

/**
 * Get application state for current user
 * @param app application
 * @param user current user
 */
export const getApplicationState = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  const existingState = app?.respondentState?.find(state => state.value.userIdamId === user.id);
  if (existingState?.value?.applicationState) {
    return existingState.value.applicationState as LinkStatus;
  }
  return app?.applicantIdamId === user?.id ? LinkStatus.IN_PROGRESS : LinkStatus.NOT_STARTED_YET;
};

/**
 * Get new application state after user viewed in Application Details page
 * @param app application
 * @param user current user
 */
export const getApplicationStatusAfterViewed = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  if (!app || !user) {
    return undefined;
  }

  const existingState = app.respondentState?.find(state => state.value.userIdamId === user.id);
  const currentState: LinkStatus = existingState?.value?.applicationState as LinkStatus;

  if (currentState === LinkStatus.NOT_VIEWED) {
    return LinkStatus.VIEWED;
  }

  if (currentState === LinkStatus.UPDATED) {
    return app.claimantResponseRequired === YesOrNo.YES ? LinkStatus.IN_PROGRESS : LinkStatus.WAITING_FOR_TRIBUNAL;
  }

  if (
    currentState === LinkStatus.NOT_STARTED_YET &&
    isYourApplication(app, user) &&
    isResponseToTribunalRequired(app, user)
  ) {
    return LinkStatus.IN_PROGRESS;
  }

  return undefined;
};

/**
 * Check if application contains current user state
 * @param app application
 * @param user current user
 */
export const isApplicationWithUserState = (app: GenericTseApplicationType, user: UserDetails): boolean => {
  return app?.respondentState?.some(state => state.value?.userIdamId === user.id);
};

/**
 * Get application state if not exist in application
 * @param app
 * @param user
 */
export const getApplicationStateIfNotExist = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  if (isResponseToTribunalRequired(app, user)) {
    return LinkStatus.NOT_STARTED_YET;
  }

  const adminDecisionExist = app.adminDecision?.some(d => isDecisionShareToRespondent(d.value));
  if (adminDecisionExist) {
    return LinkStatus.NOT_VIEWED;
  }

  const isYours = isYourApplication(app, user);
  if (!isYours) {
    return LinkStatus.NOT_STARTED_YET;
  }

  if (app.respondCollection?.length === 0) {
    return LinkStatus.IN_PROGRESS;
  }

  if (app.respondCollection?.some(r => r.value.from === Applicant.ADMIN || r.value.fromIdamId !== user.id)) {
    return LinkStatus.UPDATED;
  }

  return LinkStatus.IN_PROGRESS;
};
