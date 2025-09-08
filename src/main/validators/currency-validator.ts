import { DefaultValues, ValidationErrors } from '../definitions/constants';

import { Validator } from './validator';

const validCurrencyPattern = /^£?(\d{1,3}(,\d{3})*|\d+)(\.\d{0,2})?$/;
const regExpToReplace = /[£,]/g;
const minCurrencyValue = 10;
const maxCurrencyValue = 9999999.99;

export const isValidCurrency: Validator = value => {
  const str = (value as string)?.trim();
  if (!str || str.length === 0) {
    return;
  }

  if (!validCurrencyPattern.test(str) || str === DefaultValues.NUMBER_ZERO.toString()) {
    return ValidationErrors.INVALID_CURRENCY;
  }

  const numeric = parseFloat(str.replace(regExpToReplace, ''));
  if (numeric < minCurrencyValue) {
    return ValidationErrors.TOO_LOW_CURRENCY;
  }

  if (numeric > maxCurrencyValue) {
    return ValidationErrors.TOO_HIGH_CURRENCY;
  }
};
