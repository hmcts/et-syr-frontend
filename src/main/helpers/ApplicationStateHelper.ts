import { UserDetails } from '../definitions/appRequest';
import { GenericTseApplicationType } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { LinkStatus } from '../definitions/links';
import CollectionUtils from '../utils/CollectionUtils';

import { isResponseToTribunalRequired } from './GenericTseApplicationHelper';

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
  if (app?.applicantIdamId === user?.id) {
    return LinkStatus.IN_PROGRESS;
  }
  return LinkStatus.NOT_STARTED_YET;
};

/**
 * Get new application state after viewed
 * @param app application
 * @param user current user
 */
export const getApplicationStatusAfterViewed = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  const currentState = getApplicationState(app, user);
  if (currentState === LinkStatus.NOT_VIEWED) {
    return LinkStatus.VIEWED;
  } else if (currentState === LinkStatus.UPDATED) {
    return LinkStatus.IN_PROGRESS;
  } else if (currentState === LinkStatus.NOT_STARTED_YET && isResponseToTribunalRequired(app, user)) {
    return LinkStatus.IN_PROGRESS;
  }
  return undefined;
};
