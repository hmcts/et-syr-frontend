import { LinkStatus } from './links';

enum RepET3SectionKey {
  YourDetails = 'yourDetails',
  AboutRespondent = 'aboutRespondent',
  AboutClaimant = 'aboutClaimant',
  GiveResponse = 'giveResponse',
  CheckAndSubmit = 'checkAndSubmit',
}

export enum RepET3TaskKey {
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
  section: RepET3SectionKey;
  tasks: RepET3TaskKey[];
};

export const REP_ET3_TASKS_BY_SECTION: SectionConfig[] = [
  {
    section: RepET3SectionKey.YourDetails,
    tasks: [RepET3TaskKey.YourContactDetails, RepET3TaskKey.YourPreferences],
  },
  {
    section: RepET3SectionKey.AboutRespondent,
    tasks: [RepET3TaskKey.RespondentContactDetails],
  },
  {
    section: RepET3SectionKey.AboutClaimant,
    tasks: [RepET3TaskKey.ConciliationAndEmployeeDetails, RepET3TaskKey.PayPensionBenefitDetails],
  },
  {
    section: RepET3SectionKey.GiveResponse,
    tasks: [RepET3TaskKey.ContestClaim, RepET3TaskKey.EmployersContractClaim],
  },
  {
    section: RepET3SectionKey.CheckAndSubmit,
    tasks: [RepET3TaskKey.CheckYourAnswers],
  },
];

export const DEFAULT_REP_TASK_STATUS: Record<RepET3TaskKey, LinkStatus> = {
  [RepET3TaskKey.YourContactDetails]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.YourPreferences]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.RespondentContactDetails]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.ConciliationAndEmployeeDetails]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.PayPensionBenefitDetails]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.ContestClaim]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.EmployersContractClaim]: LinkStatus.NOT_STARTED_YET,
  [RepET3TaskKey.CheckYourAnswers]: LinkStatus.CANNOT_START_YET,
};
