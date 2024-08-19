import { ValidationErrors } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { isFieldFilledIn } from './validator';

export type NumericValidator = (value: string | string[] | undefined, formData: AnyRecord) => void | string;

export const isValidCaseReferenceId: NumericValidator = value => {
  if (isFieldFilledIn(value) === ValidationErrors.REQUIRED) {
    return ValidationErrors.REQUIRED;
  }
  if (!(value as string).match(/^[0-9]{16}$/) && !(value as string).match(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/)) {
    return ValidationErrors.INVALID_VALUE;
  }
};
