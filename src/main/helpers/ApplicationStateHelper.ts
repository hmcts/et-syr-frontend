import { UserDetails } from '../definitions/appRequest';
import { GenericTseApplicationType } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { LinkStatus } from '../definitions/links';
import CollectionUtils from '../utils/CollectionUtils';

/**
 * Get application state for current user
 * @param app application
 * @param user current user
 */
export const getApplicationState = (app: GenericTseApplicationType, user: UserDetails): LinkStatus => {
  if (CollectionUtils.isNotEmpty(app.respondentState)) {
    const existingState = app.respondentState.find(state => state.userIdamId === user.id);
    if (existingState) {
      return <LinkStatus>existingState.applicationState;
    }
  }
  return LinkStatus.NOT_VIEWED;
};

/**
 * Update application state for current user
 * @param app application
 * @param user current user
 * @param newState new application state to update
 */
export const changeApplicationState = (
  app: GenericTseApplicationType,
  user: UserDetails,
  newState: LinkStatus
): void => {
  app.respondentState ??= [];
  const existingState = app.respondentState.find(state => state.userIdamId === user.id);
  existingState
    ? (existingState.applicationState = newState)
    : app.respondentState.push({ userIdamId: user.id, applicationState: newState });
};
