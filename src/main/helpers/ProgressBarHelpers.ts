import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { AnyRecord } from '../definitions/util-types';

export interface ProgressBarItem {
  label: {
    text?: string;
  };
  complete?: boolean;
  active?: boolean;
}

const enum ActiveState {
  CLAIM_ACCEPTED = 'claimAccepted',
  RESPONSE_ACCEPTED = 'responseAccepted',
  HEARING_DETAILS = 'hearingDetails',
  CASE_DECISION = 'caseDecision',
}

const enum Et3ResponseStatus {
  ET3_RESPONSE_STATUS_ACCEPTED = 'Accepted',
}

/**
 * build items for displaying progress bar status
 * @param respondent selected respondent
 * @param userCase current user case
 * @param translations translation mapping
 */
export const getProgressBarItems = (
  respondent: RespondentET3Model,
  userCase: CaseWithId,
  translations: AnyRecord
): ProgressBarItem[] => {
  const isRespondAccepted: boolean = respondent?.responseStatus === Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED;
  const hasHearing: boolean = userCase.hearingCollection?.length > 0;
  const isDecisionAdded: boolean = userCase.judgementCollection?.length > 0;
  const activePoint = getActivePoint(isRespondAccepted, hasHearing, isDecisionAdded);
  return [
    addProgressBarItem(translations.claimAccepted, true, activePoint === ActiveState.CLAIM_ACCEPTED),
    addProgressBarItem(translations.responseAccepted, isRespondAccepted, activePoint === ActiveState.RESPONSE_ACCEPTED),
    addProgressBarItem(translations.hearingDetails, hasHearing, activePoint === ActiveState.HEARING_DETAILS),
    addProgressBarItem(translations.caseDecision, isDecisionAdded, activePoint === ActiveState.CASE_DECISION),
  ];
};

const getActivePoint = (isRespondAccepted: boolean, hasHearing: boolean, isDecisionAdded: boolean): ActiveState => {
  if (isDecisionAdded) {
    return ActiveState.CASE_DECISION;
  } else if (hasHearing) {
    return ActiveState.HEARING_DETAILS;
  } else if (isRespondAccepted) {
    return ActiveState.RESPONSE_ACCEPTED;
  } else {
    return ActiveState.CLAIM_ACCEPTED;
  }
};

const addProgressBarItem = (labelText: string, isComplete: boolean, isActive: boolean): ProgressBarItem => {
  return {
    label: {
      text: labelText,
    },
    complete: isComplete,
    active: isActive,
  };
};
