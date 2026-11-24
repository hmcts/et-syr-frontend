import { LinkStatus } from './links';

enum RepResponseSectionKey {
  YourDetails = 'yourDetails',
  AboutRespondent = 'aboutRespondent',
  AboutClaimant = 'aboutClaimant',
  GiveResponse = 'giveResponse',
  CheckAndSubmit = 'checkAndSubmit',
}

export enum RepResponseTaskKey {
  YourContactDetails = 'yourContactDetails',
  YourPreferences = 'yourPreferences',
  RespondentContactDetails = 'respondentContactDetails',
  ConciliationAndEmployeeDetails = 'conciliationAndEmployeeDetails',
  PayPensionBenefitDetails = 'payPensionBenefitDetails',
  ContestClaim = 'contestClaim',
  EmployersContractClaim = 'employersContractClaim',
  CheckYourAnswers = 'checkYourAnswers',
}

export type SectionConfig = {
  section: RepResponseSectionKey;
  tasks: RepResponseTaskKey[];
};

export const REP_RESPONSE_TASKS_BY_SECTION: SectionConfig[] = [
  {
    section: RepResponseSectionKey.YourDetails,
    tasks: [RepResponseTaskKey.YourContactDetails, RepResponseTaskKey.YourPreferences],
  },
  {
    section: RepResponseSectionKey.AboutRespondent,
    tasks: [RepResponseTaskKey.RespondentContactDetails],
  },
  {
    section: RepResponseSectionKey.AboutClaimant,
    tasks: [RepResponseTaskKey.ConciliationAndEmployeeDetails, RepResponseTaskKey.PayPensionBenefitDetails],
  },
  {
    section: RepResponseSectionKey.GiveResponse,
    tasks: [RepResponseTaskKey.ContestClaim, RepResponseTaskKey.EmployersContractClaim],
  },
  {
    section: RepResponseSectionKey.CheckAndSubmit,
    tasks: [RepResponseTaskKey.CheckYourAnswers],
  },
];

export const DEFAULT_REP_TASK_STATUS: Record<RepResponseTaskKey, LinkStatus> = {
  [RepResponseTaskKey.YourContactDetails]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.YourPreferences]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.RespondentContactDetails]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.ConciliationAndEmployeeDetails]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.PayPensionBenefitDetails]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.ContestClaim]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.EmployersContractClaim]: LinkStatus.NOT_STARTED_YET,
  [RepResponseTaskKey.CheckYourAnswers]: LinkStatus.CANNOT_START_YET,
};
