import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../main/definitions/constants';
import { ET3HubLinkNames } from '../../../main/definitions/links';
import {
  areAllMandatoryQuestionsAnswered,
  getAllUnansweredMandatoryQuestions,
  getMandatoryQuestionErrorSummaryItems,
  getUnansweredMandatoryQuestions,
  isSectionComplete,
} from '../../../main/helpers/ET3MandatoryQuestionHelper';
import { mockCaseWithIdWithMandatoryQuestionsAnswered } from '../mocks/mockCaseWithId';

describe('ET3MandatoryQuestionHelper', () => {
  const answeredUserCase = (): CaseWithId => ({ ...mockCaseWithIdWithMandatoryQuestionsAnswered });

  describe('contact details section', () => {
    it('is complete when the respondent name and address questions are answered', () => {
      expect(isSectionComplete(answeredUserCase(), ET3HubLinkNames.ContactDetails)).toBe(true);
    });

    it('is incomplete when the respondent name question is unanswered', () => {
      const userCase = answeredUserCase();
      userCase.responseRespondentNameQuestion = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContactDetails);

      expect(unanswered.map(question => question.translationKey)).toEqual(['respondentNameQuestion']);
    });

    it('is incomplete when the name is said to be wrong but no correct name is given', () => {
      const userCase = answeredUserCase();
      userCase.responseRespondentNameQuestion = YesOrNo.NO;
      userCase.responseRespondentName = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContactDetails);

      expect(unanswered.map(question => question.translationKey)).toEqual(['respondentName']);
    });

    it('is incomplete when the address is said to be wrong but no postcode is given', () => {
      const userCase = answeredUserCase();
      userCase.et3IsRespondentAddressCorrect = YesOrNo.NO;
      userCase.responseRespondentAddressPostCode = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContactDetails);

      expect(unanswered.map(question => question.translationKey)).toEqual(['respondentAddressPostCode']);
    });

    it('does not need a postcode when the address given on the ET1 is correct', () => {
      const userCase = answeredUserCase();
      userCase.et3IsRespondentAddressCorrect = YesOrNo.YES;
      userCase.responseRespondentAddressPostCode = undefined;

      expect(isSectionComplete(userCase, ET3HubLinkNames.ContactDetails)).toBe(true);
    });
  });

  describe('contest claim section', () => {
    it('is complete when the claim is not contested', () => {
      expect(isSectionComplete(answeredUserCase(), ET3HubLinkNames.ContestClaim)).toBe(true);
    });

    it('is incomplete when the contest claim question is unanswered', () => {
      const userCase = answeredUserCase();
      userCase.et3ResponseRespondentContestClaim = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContestClaim);

      expect(unanswered.map(question => question.translationKey)).toEqual(['contestClaim']);
    });

    it('is incomplete when the claim is contested without details or documents', () => {
      const userCase = answeredUserCase();
      userCase.et3ResponseRespondentContestClaim = YesOrNo.YES;
      userCase.et3ResponseContestClaimDetails = undefined;
      userCase.et3ResponseContestClaimDocument = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContestClaim);

      expect(unanswered.map(question => question.translationKey)).toEqual(['contestClaimDetails']);
    });

    it('is complete when the reason for contesting is uploaded as a document', () => {
      const userCase = answeredUserCase();
      userCase.et3ResponseRespondentContestClaim = YesOrNo.YES;
      userCase.et3ResponseContestClaimDetails = undefined;
      userCase.et3ResponseContestClaimDocument = [{ id: '1', value: {} }];

      expect(isSectionComplete(userCase, ET3HubLinkNames.ContestClaim)).toBe(true);
    });
  });

  describe("employer's contract claim section", () => {
    it('is complete when no contract claim is being made', () => {
      expect(isSectionComplete(answeredUserCase(), ET3HubLinkNames.EmployersContractClaim)).toBe(true);
    });

    it('is incomplete when a contract claim is made without background and details', () => {
      const userCase = answeredUserCase();
      userCase.et3ResponseEmployerClaim = YesOrNo.YES;
      userCase.et3ResponseEmployerClaimDetails = undefined;
      userCase.et3ResponseEmployerClaimDocument = undefined;

      const unanswered = getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.EmployersContractClaim);

      expect(unanswered.map(question => question.translationKey)).toEqual(['employersContractClaimDetails']);
    });
  });

  describe('sections without mandatory questions', () => {
    it.each([
      ET3HubLinkNames.EmployerDetails,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      ET3HubLinkNames.PayPensionBenefitDetails,
    ])('treats %s as complete whatever has been answered', section => {
      expect(isSectionComplete({} as CaseWithId, section)).toBe(true);
    });
  });

  describe('across every section', () => {
    it('allows the response to be submitted when all mandatory questions are answered', () => {
      expect(areAllMandatoryQuestionsAnswered(answeredUserCase())).toBe(true);
    });

    it('collects the unanswered questions of every section', () => {
      const userCase = answeredUserCase();
      userCase.responseRespondentNameQuestion = undefined;
      userCase.et3ResponseRespondentContestClaim = undefined;

      expect(getAllUnansweredMandatoryQuestions(userCase).map(question => question.translationKey)).toEqual([
        'respondentNameQuestion',
        'contestClaim',
      ]);
      expect(areAllMandatoryQuestionsAnswered(userCase)).toBe(false);
    });
  });

  describe('getMandatoryQuestionErrorSummaryItems', () => {
    it('links each unanswered question to the page it is answered on', () => {
      const userCase = answeredUserCase();
      userCase.responseRespondentNameQuestion = undefined;
      const translations = { mandatoryQuestions: { respondentNameQuestion: 'Enter the respondent name' } };

      const items = getMandatoryQuestionErrorSummaryItems(
        getUnansweredMandatoryQuestions(userCase, ET3HubLinkNames.ContactDetails),
        translations,
        InterceptPaths.CONTACT_DETAILS_CHANGE
      );

      expect(items).toEqual([
        {
          text: 'Enter the respondent name',
          href: PageUrls.RESPONDENT_NAME + InterceptPaths.CONTACT_DETAILS_CHANGE,
        },
      ]);
    });
  });
});
