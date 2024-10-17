import { AppRequest } from '../definitions/appRequest';
import { FormError } from '../definitions/form';

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

  public static readonly setManualErrorToRequestSession = (
    request: AppRequest,
    errorType: string,
    propertyName: string
  ): void => {
    const errors: FormError[] = [];
    errors.push({ errorType, propertyName });
    request.session.errors = errors;
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
}
