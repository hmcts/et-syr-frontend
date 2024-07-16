import { CaseWithId } from '../definitions/case';

export const getRedirectUrl = (userCase: CaseWithId, languageParam: string): string => {
  return `/response-hub/${userCase.id}${languageParam}`;
};
