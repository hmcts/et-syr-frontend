import { DefaultValues } from '../definitions/constants';

export default class StringUtils {
  public static isBlank(value: string): boolean {
    return !value || value.trim().length === 0;
  }
  public static isNotBlank(value: string): boolean {
    return !this.isBlank(value);
  }
  public static isLengthMoreThan(value: string, maxLength: number): boolean {
    return value && value.length > maxLength;
  }
  public static replaceFirstOccurrence(text: string, oldValue: string, newValue: string): string {
    if (this.isBlank(text) || this.isBlank(oldValue) || this.isBlank(newValue) || text.indexOf(oldValue) === -1) {
      return text;
    }
    return text.replace(new RegExp(`(${oldValue})|(${oldValue})`), newValue);
  }
  public static removeFirstOccurrence(text: string, valueToRemove: string): string {
    if (this.isBlank(text) || this.isBlank(valueToRemove) || text.indexOf(valueToRemove) === -1) {
      return text;
    }
    const e = new RegExp(`(${valueToRemove})|(${valueToRemove})`);
    return text.replace(e, DefaultValues.STRING_EMPTY);
  }
}
