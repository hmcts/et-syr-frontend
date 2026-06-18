import { CaseWithId, RespondentET3Model } from '../../../main/definitions/case';
import { ProgressBarItem, getProgressBarItems } from '../../../main/helpers/ProgressBarHelpers';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import mockUserCase from '../mocks/mockUserCase';

describe('Progress bar state sequence tests', () => {
  const translations = {
    claimAccepted: 'Claim accepted',
    responseAccepted: 'Response accepted',
    hearingDetails: 'View details of your hearings',
    caseDecision: 'Case decision',
  };

  it('Should return Progress Bar = claimAccepted', () => {
    const actual = getProgressBarItems(mockRespondentET3Model, mockUserCase, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Response accepted' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'View details of your hearings' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Case decision' },
        complete: false,
        active: false,
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('Should return Progress Bar = responseAccepted', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      responseStatus: 'Accepted',
    };
    const actual = getProgressBarItems(mockedRespondent, mockUserCase, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response accepted' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'View details of your hearings' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Case decision' },
        complete: false,
        active: false,
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('Should return Progress Bar = hearingsListed', () => {
    const mockUserCaseData: CaseWithId = {
      ...mockUserCase,
      hearingCollection: mockHearingCollection,
    };
    const actual = getProgressBarItems(mockRespondentET3Model, mockUserCaseData, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response accepted' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'View details of your hearings' },
        complete: true,
        active: true,
      },
      {
        label: { text: 'Case decision' },
        complete: false,
        active: false,
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('Should return Progress Bar = decisionAdded', () => {
    const mockUserCaseData: CaseWithId = {
      ...mockUserCase,
      judgementCollection: [{ id: '1' }],
    };
    const actual = getProgressBarItems(mockRespondentET3Model, mockUserCaseData, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response accepted' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'View details of your hearings' },
        complete: false,
        active: false,
      },
      {
        label: { text: 'Case decision' },
        complete: true,
        active: true,
      },
    ];
    expect(actual).toEqual(expected);
  });
});
