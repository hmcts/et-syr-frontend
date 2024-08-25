import StringUtils from '../../../main/utils/StringUtils';

describe('StringUtils tests', () => {
  it.each([
    { value: undefined, result: true },
    { value: '', result: true },
    { value: ' ', result: true },
    { value: 'test', result: false },
    { value: ' test', result: false },
    { value: 'test   ', result: false },
    { value: 'test ', result: false },
    { value: '    test', result: false },
    { value: ' test ', result: false },
    { value: '    test   ', result: false },
    { value: '     ', result: true },
    { value: null, result: true },
  ])('check if given string value is blank: %o', ({ value, result }) => {
    expect(StringUtils.isBlank(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: false },
    { value: '', result: false },
    { value: ' ', result: false },
    { value: 'test', result: true },
    { value: ' test', result: true },
    { value: 'test   ', result: true },
    { value: 'test ', result: true },
    { value: '    test', result: true },
    { value: ' test ', result: true },
    { value: '    test   ', result: true },
    { value: '     ', result: false },
    { value: null, result: false },
  ])('check if given string value is not blank: %o', ({ value, result }) => {
    expect(StringUtils.isNotBlank(value)).toStrictEqual(result);
  });
});
