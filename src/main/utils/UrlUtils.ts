import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

export default class UrlUtils {
  public static getCaseDetailsUrlByRequest(request: AppRequest): string {
    const languageParam: string = getLanguageParam(request.url);
    const userCase: CaseWithId = request.session.userCase;
    const selectedRespondentIndex: number = request.session.selectedRespondentIndex;
    if (
      ObjectUtils.isEmpty(userCase) ||
      CollectionUtils.isEmpty(userCase.respondents) ||
      StringUtils.isBlank(languageParam) ||
      NumberUtils.isEmpty(selectedRespondentIndex)
    ) {
      return PageUrls.NOT_IMPLEMENTED;
    }
    const selectedRespondent: RespondentET3Model = userCase.respondents[selectedRespondentIndex];
    if (ObjectUtils.isEmpty(selectedRespondent)) {
      return PageUrls.NOT_IMPLEMENTED;
    }
    return `/case-details/${request.session.userCase?.id}/${selectedRespondent.ccdId}${languageParam}`;
  }

  public static removeParameterFromUrl(url: string, parameter: string): string {
    if (StringUtils.isBlank(url) || StringUtils.isBlank(parameter)) {
      return url;
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK) === -1) {
      return url;
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK + parameter) !== -1) {
      url = url.replace(DefaultValues.STRING_QUESTION_MARK + parameter, DefaultValues.STRING_EMPTY);
      if (url.indexOf(DefaultValues.STRING_AMPERSAND) !== -1) {
        url = StringUtils.replaceFirstOccurrence(
          url,
          DefaultValues.STRING_AMPERSAND,
          DefaultValues.STRING_QUESTION_MARK
        );
      }
    }
    if (url.indexOf(DefaultValues.STRING_AMPERSAND + parameter) !== -1) {
      url = StringUtils.removeFirstOccurrence(url, DefaultValues.STRING_AMPERSAND + parameter);
    }
    return url;
  }
}
