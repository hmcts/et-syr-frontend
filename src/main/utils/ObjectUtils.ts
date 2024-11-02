export default class ObjectUtils {
  public static isObjectEmpty(object: unknown | undefined | null | string | number): boolean {
    return !object || Object.keys(object).length === 0;
  }
  public static isObjectNotEmpty(object: unknown | undefined | null | string | number): boolean {
    return !this.isObjectEmpty(object);
  }
}
