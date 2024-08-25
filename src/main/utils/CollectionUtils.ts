export default class CollectionUtils {
  public static isEmpty<T>(value: T[]): boolean {
    return !value || value.length === 0;
  }
  public static isNotEmpty<T>(value: T[]): boolean {
    return !this.isEmpty<T>(value);
  }
}
