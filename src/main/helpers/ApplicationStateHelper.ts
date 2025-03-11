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
  if (app?.applicantIdamId === user?.id) {
    return LinkStatus.IN_PROGRESS;
  }
  return LinkStatus.NOT_STARTED_YET;
};
