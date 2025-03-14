import { UserDetails } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { GenericTseApplicationType } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { LinkStatus } from '../definitions/links';
import CollectionUtils from '../utils/CollectionUtils';

import { isResponseToTribunalRequired } from './GenericTseApplicationHelper';
import { isYourApplication } from './controller/YourRequestAndApplicationsHelper';

/**
 * Get application state for current user
 * @param app application
 * @param user current user
 */
export const getApplicationState = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  if (CollectionUtils.isNotEmpty(app.respondentState)) {
    const existingState = app.respondentState.find(state => state.value.userIdamId === user.id);
    if (existingState) {
      return <LinkStatus>existingState.value.applicationState;
    }
  }
  return app?.applicantIdamId === user?.id ? LinkStatus.IN_PROGRESS : LinkStatus.NOT_STARTED_YET;
};

/**
 * Get new application state after user viewed in Application Details page
 * @param app application
 * @param user current user
 */
export const getApplicationStatusAfterViewed = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  const currentState: LinkStatus = getApplicationState(app, user);
  if (currentState === LinkStatus.NOT_VIEWED) {
    return LinkStatus.VIEWED;
  } else if (currentState === LinkStatus.UPDATED) {
    return app.claimantResponseRequired === YesOrNo.YES ? LinkStatus.IN_PROGRESS : LinkStatus.WAITING_FOR_TRIBUNAL;
  } else if (
    currentState === LinkStatus.NOT_STARTED_YET &&
    isYourApplication(app, user) &&
    isResponseToTribunalRequired(app, user)
  ) {
    return LinkStatus.IN_PROGRESS;
  } else if (!app.respondentState.some(state => state.value.userIdamId === user.id)) {
    return currentState;
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
