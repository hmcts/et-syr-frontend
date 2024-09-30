import { RespondentType } from './complexTypes/respondent';

export interface Et3Request {
  caseId: string;
  requestType: string;
  caseType: string;
  respondent: RespondentType;
}
