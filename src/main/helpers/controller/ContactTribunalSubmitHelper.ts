import { UserDetails } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';

import { isYourApplication } from './YourRequestAndApplicationsHelper';

/**
 * Clear temporary fields stored in session
 * @param userCase session userCase
 */
export const clearTempFields = (userCase: CaseWithId): void => {
  userCase.contactApplicationType = undefined;
  userCase.contactApplicationText = undefined;
  userCase.contactApplicationFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
};

/**
 * Get last application which is just created by user
 * @param apps application collection
 * @param user current user
 */
export const getLatestApplication = (
  apps: GenericTseApplicationTypeItem[],
  user: UserDetails
): GenericTseApplicationTypeItem => {
  const filteredItem = apps?.filter(app => isYourApplication(app.value, user)) || [];
  return filteredItem[filteredItem.length - 1];
};
