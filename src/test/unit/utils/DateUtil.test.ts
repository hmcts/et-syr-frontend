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
  ])('check if given string is correctly parsed to date', ({ value, result }) => {
    expect(DateUtil.formatDateFromYYYYMMDDAsDDMMYYYY(value)).toStrictEqual(result);
  });
});
