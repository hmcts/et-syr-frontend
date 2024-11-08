export default class ObjectUtils {
  public static isEmpty(object: unknown): boolean {
    return !object || Object.keys(object).length === 0;
  }
  public static isNotEmpty(object: unknown): boolean {
    return !this.isEmpty(object);
  }
}
