import { RespondentET3Model } from '../definitions/case';
import { ET3Status } from '../definitions/definition';

export class StateSequence {
  states: string[];
  stateIndex: number;

  constructor(readonly stateList: string[]) {
    this.states = stateList;
    this.stateIndex = 0;
  }

  public at(currentState: string): this {
    this.stateIndex = this.states.indexOf(currentState);
    return this;
  }

  public isAfter(state: string): boolean {
    return this.stateIndex > this.states.indexOf(state);
  }

  public isRightAfter(state: string): boolean {
    return this.stateIndex + 1 === this.states.indexOf(state);
  }

  public toET3Status(respondent: RespondentET3Model): ET3Status {
    if (!respondent?.et3Status || ET3Status.IN_PROGRESS.toString() === respondent.et3Status) {
      return ET3Status.IN_PROGRESS;
    } else if (ET3Status.RESPONSE_ACCEPTED.toString() === respondent.et3Status) {
      return ET3Status.RESPONSE_ACCEPTED;
    } else if (ET3Status.HEARINGS_ESTABLISHED.toString() === respondent.et3Status) {
      return ET3Status.HEARINGS_ESTABLISHED;
    } else if (ET3Status.CASE_DECIDED.toString() === respondent.et3Status) {
      return ET3Status.CASE_DECIDED;
    }
    return ET3Status.IN_PROGRESS;
  }
}

export const currentET3StatusFn = (respondent: RespondentET3Model): StateSequence => {
  const statusSequence = new StateSequence([
    ET3Status.NOT_STARTED,
    ET3Status.IN_PROGRESS,
    ET3Status.RESPONSE_COMPLETED,
    ET3Status.RESPONSE_ACCEPTED,
    ET3Status.HEARINGS_ESTABLISHED,
    ET3Status.CASE_DECIDED,
    ET3Status.FINISHED,
  ]);

  const currentET3State = statusSequence.toET3Status(respondent);

  return statusSequence.at(currentET3State);
};
