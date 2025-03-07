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
    const existingState = app.respondentState.find(state => state.value.userIdamId === user.id);
    if (existingState) {
      return <LinkStatus>existingState.value.applicationState;
    }
  }
  return LinkStatus.NOT_VIEWED;
};
