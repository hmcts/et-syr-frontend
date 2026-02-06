import {
  convertToDatabaseValue,
  convertToInputValue,
  getDisplayValue,
} from '../../../../main/helpers/controller/ClaimantPayDetailsEnterHelper';

describe('ClaimantPayDetailsEnterHelper', () => {
  describe('convertToDatabaseValue', () => {
    it('should convert a valid currency string to database value (string in pence)', () => {
      expect(convertToDatabaseValue('123.45')).toBe('12345');
      expect(convertToDatabaseValue('0.99')).toBe('99');
      expect(convertToDatabaseValue('100')).toBe('10000');
      expect(convertToDatabaseValue('£1,234.56')).toBe('123456');
    });

    it('should return empty string for empty input', () => {
      expect(convertToDatabaseValue('')).toBe('');
    });

    it('should return empty string for non-numeric input', () => {
      expect(convertToDatabaseValue('abc')).toBe('');
      expect(convertToDatabaseValue('£abc')).toBe('');
    });

    it('should handle null and undefined gracefully', () => {
      expect(convertToDatabaseValue(undefined)).toBe('');
      expect(convertToDatabaseValue(null)).toBe('');
    });
  });

  describe('convertToInputValue', () => {
    it('should convert a valid database value (string in pence) to input value (pounds)', () => {
      expect(convertToInputValue('12345')).toBe('123.45');
      expect(convertToInputValue('99')).toBe('0.99');
      expect(convertToInputValue('10000')).toBe('100');
      expect(convertToInputValue('123456')).toBe('1234.56');
    });

    it('should return empty string for empty input', () => {
      expect(convertToInputValue('')).toBe('');
    });

    it('should return empty string for non-numeric input', () => {
      expect(convertToInputValue('abc')).toBe('');
      expect(convertToInputValue('£abc')).toBe('');
    });

    it('should handle null and undefined gracefully', () => {
      expect(convertToInputValue(undefined)).toBe('');
      expect(convertToInputValue(null)).toBe('');
    });
  });

  describe('getDisplayValue', () => {
    it('should return existingValue if it is provided (non-empty)', () => {
      expect(getDisplayValue('12345', '999.99')).toBe('999.99');
      expect(getDisplayValue('12345', '0')).toBe('0');
      expect(getDisplayValue('12345', 'Some Value')).toBe('Some Value');
    });

    it('should return convertToInputValue(databaseValue) if existingValue is empty', () => {
      expect(getDisplayValue('12345', undefined)).toBe('123.45');
      expect(getDisplayValue('10000', undefined)).toBe('100');
      expect(getDisplayValue('99', undefined)).toBe('0.99');
    });

    it('should return empty string if both databaseValue and existingValue are empty', () => {
      expect(getDisplayValue(undefined, undefined)).toBe('');
    });

    it('should handle null and undefined for existingValue', () => {
      expect(getDisplayValue('12345', undefined)).toBe('123.45');
      expect(getDisplayValue('12345', null)).toBe('123.45');
    });

    it('should handle null and undefined for databaseValue', () => {
      expect(getDisplayValue(undefined, undefined)).toBe('');
      expect(getDisplayValue(null, undefined)).toBe('');
    });
  });
});
