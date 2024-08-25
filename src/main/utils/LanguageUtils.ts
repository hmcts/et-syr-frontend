import { DefaultValues, languages } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class LanguageUtils {
  public static findLanguageUrlParameterInGivenUrl(url: string): string {
    return StringUtils.isNotBlank(url) && url.includes(languages.WELSH_URL_PARAMETER)
      ? languages.WELSH_URL_PARAMETER
      : DefaultValues.STRING_EMPTY;
  }
}
