import { isValidCurrency } from '../../../main/validators/currency-validator';

describe('Currency Validation', () => {
  describe('isValidCurrency()', () => {
    it.each([
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
      { mockRef: '   ', expected: undefined },
      { mockRef: '0', expected: undefined },
      { mockRef: '1', expected: undefined },
      { mockRef: '100', expected: undefined },
      { mockRef: ' 100 ', expected: undefined },
      { mockRef: '100.1', expected: undefined },
      { mockRef: '100.12', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: '1234567890123', expected: undefined },
      { mockRef: '123456789012.12', expected: undefined },
      { mockRef: 'a', expected: 'invalidCurrency' },
      { mockRef: '%', expected: 'invalidCurrency' },
      { mockRef: '25a', expected: 'invalidCurrency' },
      { mockRef: '-120', expected: 'invalidCurrency' },
      { mockRef: '20,00', expected: 'invalidCurrency' },
      { mockRef: '100,00', expected: 'invalidCurrency' },
      { mockRef: '123456,890', expected: 'invalidCurrency' },
      { mockRef: '100.', expected: 'invalidCurrency' },
      { mockRef: '100.123', expected: 'invalidCurrency' },
      { mockRef: '10 0', expected: 'invalidCurrency' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });
});
