import { CaseWithId } from '../definitions/case';
import { CaseState } from '../definitions/definition';

export const getRedirectUrl = (userCase: CaseWithId, languageParam: string): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    return `/claimant-application/${userCase.id}${languageParam}`;
  } else {
    return `/response-hub/${userCase.id}${languageParam}`;
  }
};
