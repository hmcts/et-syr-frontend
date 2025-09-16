import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

/**
 * Utility class for working with numbers and number-like string values.
 *
 * <p>This class provides a collection of static helper methods to handle
 * common operations with numeric values, including:</p>
 *
 * <ul>
 *   <li>Checking whether numbers are empty, zero, or defined</li>
 *   <li>Formatting ACAS numbers with underscores or empty strings</li>
 *   <li>Validating numeric string values</li>
 *   <li>Safely converting strings to numbers</li>
 * </ul>
 *
 * <p>All methods are static and stateless, making this class suitable
 * for use as a general-purpose number utility library.</p>
 *
 * <p>Example usage:</p>
 * ```ts
 * NumberUtils.isEmptyOrZero(0); // true
 * NumberUtils.isNotEmpty(42); // true
 * NumberUtils.isNumericValue("123"); // true
 * NumberUtils.toNumberOrUndefined("abc"); // undefined
 * ```
 */
export default class NumberUtils {
  /**
   * Checks whether the given number is either undefined, null, or equal to zero.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is undefined, null, or 0; otherwise `false`.
   */
  public static isEmptyOrZero(value: number): boolean {
    return this.isEmpty(value) || value === 0;
  }

  /**
   * Checks whether the given number is not undefined or null.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is defined and not null; otherwise `false`.
   */
  public static isNotEmpty(value: number): boolean {
    return !this.isEmpty(value);
  }

  /**
   * Checks whether the given number is undefined or null.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is undefined or null; otherwise `false`.
   */
  public static isEmpty(value: number): boolean {
    return value === undefined || value === null || Number.isNaN(value);
  }

  /**
   * Checks whether the given number is not empty and not zero.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is neither empty nor zero; otherwise `false`.
   */
  public static isNotEmptyOrZero(value: number): boolean {
    return !this.isEmptyOrZero(value);
  }

  /**
   * Formats an ACAS number by replacing slashes with underscores.
   *
   * @param acasNumber - The ACAS number string to format.
   * @returns The formatted ACAS number, or an empty string if the input is blank.
   */
  public static formatAcasNumberDashToUnderscore(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_UNDERSCORE);
  }

  /**
   * Formats an ACAS number by removing slashes entirely.
   *
   * @param acasNumber - The ACAS number string to format.
   * @returns The formatted ACAS number, or an empty string if the input is blank.
   */
  public static formatAcasNumberDashToEmptyString(acasNumber: string): string {
    return StringUtils.isBlank(acasNumber)
      ? DefaultValues.STRING_EMPTY
      : acasNumber.trim().replace(DefaultValues.STRING_SLASH_REGEX, DefaultValues.STRING_EMPTY);
  }

  /**
   * Checks whether the given string represents a valid numeric value.
   *
   * <p>This method attempts to convert the input string to a number using
   * {@link Number}. The string is considered numeric if:</p>
   *
   * - It is not empty, `null`, or `undefined`.
   * - Conversion to a number does not result in `NaN`.
   * - The resulting number is non-zero, OR the trimmed string equals `"0"`.
   *
   * @param stringValue - The string to evaluate.
   * @returns `true` if {@code stringValue} is a valid numeric value (including zero);
   *          `false` otherwise.
   *
   * @example
   * ```typescript
   * isNumericValue("123");    // true
   * isNumericValue("42.5");   // true
   * isNumericValue("0");      // true
   * isNumericValue(" 0 ");    // true
   * isNumericValue("abc");    // false
   * isNumericValue("");       // false
   * ```
   */
  public static isNumericValue(stringValue: string): boolean {
    return !(!stringValue || isNaN(Number(stringValue)) || !Number(stringValue)) || stringValue.trim() === '0';
  }

  /**
   * Checks whether the given string does **not** represent a valid numeric value.
   *
   * <p>This method is the logical inverse of {@link isNumericValue}. It returns
   * `true` if the input string is `null`, `undefined`, empty, cannot be converted
   * to a number, or is otherwise considered non-numeric according to
   * {@link isNumericValue}.</p>
   *
   * @param stringValue - The string to evaluate.
   * @returns `true` if {@code stringValue} is not a valid numeric value;
   *          `false` if it is numeric (including zero).
   *
   * @example
   * ```typescript
   * isNonNumericValue("123");   // false
   * isNonNumericValue("0");     // false
   * isNonNumericValue("abc");   // true
   * isNonNumericValue("");      // true
   * ```
   */
  public static isNonNumericValue(stringValue: string): boolean {
    return !this.isNumericValue(stringValue);
  }

  /**
   * Attempts to convert a string into a number.
   *
   * ### Behavior
   * - If the input string is a valid numeric value (e.g. `"42"`, `"3.14"`), it is
   *   converted and returned as a `number`.
   * - If the input string is not numeric (e.g. `"abc"`, `""`, `"123abc"`), the
   *   function returns `undefined` instead of throwing an error.
   *
   * ### Use case
   * This utility provides a safe way to parse numbers from strings without
   * the need for explicit validation or try/catch handling. It avoids `NaN`
   * values by returning `undefined` when parsing is not possible.
   *
   * @param stringValue - The input string to convert.
   * @returns A numeric representation of the input string, or `undefined`
   *          if the string is non-numeric.
   *
   * ### Example
   * ```ts
   * toNumberOrUndefined("123"); // 123
   * toNumberOrUndefined("3.14"); // 3.14
   * toNumberOrUndefined("abc"); // undefined
   * toNumberOrUndefined(""); // undefined
   * ```
   */
  public static toNumberOrUndefined(stringValue: string): number | undefined {
    if (this.isNonNumericValue(stringValue)) {
      return undefined;
    }
    return Number(stringValue.trim());
  }

  /**
   * Converts a numeric value to its string representation, or returns `undefined`
   * if the value is `undefined`, `null`, or `NaN`.
   *
   * @param numericValue - The number to convert.
   * @returns The string representation of `numericValue`, or `undefined` if
   *          the input is `undefined`, `null`, or `NaN`.
   *
   * @remarks
   * This method relies on {@link isEmpty}, which considers a number empty if it is:
   * - `undefined`
   * - `null`
   * - `NaN`
   *
   * @example
   * ```typescript
   * toStringOrUndefined(42);     // "42"
   * toStringOrUndefined(NaN);    // undefined
   * toStringOrUndefined(null);   // undefined
   * toStringOrUndefined(undefined); // undefined
   * ```
   */
  public static toStringOrUndefined(numericValue: number): string | undefined {
    if (this.isEmpty(numericValue)) {
      return undefined;
    }
    return numericValue.toString();
  }
}
