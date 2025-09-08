import { isValidCurrency } from '../validators/currency-validator';

export const CurrencyField = {
  classes: 'govuk-input--width-10',
  type: 'currency',
  attributes: { maxLength: 13 },
  validator: isValidCurrency,
};
