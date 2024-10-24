import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class NumberUtils {
  public static isEmptyOrZero(value: number): boolean {
    return !value || value === 0;
  }
  public static isNotNotEmptyOrZero(value: number): boolean {
    return !this.isEmptyOrZero(value);
  }
  public static formatAcasNumberDashToUnderscore(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_UNDERSCORE);
  }
}
