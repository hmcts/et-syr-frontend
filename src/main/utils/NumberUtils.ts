export default class NumberUtils {
  public static isEmptyOrZero(value: number): boolean {
    return !value || value === 0;
  }
  public static isNotNotEmptyOrZero(value: number): boolean {
    return !this.isEmptyOrZero(value);
  }
}
