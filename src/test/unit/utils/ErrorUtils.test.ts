import { ValidationErrors } from '../../../main/definitions/constants';
import ErrorUtils from '../../../main/utils/ErrorUtils';
import { mockRequest } from '../mocks/mockRequest';

describe('ErrorUtils tests', () => {
  test('Should throw error with the given error and error name values', async () => {
    const err = new Error('Test error');
    const errorName = 'Test error name';
    let caughtError = undefined;
    try {
      ErrorUtils.throwError(err, errorName);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toStrictEqual(err);
  });
  test('Should throw manuel error with the given error and error name values', async () => {
    const message = 'Test error';
    const errorName = 'Test error name';
    let caughtError = undefined;
    try {
      ErrorUtils.throwManualError(message, errorName);
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError).toStrictEqual(new Error('Test error'));
  });
  test('Should put manuel error to session request with the given error type and property name', async () => {
    const errorType = ValidationErrors.API;
    const propertyName = 'hiddenErrorField';
    const request = mockRequest({});
    ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(request, errorType, propertyName);
    expect(request.session.errors).toStrictEqual([{ errorType, propertyName }]);
  });
});
