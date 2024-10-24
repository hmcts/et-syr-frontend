import { DefaultValues } from '../../../main/definitions/constants';
import DateUtil from '../../../main/utils/DateUtil';

describe('DateUtil tests', () => {
  it.each([
    { value: undefined, result: DefaultValues.STRING_EMPTY },
    { value: '', result: DefaultValues.STRING_EMPTY },
    { value: ' ', result: DefaultValues.STRING_EMPTY },
    { value: '', result: DefaultValues.STRING_EMPTY },
    { value: ' test', result: DefaultValues.STRING_EMPTY },
    { value: '20240101   ', result: DefaultValues.STRING_EMPTY },
    { value: '20251230', result: DefaultValues.STRING_EMPTY },
    { value: '2024-01-01   ', result: '01/01/2024' },
    { value: '2025-12-30', result: '30/12/2025' },
  ])('check if given string is correctly parsed to date like 01/01/2024', ({ value, result }) => {
    expect(DateUtil.formatDateStringToDDMMYYYY(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: DefaultValues.STRING_EMPTY },
    { value: '', result: DefaultValues.STRING_EMPTY },
    { value: ' ', result: DefaultValues.STRING_EMPTY },
    { value: '', result: DefaultValues.STRING_EMPTY },
    { value: ' test', result: DefaultValues.STRING_EMPTY },
    { value: '20240101   ', result: DefaultValues.STRING_EMPTY },
    { value: '20251230', result: DefaultValues.STRING_EMPTY },
    { value: '2024-01-01   ', result: '01 Jan 2024' },
    { value: '2025-12-30', result: '30 Dec 2025' },
  ])('check if given string is correctly parsed to date like 01 Jan 2024', ({ value, result }) => {
    expect(DateUtil.formatDateStringToDDMonthYYYY(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: false },
    { value: '', result: false },
    { value: ' ', result: false },
    { value: '', result: false },
    { value: ' test', result: false },
    { value: '20240101   ', result: false },
    { value: '20251230', result: false },
    { value: '2024-01-01   ', result: true },
    { value: '2025-12-30', result: true },
  ])('check if given string is a valid date', ({ value, result }) => {
    expect(DateUtil.isDateStringValid(value)).toStrictEqual(result);
  });
});
