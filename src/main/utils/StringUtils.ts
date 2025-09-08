import { DefaultValues } from '../definitions/constants';

export default class StringUtils {
  /**
   * Checks whether a string is blank (empty or whitespace-only).
   *
   * <p>A value is considered <em>blank</em> if it is:
   * <ul>
   *   <li>`undefined` or `null`</li>
   *   <li>an empty string `""`</li>
   *   <li>a string consisting solely of whitespace after `trim()`</li>
   * </ul>
   *
   * @param value - The value to check. Although typed as `string`, `undefined`/`null`
   *                will also be treated as blank at runtime.
   * @returns `true` if the value is `undefined`, `null`, empty, or whitespace-only; otherwise `false`.
   *
   * @example
   * StringUtils.isBlank(undefined as any); // true
   * StringUtils.isBlank(null as any); // true
   * StringUtils.isBlank(""); // true
   * StringUtils.isBlank("   "); // true
   * StringUtils.isBlank("text"); // false
   */
  public static isBlank(value: string): boolean {
    return !value || String(value).trim().length === 0;
  }

  /**
   * Checks whether a string is **not** blank (i.e., contains at least one non-whitespace character).
   *
   * <p>This is the logical negation of {@link StringUtils.isBlank}.</p>
   * <p>A value is considered <em>not blank</em> when it is neither `undefined` nor `null`,
   * and `trim()` leaves at least one character.</p>
   *
   * @param value - The value to check.
   * @returns `true` if the value contains non-whitespace characters; otherwise `false`.
   *
   * @example
   * StringUtils.isNotBlank("hello"); // true
   * StringUtils.isNotBlank("  a  "); // true
   * StringUtils.isNotBlank(""); // false
   * StringUtils.isNotBlank("   "); // false
   * StringUtils.isNotBlank(undefined as any); // false
   *
   * @see StringUtils.isBlank
   */
  public static isNotBlank(value: string): boolean {
    return !this.isBlank(value);
  }

  /**
   * Checks if the given string value has length more than the given maxLength.
   * @param value to be checked if blank or not.
   * @param maxLength is the maximum length to be checked.
   */
  public static isLengthMoreThan(value: string, maxLength: number): boolean {
    return value && value.length > maxLength;
  }

  /**
   * Replaces the **first** occurrence of `oldValue` in `text` with `newValue`.
   *
   * <p>The operation is performed only when all the following are true:</p>
   * <ul>
   *   <li>`text` is not blank</li>
   *   <li>`oldValue` is not blank</li>
   *   <li>`newValue` is not blank</li>
   *   <li>`oldValue` exists within `text`</li>
   * </ul>
   * Otherwise, the original `text` is returned unchanged.
   *
   * <p><strong>Notes</strong></p>
   * <ul>
   *   <li>This method replaces only the first match (case-sensitive).</li>
   *   <li>`oldValue` is interpreted as a regular expression pattern (no escaping is applied).
   *       If `oldValue` contains regex metacharacters (e.g., `.`, `*`, `?`, `+`, `(`, `)`),
   *       they will affect the match. Escape them beforehand if you want a literal match.</li>
   *   <li>Because {@link StringUtils.isBlank} is used, a blank `newValue` (e.g., `""` or whitespace-only)
   *       will prevent replacement. This method is therefore not suitable for deleting substrings.</li>
   * </ul>
   *
   * @param text - The source text in which to perform the replacement.
   * @param oldValue - The substring/regex pattern to find (first occurrence only).
   * @param newValue - The replacement text (must be non-blank).
   * @returns A new string with the first occurrence of `oldValue` replaced by `newValue`,
   *          or the original `text` if the preconditions are not met.
   *
   * @example
   * StringUtils.replaceFirstOccurrence("foo-bar-foo", "foo", "baz"); // "baz-bar-foo"
   *
   * @example
   * // No change when oldValue not found
   * StringUtils.replaceFirstOccurrence("hello world", "bye", "hi"); // "hello world"
   *
   * @example
   * // No change when newValue is blank
   * StringUtils.replaceFirstOccurrence("abc", "a", ""); // "abc"
   *
   * @example
   * // Regex behavior: '.' matches any character
   * StringUtils.replaceFirstOccurrence("a.b", ".", "x"); // "x.b"
   */
  public static replaceFirstOccurrence(text: string, oldValue: string, newValue: string): string {
    if (this.isBlank(text) || this.isBlank(oldValue) || this.isBlank(newValue) || text.indexOf(oldValue) === -1) {
      return text;
    }
    return text.replace(new RegExp(`(${oldValue})|(${oldValue})`), newValue);
  }

  /**
   * Removes the **first** occurrence of `valueToRemove` from `text`.
   *
   * <p>The removal is performed only when all the following are true:</p>
   * <ul>
   *   <li>`text` is not blank ({@link StringUtils.isBlank})</li>
   *   <li>`valueToRemove` is not blank ({@link StringUtils.isBlank})</li>
   *   <li>`valueToRemove` exists within `text`</li>
   * </ul>
   * Otherwise, the original `text` is returned unchanged.
   *
   * <p><strong>Notes</strong></p>
   * <ul>
   *   <li>Only the first match is removed (case-sensitive).</li>
   *   <li>`valueToRemove` is used to build a regular expression without escaping.
   *       If it contains regex metacharacters (e.g., `.`, `*`, `?`, `+`, `(`, `)`),
   *       they will affect matching. Escape beforehand if a literal match is required.</li>
   *   <li>Removal is performed by replacing the first match with {@link DefaultValues.STRING_EMPTY}.</li>
   *   <li>A blank `valueToRemove` (empty or whitespace-only) prevents removal.</li>
   * </ul>
   *
   * @param text - The source text from which to remove the first occurrence.
   * @param valueToRemove - The substring/regex pattern to remove (first occurrence only).
   * @returns A new string with the first occurrence removed, or the original `text` if preconditions are not met.
   *
   * @example
   * StringUtils.removeFirstOccurrence("foo-bar-foo", "foo"); // " -bar-foo" if STRING_EMPTY is ""
   *
   * @example
   * // No change when value is not found
   * StringUtils.removeFirstOccurrence("hello world", "bye"); // "hello world"
   *
   * @example
   * // Regex behavior: '.' matches any character
   * StringUtils.removeFirstOccurrence("a.b", "."); // "ab"
   */
  public static removeFirstOccurrence(text: string, valueToRemove: string): string {
    if (this.isBlank(text) || this.isBlank(valueToRemove) || text.indexOf(valueToRemove) === -1) {
      return text;
    }
    const e = new RegExp(`(${valueToRemove})|(${valueToRemove})`);
    return text.replace(e, DefaultValues.STRING_EMPTY);
  }
}
