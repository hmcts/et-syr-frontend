import { DefaultValues } from '../../definitions/constants';
import NumberUtils from '../../utils/NumberUtils';

export const convertToDatabaseValue = (inputValue: string): string => {
  const numberValue: number = NumberUtils.convertCurrencyStringToNumber(inputValue);
  if (NumberUtils.isNotEmpty(numberValue)) {
    return String((numberValue * 100).toFixed(0));
  }
  return DefaultValues.STRING_EMPTY;
};

export const convertToInputValue = (databaseValue: string): string => {
  if (NumberUtils.isNumericValue(databaseValue)) {
    return String(NumberUtils.convertStringToNumber(databaseValue) / 100);
  }
  return DefaultValues.STRING_EMPTY;
};

export const getDisplayValue = (databaseValue: string, existingValue: string): string => {
  if (existingValue) {
    return existingValue;
  }
  return convertToInputValue(databaseValue);
};
