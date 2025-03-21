import { CaseWithId } from './case';

export const enum TypesOfClaim {
  BREACH_OF_CONTRACT = 'breachOfContract',
  DISCRIMINATION = 'discrimination',
  PAY_RELATED_CLAIM = 'payRelated',
  UNFAIR_DISMISSAL = 'unfairDismissal',
  WHISTLE_BLOWING = 'whistleBlowing',
  OTHER_TYPES = 'otherTypesOfClaims',
}

export const enum ClaimOutcomes {
  COMPENSATION = 'compensation',
  TRIBUNAL_RECOMMENDATION = 'tribunal',
  OLD_JOB = 'oldJob',
  ANOTHER_JOB = 'anotherJob',
}

export const enum CaseState {
  DRAFT = 'Draft',
  AWAITING_SUBMISSION_TO_HMCTS = 'AWAITING_SUBMISSION_TO_HMCTS',
  SUBMITTED = 'Submitted',
  ACCEPTED = 'Accepted',
}

export const enum ET3Status {
  NOT_STARTED = 'notStarted',
  IN_PROGRESS = 'inProgress',
  RESPONSE_COMPLETED = 'responseCompleted',
  RESPONSE_ACCEPTED = 'responseAccepted',
  HEARINGS_ESTABLISHED = 'hearingsEstablished',
  CASE_DECIDED = 'caseDecided',
  FINISHED = 'finished',
}

export const enum ClaimTypeDiscrimination {
  AGE = 'Age',
  DISABILITY = 'Disability',
  ETHNICITY = 'Ethnicity',
  GENDER_REASSIGNMENT = 'Gender reassignment',
  MARRIAGE_OR_CIVIL_PARTNERSHIP = 'Marriage or civil partnership',
  PREGNANCY_OR_MATERNITY = 'Pregnancy or maternity',
  RACE = 'Race',
  RELIGION_OR_BELIEF = 'Religion or belief',
  SEX = 'Sex',
  SEXUAL_ORIENTATION = 'Sexual orientation',
}

export const enum ClaimTypePay {
  ARREARS = 'Arrears',
  HOLIDAY_PAY = 'Holiday pay',
  NOTICE_PAY = 'Notice pay',
  REDUNDANCY_PAY = 'Redundancy pay',
  OTHER_PAYMENTS = 'Other payments',
}

export const enum TellUsWhatYouWant {
  COMPENSATION_ONLY = 'compensation',
  TRIBUNAL_RECOMMENDATION = 'tribunal',
  OLD_JOB = 'oldJob',
  ANOTHER_JOB = 'anotherJob',
}

export interface ApplicationTableRecord {
  userCase: CaseWithId;
  respondents: string;
  completionStatus: string;
  url: string;
}

export interface DocumentDetail {
  id: string;
  description: string;
  size?: string;
  mimeType?: string;
  originalDocumentName?: string;
  createdOn?: string;
  type?: string;
}
