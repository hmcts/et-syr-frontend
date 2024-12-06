import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { FormFieldNames, ValidationErrors } from '../../../main/definitions/constants';
import ErrorUtils from '../../../main/utils/ErrorUtils';
import { mockRequest } from '../mocks/mockRequest';

describe('ErrorUtils tests', () => {
  describe('throwError tests', () => {
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
  });
  describe('throwManualError tests', () => {
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
  });
  describe('setManualErrorToRequestSessionWithRemovingExistingErrors tests', () => {
    test('Should put manuel error to session request with the given error type and property name', async () => {
      const errorType = ValidationErrors.API;
      const propertyName = 'hiddenErrorField';
      const request = mockRequest({});
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(request, errorType, propertyName);
      expect(request.session.errors).toStrictEqual([{ errorType, propertyName }]);
    });
  });
  describe('removeHiddenFieldRequiredErrorFromRequest tests', () => {
    const errorArrayWithoutRequiredErrorType = [
      {
        errorType: ValidationErrors.API,
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
      },
    ];
    const errorArrayWithoutHiddenErrorField = [
      {
        errorType: ValidationErrors.REQUIRED,
        propertyName: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.RESPONDENT_NAME,
      },
    ];
    const errorArrayWithoutRequiredErrorTypeAndHiddenErrorField = [
      {
        errorType: ValidationErrors.API,
        propertyName: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.RESPONDENT_NAME,
      },
    ];
    const errorArrayWithRequiredErrorTypeAndHiddenErrorField = [
      {
        errorType: ValidationErrors.REQUIRED,
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
      },
    ];
    test('Should not remove anything from request session errors when request is undefined', async () => {
      const request: AppRequest = undefined;
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session errors when request session is undefined', async () => {
      const request: AppRequest = mockRequest({});
      request.session = undefined;
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session errors when request session errors field is undefined', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = undefined;
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session errors when request session errors field is empty', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = [];
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual([]);
    });
    test('Should not remove anything from request session errors when request session errors field does not have required error type', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithoutRequiredErrorType);
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual(errorArrayWithoutRequiredErrorType);
    });
    test('Should not remove anything from request session errors when request session errors field does not have hidden error field error', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithoutHiddenErrorField);
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual(errorArrayWithoutHiddenErrorField);
    });
    test('Should not remove anything from request session errors when request session errors field does not have both required error type and hidden error field error', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithoutRequiredErrorTypeAndHiddenErrorField);
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual(errorArrayWithoutRequiredErrorTypeAndHiddenErrorField);
    });
    test('Should remove error from request session errors when request session errors field has required error type and hidden error field error', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithRequiredErrorTypeAndHiddenErrorField);
      ErrorUtils.removeHiddenFieldRequiredErrorFromRequest(request);
      expect(request.session.errors).toStrictEqual([]);
    });
  });
  describe('removeErrorsFromRequestExceptHiddenErrorFieldApiErrors tests', () => {
    const errorArrayWithHiddenFieldAndApiErrorType = [
      {
        errorType: ValidationErrors.API,
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
      },
    ];
    const errorArrayWithoutHiddenErrorFieldAndApiErrorType = [
      {
        errorType: ValidationErrors.API,
        propertyName: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.RESPONDENT_NAME,
      },
    ];
    const errorArrayWithHiddenFieldAndWithoutApiErrorType = [
      {
        errorType: ValidationErrors.REQUIRED,
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
      },
    ];
    test('Should not remove anything from request session, request is undefined', async () => {
      const request: AppRequest = undefined;
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session, session is undefined', async () => {
      const request: AppRequest = mockRequest({});
      request.session = undefined;
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session errors, session errors is undefined', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = undefined;
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session.errors).toStrictEqual(undefined);
    });
    test('Should not remove anything from request session errors, session errors is empty', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = [];
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session.errors).toStrictEqual([]);
    });
    test('Should remove all from request session errors, session errors does not have API errors', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithHiddenFieldAndWithoutApiErrorType);
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session.errors).toStrictEqual([]);
    });
    test('Should remove all from request session errors, session errors does not have hidden field errors', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithoutHiddenErrorFieldAndApiErrorType);
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session.errors).toStrictEqual([]);
    });
    test('Should not remove anything from request session errors, session errors has both api and hidden field error', async () => {
      const request: AppRequest = mockRequest({});
      request.session.errors = _.cloneDeep(errorArrayWithHiddenFieldAndApiErrorType);
      ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(request);
      expect(request.session.errors).toStrictEqual(errorArrayWithHiddenFieldAndApiErrorType);
    });
  });
});
