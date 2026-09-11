import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { ET3HubLinkNames } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import CollectionUtils from '../utils/CollectionUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';

/**
 * A question the respondent has to answer before the section it belongs to can be marked as completed.
 * Every other question in the ET3 journey is optional, so the respondent is only ever stopped by these.
 */
export interface MandatoryQuestion {
  /** Key under `mandatoryQuestions` in the check-your-answers-et3-common translations. */
  translationKey: string;
  /** Page the question is answered on. */
  pageUrl: string;
  isAnswered: (userCase: CaseWithId) => boolean;
}

const contactDetailsMandatoryQuestions: MandatoryQuestion[] = [
  {
    translationKey: 'respondentNameQuestion',
    pageUrl: PageUrls.RESPONDENT_NAME,
    isAnswered: userCase => StringUtils.isNotBlank(userCase?.responseRespondentNameQuestion),
  },
  {
    translationKey: 'respondentName',
    pageUrl: PageUrls.RESPONDENT_NAME,
    isAnswered: userCase =>
      userCase?.responseRespondentNameQuestion !== YesOrNo.NO ||
      StringUtils.isNotBlank(userCase?.responseRespondentName),
  },
  {
    translationKey: 'respondentAddressQuestion',
    pageUrl: PageUrls.RESPONDENT_ADDRESS,
    isAnswered: userCase => StringUtils.isNotBlank(userCase?.et3IsRespondentAddressCorrect),
  },
  {
    translationKey: 'respondentAddressPostCode',
    pageUrl: PageUrls.RESPONDENT_ADDRESS,
    isAnswered: userCase =>
      userCase?.et3IsRespondentAddressCorrect !== YesOrNo.NO ||
      StringUtils.isNotBlank(userCase?.responseRespondentAddressPostCode),
  },
];

const contestClaimMandatoryQuestions: MandatoryQuestion[] = [
  {
    translationKey: 'contestClaim',
    pageUrl: PageUrls.RESPONDENT_CONTEST_CLAIM,
    isAnswered: userCase => StringUtils.isNotBlank(userCase?.et3ResponseRespondentContestClaim),
  },
  {
    translationKey: 'contestClaimDetails',
    pageUrl: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
    isAnswered: userCase =>
      userCase?.et3ResponseRespondentContestClaim !== YesOrNo.YES ||
      StringUtils.isNotBlank(userCase?.et3ResponseContestClaimDetails) ||
      CollectionUtils.isNotEmpty(userCase?.et3ResponseContestClaimDocument),
  },
];

const employersContractClaimMandatoryQuestions: MandatoryQuestion[] = [
  {
    translationKey: 'employersContractClaimDetails',
    pageUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
    isAnswered: userCase =>
      userCase?.et3ResponseEmployerClaim !== YesOrNo.YES ||
      StringUtils.isNotBlank(userCase?.et3ResponseEmployerClaimDetails) ||
      ObjectUtils.isNotEmpty(userCase?.et3ResponseEmployerClaimDocument),
  },
];

/**
 * Sections that are not listed here (hearing format and employer details, early conciliation and employee
 * details, pay pension and benefits) have no mandatory questions at all.
 */
const mandatoryQuestionsBySection: Map<string, MandatoryQuestion[]> = new Map<string, MandatoryQuestion[]>([
  [ET3HubLinkNames.ContactDetails, contactDetailsMandatoryQuestions],
  [ET3HubLinkNames.ContestClaim, contestClaimMandatoryQuestions],
  [ET3HubLinkNames.EmployersContractClaim, employersContractClaimMandatoryQuestions],
]);

export const getUnansweredMandatoryQuestions = (userCase: CaseWithId, section: string): MandatoryQuestion[] =>
  (mandatoryQuestionsBySection.get(section) ?? []).filter(question => !question.isAnswered(userCase));

/**
 * A section can only be marked as completed once all of its mandatory questions have been answered.
 */
export const isSectionComplete = (userCase: CaseWithId, section: string): boolean =>
  getUnansweredMandatoryQuestions(userCase, section).length === 0;

export const getAllUnansweredMandatoryQuestions = (userCase: CaseWithId): MandatoryQuestion[] =>
  [...mandatoryQuestionsBySection.keys()].flatMap(section => getUnansweredMandatoryQuestions(userCase, section));

/**
 * The response cannot be submitted while any mandatory question is still unanswered.
 */
export const areAllMandatoryQuestionsAnswered = (userCase: CaseWithId): boolean =>
  getAllUnansweredMandatoryQuestions(userCase).length === 0;

/**
 * Converts unanswered mandatory questions into error summary entries linking to the page each one is
 * answered on. The intercept path is the same one the section's change links use, so the respondent is
 * returned to the page they were sent from once they have answered.
 */
export const getMandatoryQuestionErrorSummaryItems = (
  questions: MandatoryQuestion[],
  translations: AnyRecord,
  interceptPath: string
): { text: string; href: string }[] =>
  questions.map(question => ({
    text: translations?.mandatoryQuestions?.[question.translationKey],
    href: question.pageUrl + interceptPath,
  }));
