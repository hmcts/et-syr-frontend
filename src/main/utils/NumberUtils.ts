import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class NumberUtils {
  public static isEmptyOrZero(value: number): boolean {
    return !value || value === 0;
  }
  public static isNotEmpty(value: number): boolean {
    return value !== undefined && value !== null;
  }
  public static isEmpty(value: number): boolean {
    return !this.isNotEmpty(value);
  }
  public static isNotEmptyOrZero(value: number): boolean {
    return !this.isEmptyOrZero(value);
  }
  public static formatAcasNumberDashToUnderscore(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_UNDERSCORE);
  }
  public static formatAcasNumberDashToEmptyString(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_EMPTY);
  }
  public static isNumericValue(stringValue: string): boolean {
    return !(!stringValue || isNaN(Number(stringValue)) || !Number(stringValue));
  }
  public static isNonNumericValue(stringValue: string): boolean {
    return !this.isNumericValue(stringValue);
  }
}
