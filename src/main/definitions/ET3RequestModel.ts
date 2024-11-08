import { RespondentSumType } from './complexTypes/respondent';

export interface ET3RequestModel {
  caseSubmissionReference: string;
  requestType: string;
  caseTypeId: string;
  caseDetailsLinksSectionId?: string;
  caseDetailsLinksSectionStatus?: string;
  responseHubLinksSectionId?: string;
  responseHubLinksSectionStatus?: string;
  respondent: RespondentSumType;
}
