import { UserDetails } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { RespondentTse } from '../../definitions/respondentTse';
import { getApplicationByCode } from '../ApplicationHelper';

export const getRespondentTse = (user: UserDetails, app: GenericTseApplicationTypeItem): RespondentTse => {
  const appType = getApplicationByCode(app.value.type);
  return {
    respondentIdamId: user.id,
    contactApplicationType: app.value.type,
    contactApplicationClaimantType: appType ? appType.claimant : null,
    contactApplicationText: app.value.details,
    contactApplicationFile: app.value.documentUpload,
    copyToOtherPartyYesOrNo: app.value.copyToOtherPartyYesOrNo,
    storedApplicationId: app.id,
  };
};
