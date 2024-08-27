import { DefaultValues, languages } from '../../../main/definitions/constants';
import LanguageUtils from '../../../main/utils/LanguageUtils';

describe('LanguageUtils tests', () => {
  it.each([
    { url: undefined, result: DefaultValues.STRING_EMPTY },
    { url: '/test?lng=cy', result: languages.WELSH_URL_PARAMETER },
    { url: '/test?lng=en', result: DefaultValues.STRING_EMPTY },
    { url: '    ', result: DefaultValues.STRING_EMPTY },
    { url: ' ', result: DefaultValues.STRING_EMPTY },
    { url: '/test', result: DefaultValues.STRING_EMPTY },
    { url: '', result: DefaultValues.STRING_EMPTY },
  ])('check if case reference id is valid: %o', ({ url, result }) => {
    expect(LanguageUtils.findLanguageUrlParameterInGivenUrl(url)).toStrictEqual(result);
  });
});
