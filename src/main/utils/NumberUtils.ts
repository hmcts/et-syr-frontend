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
    return !value || value === 0;
  }

  /**
   * Checks whether the given number is not undefined or null.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is defined and not null; otherwise `false`.
   */
  public static isNotEmpty(value: number): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * Checks whether the given number is undefined or null.
   *
   * @param value - The numeric value to check.
   * @returns `true` if the value is undefined or null; otherwise `false`.
   */
  public static isEmpty(value: number): boolean {
    return !this.isNotEmpty(value);
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
   * Determines whether a string represents a valid numeric value.
   *
   * @param stringValue - The string to validate.
   * @returns `true` if the string is non-empty and can be converted to a number; otherwise `false`.
   */
  public static isNumericValue(stringValue: string): boolean {
    return !(!stringValue || isNaN(Number(stringValue)) || !Number(stringValue));
  }

  /**
   * Determines whether a string does not represent a valid numeric value.
   *
   * @param stringValue - The string to validate.
   * @returns `true` if the string is empty, NaN, or cannot be converted to a number; otherwise `false`.
   */
  public static isNonNumericValue(stringValue: string): boolean {
    return !this.isNumericValue(stringValue);
  }

  /**
   * Formats a given monetary amount by removing currency symbols (£) and
   *  thousands of separators (commas), returning the numeric value.
   *
   * <p>If the input is empty or undefined, the method returns `undefined`.
   * Otherwise, it converts the input to a string, strips out the pound sign
   * and commas, and parses the result into a floating-point number.</p>
   *
   * @param amount the monetary amount to format. Can include currency symbols
   *               (e.g., "£1,234.56") or commas as a thousand separators.
   * @return the numeric value of the amount without formatting, or `undefined`
   *         if the input is empty.
   */
  public static formatAmountToCcdDigits(amount: number): number | undefined {
    if (this.isEmpty(amount)) {
      return undefined;
    }
    return parseFloat(amount.toString().replace(/[£,]/g, ''));
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
}
