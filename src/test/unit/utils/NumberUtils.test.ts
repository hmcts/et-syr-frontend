import NumberUtils from '../../../main/utils/NumberUtils';

describe('NumberUtils tests', () => {
  it.each([
    { value: undefined, result: true },
    { value: 0, result: true },
    { value: null, result: true },
    { value: 1, result: false },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(NumberUtils.isEmptyOrZero(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: false },
    { value: 0, result: false },
    { value: null, result: false },
    { value: 1, result: true },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(NumberUtils.isNotNotEmptyOrZero(value)).toStrictEqual(result);
  });
});
