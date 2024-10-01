import { RespondentType } from './complexTypes/respondent';

export interface ET3Request {
  caseId: string;
  requestType: string;
  caseType: string;
  respondent: RespondentType;
}
