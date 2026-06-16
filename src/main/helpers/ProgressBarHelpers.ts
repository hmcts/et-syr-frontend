import { RespondentET3Model } from '../definitions/case';
import { ET3Status } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';

export interface ProgressBarItem {
  label: {
    text?: string;
  };
  complete?: boolean;
  active?: boolean;
}

const ET3_STATUS_ORDER: ET3Status[] = [
  ET3Status.NOT_STARTED,
  ET3Status.IN_PROGRESS,
  ET3Status.ET3_COMPLETED,
  ET3Status.RESPONSE_ACCEPTED,
  ET3Status.HEARINGS_LISTED,
  ET3Status.DECISION_ADDED,
];

const toKnownStatus = (state?: string): ET3Status => {
  return ET3_STATUS_ORDER.includes(state as ET3Status) ? (state as ET3Status) : ET3Status.IN_PROGRESS;
};

const statusIndex = (state: ET3Status): number => ET3_STATUS_ORDER.indexOf(state as ET3Status);

const isBefore = (activeState: ET3Status, targetState: ET3Status): boolean => {
  return statusIndex(activeState) < statusIndex(targetState);
};

const isAtOrAfter = (activeState: ET3Status, targetState: ET3Status): boolean => {
  return statusIndex(activeState) >= statusIndex(targetState);
};

const isCurrent = (activeState: ET3Status, targetState: ET3Status): boolean => {
  return statusIndex(activeState) === statusIndex(targetState);
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

export const getProgressBarItems = (respondent: RespondentET3Model, translations: AnyRecord): ProgressBarItem[] => {
  const progressBarItem: ProgressBarItem[] = [];

  const activeState: ET3Status = toKnownStatus(respondent?.et3Status);

  progressBarItem.push(
    addProgressBarItem(
      translations.claimAccepted,
      isAtOrAfter(activeState, ET3Status.NOT_STARTED),
      isBefore(activeState, ET3Status.RESPONSE_ACCEPTED)
    )
  );

  progressBarItem.push(
    addProgressBarItem(
      translations.responseAccepted,
      isAtOrAfter(activeState, ET3Status.RESPONSE_ACCEPTED),
      isCurrent(activeState, ET3Status.RESPONSE_ACCEPTED)
    )
  );

  progressBarItem.push(
    addProgressBarItem(
      translations.hearingDetails,
      isAtOrAfter(activeState, ET3Status.HEARINGS_LISTED),
      isCurrent(activeState, ET3Status.HEARINGS_LISTED)
    )
  );

  progressBarItem.push(
    addProgressBarItem(
      translations.caseDecision,
      isAtOrAfter(activeState, ET3Status.DECISION_ADDED),
      isCurrent(activeState, ET3Status.DECISION_ADDED)
    )
  );

  return progressBarItem;
};
