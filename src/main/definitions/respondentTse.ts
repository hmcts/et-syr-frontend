import { Document, YesOrNo } from './case';

export interface RespondentTse {
  respondentIdamId: string;
  contactApplicationType: string;
  contactApplicationClaimantType?: string;
  contactApplicationText?: string;
  contactApplicationFile?: Document;
  copyToOtherPartyYesOrNo: YesOrNo;
  copyToOtherPartyText?: string;
  storedApplicationId?: string;
}
