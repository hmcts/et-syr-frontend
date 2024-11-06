export default class ObjectUtils {
  public static isObjectEmpty(object: unknown): boolean {
    return !object || Object.keys(object).length === 0;
  }
  public static isObjectNotEmpty(object: unknown): boolean {
    return !this.isObjectEmpty(object);
  }
}
