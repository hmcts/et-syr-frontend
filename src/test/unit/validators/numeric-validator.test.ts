import { isValidCaseReferenceId } from '../../../main/validators/numeric-validator';

/**
 * Case reference Ids should be at least 16 decimal characters.
 * They have 2 formats as : 1234567890123456 or 1234-5678-9012-3456
 */
describe('isValidCaseReferenceId()', () => {
  it.each([
    { value: undefined, result: 'required' },
    { value: '     ', result: 'required' },
    { value: '', result: 'required' },
    { value: '123456', result: 'invalid' },
    { value: '1234567890123456', result: undefined },
    { value: '1234-5678-9012-3456', result: undefined },
  ])('check if case reference id, %o is valid:', ({ value, result }) => {
    expect(isValidCaseReferenceId(value, null)).toStrictEqual(result);
  });
});
