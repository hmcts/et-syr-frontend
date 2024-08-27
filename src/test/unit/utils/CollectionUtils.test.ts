import CollectionUtils from '../../../main/utils/CollectionUtils';

describe('CollectionUtils tests', () => {
  it.each([
    { value: undefined, result: true },
    { value: [''], result: false },
    { value: [], result: true },
    { value: null, result: true },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(CollectionUtils.isEmpty<string>(value)).toStrictEqual(result);
  });
  it.each([
    { value: undefined, result: false },
    { value: [''], result: true },
    { value: [], result: false },
    { value: null, result: false },
  ])('check if given collection value is blank: %o', ({ value, result }) => {
    expect(CollectionUtils.isNotEmpty<string>(value)).toStrictEqual(result);
  });
});
