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

  public static throwManuelError(message: string, name: string): void {
    const err = new Error(message);
    err.name = name;
    throw err;
  }

  public static setManuelErrorToRequestSession = (
    request: AppRequest,
    errorType: string,
    propertyName: string
  ): void => {
    const errors: FormError[] = [];
    errors.push({ errorType, propertyName });
    request.session.errors = errors;
  };
}
