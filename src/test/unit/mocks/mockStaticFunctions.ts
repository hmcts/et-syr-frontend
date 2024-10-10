import { Response } from 'express';

import { AppRequest } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { FormError } from '../../../main/definitions/form';

export const mockFormError: FormError = {
  propertyName: 'haveYouCompleted',
  errorType: 'required',
};

export function createMockedUpdateET3ResponseWithET3FormFunction(
  redirectUrl: string,
  request: AppRequest,
  response: Response,
  errors: FormError[],
  userCase: CaseWithId
): () => void {
  return () => {
    request.session.errors = errors;
    request.session.userCase = userCase;
    response.redirect(redirectUrl);
  };
}
