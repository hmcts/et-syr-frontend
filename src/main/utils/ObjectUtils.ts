export default class ObjectUtils {
  /**
   * Checks whether the given object is considered empty.
   *
   * <p>An object is treated as empty if it is:</p>
   * - `undefined` or `null`
   * - any other falsy value (e.g. `false`, `0`, `""`)
   * - an object with no own enumerable properties (i.e. `Object.keys(object).length === 0`)
   *
   * <p>⚠️ Note: Primitive falsy values such as `0`, `false`, or `""` will
   * also be treated as empty because of the initial `!object` check. This may
   * or may not be desired depending on the use case.</p>
   *
   * @param object - The value to evaluate.
   * @returns `true` if the value is `undefined`, `null`, falsy, or an object
   *          with no own enumerable properties; `false` otherwise.
   *
   * @example
   * ```typescript
   * isEmpty(null);         // true
   * isEmpty(undefined);    // true
   * isEmpty({});           // true
   * isEmpty([]);           // true (no keys)
   * isEmpty({ a: 1 });     // false
   * isEmpty([1, 2, 3]);    // false
   * isEmpty("");           // true  (empty string is falsy)
   * isEmpty(0);            // true  (zero is falsy)
   * isEmpty(false);        // true  (false is falsy)
   * ```
   */
  public static isEmpty(object: unknown): boolean {
    return !object || Object.keys(object).length === 0;
  }
}
