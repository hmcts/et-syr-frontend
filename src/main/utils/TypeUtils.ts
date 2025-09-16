export default class TypeUtils {
  /**
   * Checks whether the given value is of type string.
   *
   * <p>This method returns `true` for both primitive strings (e.g. `"abc"`)
   * and `String` objects created with `new String("abc")`.</p>
   *
   * @param value - The value to evaluate.
   * @returns `true` if the value is a string; `false` otherwise.
   *
   * @example
   * ```typescript
   * isString("hello");             // true
   * isString(new String("world")); // true
   * isString(123);                 // false
   * isString({});                  // false
   * isString(null);                // false
   * isString(undefined);           // false
   * ```
   */
  public static isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String;
  }

  /**
   * Checks whether the given value is numeric.
   *
   * <p>A value is considered numeric if:</p>
   * - It is of type `number` and not `NaN`.
   * - Or it is a non-empty string that can be successfully converted to a number.
   *
   * <p>Whitespace-only strings and empty strings are not treated as numeric.</p>
   *
   * @param value - The value to check.
   * @returns `true` if the value is numeric (number or numeric string);
   *          `false` otherwise.
   *
   * @example
   * ```typescript
   * isNumeric(123);        // true
   * isNumeric("123");      // true
   * isNumeric("123.45");   // true
   * isNumeric(" 42 ");     // true
   * isNumeric(NaN);        // false
   * isNumeric("abc");      // false
   * isNumeric("");         // false
   * isNumeric("   ");      // false
   * isNumeric(undefined);  // false
   * isNumeric(null);       // false
   * ```
   */
  public static isNumeric(value: unknown): boolean {
    if (typeof value === 'number') {
      return !Number.isNaN(value);
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return !Number.isNaN(Number(value));
    }
    return false;
  }

  /**
   * Checks whether the given value is empty.
   *
   * <p>A value is considered empty if it is:</p>
   * - `null` or `undefined`
   * - A string that is empty or whitespace-only
   * - An array with no elements
   * - An object with no own enumerable keys
   * - A `Map` or `Set` with size `0`
   *
   * Other values (numbers, booleans, functions, non-empty objects/collections)
   * are considered not empty.
   *
   * @param value - The value to evaluate.
   * @returns `true` if the value is empty; `false` otherwise.
   *
   * @example
   * ```typescript
   * isEmpty(null);                 // true
   * isEmpty(undefined);            // true
   * isEmpty("");                   // true
   * isEmpty("   ");                // true
   * isEmpty([]);                   // true
   * isEmpty({});                   // true
   * isEmpty(new Map());            // true
   * isEmpty(new Set());            // true
   *
   * isEmpty("hello");              // false
   * isEmpty([1, 2, 3]);            // false
   * isEmpty({ a: 1 });             // false
   * isEmpty(new Map([["a", 1]]));  // false
   * isEmpty(0);                    // false (numeric zero is not empty)
   * isEmpty(false);                // false
   * ```
   */
  public static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    if (value instanceof Map || value instanceof Set) {
      return value.size === 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value as object).length === 0;
    }

    return false;
  }
}
