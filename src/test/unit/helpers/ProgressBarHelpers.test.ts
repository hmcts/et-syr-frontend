import { RespondentET3Model } from '../../../main/definitions/case';
import { ET3Status } from '../../../main/definitions/definition';
import { ProgressBarItem, getProgressBarItems } from '../../../main/helpers/ProgressBarHelpers';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';

describe('Progress bar state sequence tests', () => {
  const translations = {
    claimAccepted: 'Claim accepted',
    responseAccepted: 'Response accepted',
    hearingDetails: 'View details of your hearings',
    caseDecision: 'Case decision',
  };

  it('Should return Progress Bar when et3Status = inProgress', () => {
    const actual = getProgressBarItems(mockRespondentET3Model, translations);
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

  it('Should return Progress Bar when et3Status = responseAccepted', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      et3Status: ET3Status.RESPONSE_ACCEPTED,
    };
    const actual = getProgressBarItems(mockedRespondent, translations);
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

  it('Should return Progress Bar when et3Status = hearingsListed', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      et3Status: ET3Status.HEARINGS_LISTED,
    };
    const actual = getProgressBarItems(mockedRespondent, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response accepted' },
        complete: true,
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

  it('Should return Progress Bar when et3Status = decisionAdded', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      et3Status: ET3Status.DECISION_ADDED,
    };
    const actual = getProgressBarItems(mockedRespondent, translations);
    const expected: ProgressBarItem[] = [
      {
        label: { text: 'Claim accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'Response accepted' },
        complete: true,
        active: false,
      },
      {
        label: { text: 'View details of your hearings' },
        complete: true,
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

  it('Should return Progress Bar when et3Status = undefined', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      et3Status: undefined,
    };
    const actual = getProgressBarItems(mockedRespondent, translations);
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

  it('Should return Progress Bar when et3Status = bad value', () => {
    const mockedRespondent: RespondentET3Model = {
      ...mockRespondentET3Model,
      et3Status: 'Test',
    };
    const actual = getProgressBarItems(mockedRespondent, translations);
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
});
