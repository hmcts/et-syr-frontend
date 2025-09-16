import NumberUtils from './NumberUtils';
import TypeUtils from './TypeUtils';

export default class CurrencyUtils {
  private static readonly validCurrencyPattern = /^£?\d{1,3}(,\d{3})*(\.\d{1,2})?£?$/;
  private static readonly regExpToReplace = /[£,]/g;
  private static readonly minCurrencyValue = 0.01;
  private static readonly maxCurrencyValue = 9999999.99;
  /**
   * Converts a numeric value expressed in pence into a UK-formatted
   * pounds string, excluding empty or zero values.
   *
   * <p>This method first checks whether the input is considered empty or zero
   * using {@link NumberUtils.isEmptyOrZero}. A value is considered invalid if it
   * is `undefined`, `null`, `NaN`, or exactly `0`. In such cases, the method
   * returns `undefined`.</p>
   *
   * <p>If the input is valid, the value is divided by 100 to convert pence into
   * pounds. The result is then formatted as a string using the `en-GB` locale
   * with thousand separators and exactly two decimal places, but without any
   * currency symbol.</p>
   *
   * @param value - The numeric value in pence (e.g., {@code 123456} → "1,234.56").
   * @returns A UK-formatted number string representing pounds, or `undefined`
   *          if the value is empty or zero.
   *
   * @example
   * ```typescript
   * formatPenceToPounds(123456);   // "1,234.56"
   * formatPenceToPounds(500);      // "5.00"
   * formatPenceToPounds(0);        // undefined
   * formatPenceToPounds(undefined);// undefined
   * formatPenceToPounds(NaN);      // undefined
   * ```
   */
  public static formatPenceToPounds(value: number): string | undefined {
    if (NumberUtils.isEmptyOrZero(value)) {
      return undefined;
    }
    return (value / 100).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Converts a pounds value into pence as an integer, excluding empty or zero values.
   *
   * <p>This method accepts either a string (e.g. `"£1,234.56"`) or a number (e.g. `1234.56`).</p>
   *
   * <p>Normalization rules for string inputs:</p>
   * - All commas (`,`) are removed.
   * - All pound symbols (`£`) are removed.
   * - Leading and trailing whitespace is trimmed.
   *
   * <p>If the resulting string is empty, `null`, `undefined`, cannot be parsed into a number,
   * or the number is zero, the method returns `undefined`.</p>
   *
   * <p>If valid, the numeric value is multiplied by 100 and rounded to the nearest integer
   * to return the number of pence.</p>
   *
   * @param value - The pounds value, as a string (e.g. `"£1,234.56"`) or number (e.g. `1234.56`).
   * @returns The equivalent value in pence as an integer, or `undefined` if the input
   *          is empty, zero, or invalid.
   *
   * @example
   * ```typescript
   * formatPoundsToPence("£1,234.56"); // 123456
   * formatPoundsToPence("1,234.56");  // 123456
   * formatPoundsToPence(1234.56);     // 123456
   * formatPoundsToPence("£0");        // undefined
   * formatPoundsToPence(0);           // undefined
   * formatPoundsToPence("abc");       // undefined
   * ```
   */
  public static formatPoundsToPence(value: string | number): number | undefined {
    if (TypeUtils.isEmpty(value)) {
      return undefined;
    }

    let numericValue: number;

    if (typeof value === 'string') {
      // Remove commas, pound signs, and trim whitespace
      const normalised = value.replace(/[,£]/g, '').trim();
      if (!normalised) {
        return undefined;
      }
      numericValue = Number(normalised);
    } else {
      numericValue = value;
    }

    if (NumberUtils.isEmptyOrZero(numericValue)) {
      return undefined;
    }

    return Math.round(numericValue * 100);
  }

  public static isValidCurrency(value: string | number): boolean {
    const str = (value as string)?.trim();
    if (!str || str.length === 0) {
      return false;
    }

    if (!CurrencyUtils.validCurrencyPattern.test(str)) {
      return false;
    }

    const numeric = parseFloat(str.replace(CurrencyUtils.regExpToReplace, ''));
    if (numeric < CurrencyUtils.minCurrencyValue) {
      return false;
    }

    if (numeric > CurrencyUtils.maxCurrencyValue) {
      return false;
    }
  }
}
