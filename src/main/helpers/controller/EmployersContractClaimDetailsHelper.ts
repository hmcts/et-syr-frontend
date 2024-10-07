import { ValidationErrors } from '../../definitions/constants';
import { Validator, isContent2500CharsOrLess, isFieldFilledIn } from '../../validators/validator';

export const isFilledInAnd2500CharsOrLess: Validator = value => {
  if (isFieldFilledIn(value)) {
    return ValidationErrors.REQUIRED;
  }
  if (isContent2500CharsOrLess(value)) {
    return ValidationErrors.TOO_LONG;
  }
};
