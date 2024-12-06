import { DefaultValues } from '../../../main/definitions/constants';
import DateUtils from '../../../main/utils/DateUtils';

describe('DateUtils tests', () => {
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
    expect(DateUtils.formatDateStringToDDMMYYYY(value)).toStrictEqual(result);
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
    expect(DateUtils.formatDateStringToDDMMMYYYY(value)).toStrictEqual(result);
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
    expect(DateUtils.isDateStringValid(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: undefined },
    { value: '', result: undefined },
    { value: ' ', result: undefined },
    { value: '', result: undefined },
    { value: ' test', result: undefined },
    { value: '20240101   ', result: undefined },
    { value: '20251230', result: undefined },
    { value: '2024-01-01   ', result: '29/01/2024' },
    { value: '2025-12-30', result: '27/01/2026' },
  ])('check if 28 days added to given string', ({ value, result }) => {
    expect(DateUtils.addStringDate28Days(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: undefined },
    { value: '', result: undefined },
    { value: ' ', result: undefined },
    { value: '', result: undefined },
    { value: ' test', result: undefined },
    { value: '20240101   ', result: undefined },
    { value: '20251230', result: undefined },
    { value: '2024-01-01   ', result: { day: '01', month: '01', year: '2024' } },
    { value: '2025-12-30', result: { day: '30', month: '12', year: '2025' } },
  ])('format date string to case date', ({ value, result }) => {
    expect(DateUtils.formatDateStringToCaseDate(value)).toStrictEqual(result);
  });

  it.each([
    { value: undefined, result: DefaultValues.STRING_EMPTY },
    { value: { day: '33', month: '01', year: '2024' }, result: DefaultValues.STRING_EMPTY },
    { value: { day: '01', month: '13', year: '2024' }, result: DefaultValues.STRING_EMPTY },
    { value: { day: '01', month: '13', year: '024' }, result: DefaultValues.STRING_EMPTY },
    { value: { day: '01', month: '01', year: '2024' }, result: '01 Jan 2024' },
    { value: { day: '30', month: '12', year: '2025' }, result: '30 Dec 2025' },
  ])('converts case date to string', ({ value, result }) => {
    expect(DateUtils.convertCaseDateToString(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: undefined },
    { value: { day: '', month: '01', year: '2024' }, result: undefined },
    { value: { day: '01', month: undefined, year: '2024' }, result: undefined },
    { value: { day: '01', month: '13', year: undefined }, result: undefined },
    { value: { day: '01', month: '01', year: '024' }, result: undefined },
    { value: { day: '35', month: '12', year: '2025' }, result: undefined },
    { value: { day: '01', month: '13', year: '2025' }, result: undefined },
    { value: { day: '01', month: '11', year: '2025' }, result: '2025-11-01' },
    { value: { day: '1', month: '1', year: '2025' }, result: '2025-01-01' },
  ])('format case date to date string with 2 chars of days and months', ({ value, result }) => {
    expect(DateUtils.convertCaseDateToApiDateStringYYYY_MM_DD(value)).toStrictEqual(result);
  });
});
