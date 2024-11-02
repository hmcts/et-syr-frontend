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
}
