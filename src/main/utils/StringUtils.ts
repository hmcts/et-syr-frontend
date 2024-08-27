export default class StringUtils {
  public static isBlank(value: string): boolean {
    return !value || value.trim().length === 0;
  }
  public static isNotBlank(value: string): boolean {
    return !this.isBlank(value);
  }
}
