import { AppRequest } from '../definitions/appRequest';
import { FormFieldNames, ValidationErrors } from '../definitions/constants';
import { FormError } from '../definitions/form';

import CollectionUtils from './CollectionUtils';

export default class ErrorUtils {
  public static throwError(err: Error, errorName: string): void {
    const error = new Error(err.message);
    error.name = errorName;
    if (err.stack) {
      error.stack = err.stack;
    }
    throw error;
  }

  public static throwManualError(message: string, name: string): void {
    const err = new Error(message);
    err.name = name;
    throw err;
  }

  public static readonly setManualErrorToRequestSessionWithRemovingExistingErrors = (
    request: AppRequest,
    errorType: string,
    propertyName: string
  ): void => {
    const errors: FormError[] = [];
    errors.push({ errorType, propertyName });
    request.session.errors = errors;
  };

  public static readonly setManualErrorToRequestSessionWithExistingErrors = (
    request: AppRequest,
    errorType: string,
    propertyName: string
  ): void => {
    if (CollectionUtils.isEmpty(request.session.errors)) {
      request.session.errors = [];
    }
    request.session.errors.push({ errorType, propertyName });
  };

  public static readonly setManualErrorWithFieldToRequestSession = (
    request: AppRequest,
    errorType: string,
    propertyName: string,
    fieldName: string
  ): void => {
    const errors: FormError[] = [];
    errors.push({ errorType, propertyName, fieldName });
    request.session.errors = errors;
  };

  public static removeHiddenFieldRequiredErrorFromRequest(req: AppRequest): void {
    if (CollectionUtils.isEmpty(req?.session?.errors)) {
      return;
    }
    const hiddenFieldRequiredErrorIndex: number = req.session.errors
      .map(error => error.errorType + error.propertyName)
      .indexOf(ValidationErrors.REQUIRED + FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD);
    CollectionUtils.removeItemFromCollectionByIndex(req.session.errors, hiddenFieldRequiredErrorIndex);
  }

  public static removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(req: AppRequest): void {
    if (CollectionUtils.isEmpty(req?.session?.errors)) {
      return;
    }
    for (let i: number = 0; i < req.session.errors.length; i++) {
      if (
        req.session.errors[i]?.errorType === ValidationErrors.API &&
        req.session.errors[i]?.propertyName === FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      ) {
        continue;
      }
      CollectionUtils.removeItemFromCollectionByIndex(req.session.errors, i);
    }
  }
}
