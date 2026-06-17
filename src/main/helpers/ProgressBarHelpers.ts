import { RespondentET3Model } from '../definitions/case';
import { ET3Status } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';

/**
 * hmctsProgressBar items interface
 */
export interface ProgressBarItem {
  label: {
    text?: string;
  };
  complete?: boolean;
  active?: boolean;
}

/**
 * order of ET3 status
 */
const ET3_STATUS_ORDER: ET3Status[] = [
  ET3Status.IN_PROGRESS,
  ET3Status.ET3_COMPLETED,
  ET3Status.RESPONSE_ACCEPTED,
  ET3Status.HEARINGS_LISTED,
  ET3Status.DECISION_ADDED,
];

/**
 * build items for displaying progress bar status
 * @param respondent selected respondent
 * @param translations translation mapping
 */
export const getProgressBarItems = (respondent: RespondentET3Model, translations: AnyRecord): ProgressBarItem[] => {
  const activeState: ET3Status = toKnownStatus(respondent?.et3Status);
  return [
    addProgressBarItem(translations.claimAccepted, true, isBefore(activeState, ET3Status.RESPONSE_ACCEPTED)),
    addProgressBarItem(
      translations.responseAccepted,
      isAtOrAfter(activeState, ET3Status.RESPONSE_ACCEPTED),
      isCurrent(activeState, ET3Status.RESPONSE_ACCEPTED)
    ),
    addProgressBarItem(
      translations.hearingDetails,
      isAtOrAfter(activeState, ET3Status.HEARINGS_LISTED),
      isCurrent(activeState, ET3Status.HEARINGS_LISTED)
    ),
    addProgressBarItem(
      translations.caseDecision,
      isAtOrAfter(activeState, ET3Status.DECISION_ADDED),
      isCurrent(activeState, ET3Status.DECISION_ADDED)
    ),
  ];
};

const toKnownStatus = (state?: string): ET3Status => {
  const et3Status = state as ET3Status;
  return ET3_STATUS_ORDER.includes(et3Status) ? et3Status : ET3Status.IN_PROGRESS;
};

const statusIndex = (state: ET3Status): number => ET3_STATUS_ORDER.indexOf(state);

const isBefore = (activeState: ET3Status, targetState: ET3Status): boolean =>
  statusIndex(activeState) < statusIndex(targetState);

const isAtOrAfter = (activeState: ET3Status, targetState: ET3Status): boolean =>
  statusIndex(activeState) >= statusIndex(targetState);

const isCurrent = (activeState: ET3Status, targetState: ET3Status): boolean =>
  statusIndex(activeState) === statusIndex(targetState);

const addProgressBarItem = (labelText: string, isComplete: boolean, isActive: boolean): ProgressBarItem => {
  return {
    label: {
      text: labelText,
    },
    complete: isComplete,
    active: isActive,
  };
};
