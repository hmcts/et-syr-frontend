import TypeUtils from '../../../main/utils/TypeUtils';

describe('TypeUtils.isString', () => {
  it('returns true for primitive strings and String objects', () => {
    expect(TypeUtils.isString('hello')).toBe(true);
    expect(TypeUtils.isString(String('world'))).toBe(true); // eslint-disable-line no-new-wrappers
  });

  it('returns false for non-strings', () => {
    expect(TypeUtils.isString(123)).toBe(false);
    expect(TypeUtils.isString(true)).toBe(false);
    expect(TypeUtils.isString(null)).toBe(false);
    expect(TypeUtils.isString(undefined)).toBe(false);
    expect(TypeUtils.isString({})).toBe(false);
    expect(TypeUtils.isString([])).toBe(false);
    expect(TypeUtils.isString(Symbol('s'))).toBe(false);
    expect(TypeUtils.isString(BigInt(10))).toBe(false);
    expect(TypeUtils.isString(() => {})).toBe(false);
  });

  it('narrows type at compile time (type predicate)', () => {
    // This test is mostly to ensure the signature remains `value is string`.
    // If you change the return type, TS will complain here.
    const maybe: unknown = 'hi';
    if (TypeUtils.isString(maybe)) {
      // Inside this block, `maybe` should be typed as `string`.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      const upper = maybe.toUpperCase();
      // eslint-disable-next-line jest/no-conditional-expect
      expect(upper).toBe('HI');
    } else {
      // In the else branch, `maybe` is not a string.
      // eslint-disable-next-line jest/no-conditional-expect
      expect(typeof maybe).not.toBe('string');
    }
  });
});

describe('TypeUtils.isNumeric', () => {
  it('returns true for numeric numbers', () => {
    expect(TypeUtils.isNumeric(0)).toBe(true);
    expect(TypeUtils.isNumeric(123)).toBe(true);
    expect(TypeUtils.isNumeric(-123.45)).toBe(true);
    expect(TypeUtils.isNumeric(Infinity)).toBe(true); // Number, not NaN
  });

  it('returns true for numeric strings (non-empty)', () => {
    expect(TypeUtils.isNumeric('0')).toBe(true);
    expect(TypeUtils.isNumeric('123')).toBe(true);
    expect(TypeUtils.isNumeric('-123.45')).toBe(true);
    expect(TypeUtils.isNumeric(' 42 ')).toBe(true);
    expect(TypeUtils.isNumeric('0x10')).toBe(true); // hex -> 16
    expect(TypeUtils.isNumeric('1e3')).toBe(true); // scientific -> 1000
    expect(TypeUtils.isNumeric('Infinity')).toBe(true); // Number("Infinity") -> Infinity
  });

  it('returns false for NaN and non-numeric inputs', () => {
    expect(TypeUtils.isNumeric(NaN)).toBe(false);
    expect(TypeUtils.isNumeric('')).toBe(false);
    expect(TypeUtils.isNumeric('   ')).toBe(false);
    expect(TypeUtils.isNumeric('abc')).toBe(false);
    expect(TypeUtils.isNumeric('1,234')).toBe(false); // comma not allowed by Number()
    expect(TypeUtils.isNumeric('1_000')).toBe(false); // numeric separator not allowed in strings
    expect(TypeUtils.isNumeric(null)).toBe(false);
    expect(TypeUtils.isNumeric(undefined)).toBe(false);
    expect(TypeUtils.isNumeric({})).toBe(false);
    expect(TypeUtils.isNumeric([])).toBe(false);
  });
});

describe('TypeUtils.isEmpty', () => {
  it('returns true for null/undefined', () => {
    expect(TypeUtils.isEmpty(null)).toBe(true);
    expect(TypeUtils.isEmpty(undefined)).toBe(true);
  });

  it('returns true for empty or whitespace-only strings', () => {
    expect(TypeUtils.isEmpty('')).toBe(true);
    expect(TypeUtils.isEmpty('   ')).toBe(true);
    expect(TypeUtils.isEmpty('\n\t')).toBe(true);
  });

  it('returns true for empty arrays, objects, Map, and Set', () => {
    expect(TypeUtils.isEmpty([])).toBe(true);
    expect(TypeUtils.isEmpty({})).toBe(true);
    expect(TypeUtils.isEmpty(new Map())).toBe(true);
    expect(TypeUtils.isEmpty(new Set())).toBe(true);
  });

  it('returns false for non-empty strings, arrays, objects, Map, and Set', () => {
    expect(TypeUtils.isEmpty('hello')).toBe(false);
    expect(TypeUtils.isEmpty([1])).toBe(false);
    expect(TypeUtils.isEmpty({ a: 1 })).toBe(false);
    const m = new Map<string, number>();
    m.set('a', 1);
    const s = new Set<number>();
    s.add(1);
    expect(TypeUtils.isEmpty(m)).toBe(false);
    expect(TypeUtils.isEmpty(s)).toBe(false);
  });

  it('returns false for numbers, booleans, functions, symbols, bigint', () => {
    expect(TypeUtils.isEmpty(0)).toBe(false); // per doc: 0 is not empty
    expect(TypeUtils.isEmpty(123)).toBe(false);
    expect(TypeUtils.isEmpty(false)).toBe(false);
    expect(TypeUtils.isEmpty(true)).toBe(false);
    expect(TypeUtils.isEmpty(() => {})).toBe(false);
    expect(TypeUtils.isEmpty(Symbol('x'))).toBe(false);
    expect(TypeUtils.isEmpty(BigInt(0))).toBe(false);
  });

  it('treats objects with only non-enumerable props as empty (matches implementation)', () => {
    const obj = {};
    Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false });
    // Object.keys(obj) -> []
    expect(TypeUtils.isEmpty(obj)).toBe(true);
  });

  it('handles objects without prototypes', () => {
    const o = Object.create(null);
    expect(TypeUtils.isEmpty(o)).toBe(true);
    (o as any).a = 1;
    expect(TypeUtils.isEmpty(o)).toBe(false);
  });
});
