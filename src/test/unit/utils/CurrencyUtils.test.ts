import CurrencyUtils from '../../../main/utils/CurrencyUtils';

describe('NumberUtils tests', () => {
  describe('formatPenceToPounds', () => {
    it('formats pence to UK-style pounds and returns undefined for empty/zero', () => {
      // --- Valid formatting cases (pence → "£"-less UK string) ---
      const formatCases: { input: number; expected: string }[] = [
        { input: 1, expected: '0.01' },
        { input: 5, expected: '0.05' },
        { input: 10, expected: '0.10' },
        { input: 50, expected: '0.50' },
        { input: 199, expected: '1.99' },
        { input: 500, expected: '5.00' },
        { input: 12345, expected: '123.45' },
        { input: 123456, expected: '1,234.56' },
        { input: 123456789, expected: '1,234,567.89' },
        { input: -123456, expected: '-1,234.56' }, // negative amounts format correctly
      ];

      for (const { input, expected } of formatCases) {
        expect(CurrencyUtils.formatPenceToPounds(input)).toBe(expected);
      }

      // --- Invalid/empty cases (should return undefined) ---
      const undefinedCases = [
        0,
        Number.NaN,
        undefined as unknown as number,
        null as unknown as number,
        -0, // JS treats -0 === 0; should be undefined due to isEmptyOrZero
      ];

      for (const input of undefinedCases) {
        expect(CurrencyUtils.formatPenceToPounds(input)).toBeUndefined();
      }

      // --- Shape checks: exactly two decimals and UK thousands separators ---
      const outputsNeedingTwoDecimals = [
        CurrencyUtils.formatPenceToPounds(1), // "0.01"
        CurrencyUtils.formatPenceToPounds(10), // "0.10"
        CurrencyUtils.formatPenceToPounds(12345), // "123.45"
        CurrencyUtils.formatPenceToPounds(123456), // "1,234.56"
      ];

      const twoDecimalUKPattern = /^-?\d{1,3}(?:,\d{3})*\.\d{2}$/;
      for (const out of outputsNeedingTwoDecimals) {
        // out is string by construction in these cases
        expect(out!).toMatch(twoDecimalUKPattern);
      }
    });
  });

  describe('formatPoundsToPence', () => {
    it('handles valid pounds, invalid inputs, normalization, and rounding', () => {
      // ---------- Valid cases: expect integer pence ----------
      // (input -> expected pence)
      const validCases: { input: string | number; expected: number }[] = [
        { input: '1,234.56', expected: 123456 },
        { input: '£1,234.56', expected: 123456 },
        { input: '  £1,234.56  ', expected: 123456 }, // trim + £ + commas
        { input: 1234.56, expected: 123456 },
        { input: '42', expected: 4200 },
        { input: '0.01', expected: 1 },
        { input: '0.005', expected: 1 }, // 0.5 pence rounds to 1
        { input: '10.004', expected: 1000 }, // rounds down
        { input: '10.005', expected: 1001 }, // rounds up
        { input: '-1.23', expected: -123 }, // negatives supported
        { input: '£0.49', expected: 49 },
        { input: '1,234,567.89', expected: 123456789 },
      ];

      for (const { input, expected } of validCases) {
        const actual = CurrencyUtils.formatPoundsToPence(input);
        expect(actual).toBe(expected);
      }

      // ---------- Invalid/empty/zero cases: expect undefined ----------
      const undefinedCases: (string | number | any)[] = [
        null, // ObjectUtils.isEmpty -> true
        undefined, // ObjectUtils.isEmpty -> true
        '', // empty string
        '   ', // whitespace-only
        'abc', // non-numeric
        '£', // only symbol
        '1,2,3', // malformed numeric
        0, // NumberUtils.isEmptyOrZero -> true
        '0', // becomes 0 -> excluded
        Number.NaN, // NumberUtils.isEmptyOrZero -> true
        -0, // equals 0
        '£0', // equals 0 after normalization
      ];

      for (const input of undefinedCases) {
        const actual = CurrencyUtils.formatPoundsToPence(input);
        expect(actual).toBeUndefined();
      }

      // ---------- Spot-check repeated normalization ----------
      expect(CurrencyUtils.formatPoundsToPence('£  12,345.67')).toBe(1234567);
      expect(CurrencyUtils.formatPoundsToPence('  £0.005 ')).toBe(1);
    });
  });
});
