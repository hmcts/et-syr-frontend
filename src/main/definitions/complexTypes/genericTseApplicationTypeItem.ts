import { Document, YesOrNo } from '../case';

import { DocumentTypeItem } from './documentTypeItem';

export interface GenericTseApplicationTypeItem {
  id?: string;
  value?: GenericTseApplicationType;
}

export interface GenericTseApplicationType {
  applicant?: string;
  applicantIdamId?: string;
  date?: string;
  type?: string;
  copyToOtherPartyText?: string;
  copyToOtherPartyYesOrNo?: YesOrNo;
  details?: string;
  documentUpload?: Document;
  number?: string;
  respondCollection?: TseRespondTypeItem[];
  responsesCount?: string;
  status?: string;
  dueDate?: string;
  applicationState?: string; // used for CUI and so viewed/not viewed refers to claimant
  respondentState?: TseStatusTypeItem[];
  respondentResponseRequired?: string;
  claimantResponseRequired?: string;
  adminDecision?: TseAdminDecisionItem[];
}

export interface TseStatusTypeItem {
  id: string;
  value: TseStatusType;
}

export interface TseStatusType {
  userIdamId: string;
  applicationState: string;
}

export interface TseAdminDecisionItem {
  id?: string;
  value?: TseAdminDecision;
}

export interface TseAdminDecision {
  date?: string;
  decision?: string;
  decisionMadeBy?: string;
  typeOfDecision?: string;
  selectPartyNotify?: string;
  responseRequiredDoc?: DocumentTypeItem[];
  additionalInformation?: string;
  decisionMadeByFullName?: string;
  enterNotificationTitle?: string;
  decisionState?: string;
}

export interface TseRespondTypeItem {
  id?: string;
  value?: TseRespondType;
}

export interface TseRespondType {
  // Generic
  from?: string;
  date?: string;
  status?: string;
  // Respondent / Claimant Reply
  fromIdamId?: string;
  response?: string;
  copyToOtherParty?: string;
  hasSupportingMaterial?: YesOrNo;
  supportingMaterial?: TseRespondSupportingMaterialItem[];
  copyNoGiveDetails?: string;
  // Admin Reply
  addDocument?: DocumentTypeItem[];
  additionalInformation?: string;
  enterResponseTitle?: string;
  isCmoOrRequest?: string;
  cmoMadeBy?: string;
  requestMadeBy?: string;
  madeByFullName?: string;
  isResponseRequired?: string;
  selectPartyRespond?: string;
  selectPartyNotify?: string;
  viewedByClaimant?: string;
  // Work Allocation enablers
  dateTime?: string;
}

export interface TseRespondSupportingMaterialItem {
  id?: string;
  value?: TseRespondSupportingMaterial;
}

export interface TseRespondSupportingMaterial {
  uploadedDocument?: Document;
}

export const sortByDate = (a: GenericTseApplicationTypeItem, b: GenericTseApplicationTypeItem): number => {
  const da = new Date(a.value.date),
    db = new Date(b.value.date);
  return da.valueOf() - db.valueOf();
};
