import _ from 'lodash';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { DefaultValues, LegacyUrls, PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';
import RespondentUtils from './RespondentUtils';
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

  /**
   * Removes parameter from the given url. For example if url is
   * "https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy" and parameter is
   * "redirect=clearSelection" returns "https://localhost:3003/employers-contract-claim?lng=cy".
   * Please be careful, if parameter to be removed is the first parameter if there is another parameter,
   * then makes that parameter as the first parameter and replaces ampersand (&) with (?).
   * If parameter to be removed is not the first parameter then it simply removes it.
   * @param url the string value in http url format that has the parameter which needs to be removed
   * @param parameter is the parameter that needs to be removed. It should be in the format like redirect=clearSelection
   *                  name of the parameter, equals sign and value of the parameter.
   */
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

  /**
   * Gets parameter with its value. For the url
   * https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test if we send parameter name
   * as redirect, function will return redirect=clearSelection, for lng will return lng=cy and for test will return
   * test=test.
   * @param url string value to search parameter in.
   * @param parameterName string value of the parameter name that will be searched in the url.
   */
  public static findParameterWithValueByParameterName(url: string, parameterName: string): string {
    const clonedUrl = _.cloneDeep(url);
    if (
      StringUtils.isBlank(clonedUrl) ||
      StringUtils.isBlank(parameterName) ||
      clonedUrl.indexOf(DefaultValues.STRING_QUESTION_MARK) === -1 ||
      clonedUrl.indexOf(parameterName) === -1
    ) {
      return DefaultValues.STRING_EMPTY;
    }
    const stringAfterParameter = clonedUrl.substring(clonedUrl.indexOf(parameterName));
    const firstAmpersandIndexAfterParameter = stringAfterParameter.indexOf(DefaultValues.STRING_AMPERSAND);
    if (firstAmpersandIndexAfterParameter === -1) {
      return stringAfterParameter;
    }
    return stringAfterParameter.substring(0, firstAmpersandIndexAfterParameter);
  }

  /**
   * returns all the parameters of the given url in a string array.
   * @param url string value of the url to get all the params.
   */
  public static getRequestParamsFromUrl(url: string): string[] {
    if (StringUtils.isBlank(url)) {
      return [];
    }
    if (url.indexOf(DefaultValues.STRING_QUESTION_MARK) === -1) {
      return [];
    }
    const params: string[] = [];
    let clonedUrl: string = _.cloneDeep(url);
    clonedUrl = clonedUrl.substring(clonedUrl.indexOf(DefaultValues.STRING_QUESTION_MARK));
    while (StringUtils.isNotBlank(clonedUrl)) {
      let indexOfAmpersand: number = clonedUrl.indexOf(DefaultValues.STRING_AMPERSAND);
      if (indexOfAmpersand === -1) {
        indexOfAmpersand = clonedUrl.length;
      }
      const parameter: string = clonedUrl.substring(1, indexOfAmpersand);
      params.push(parameter);
      clonedUrl = this.removeParameterFromUrl(clonedUrl, parameter);
    }
    return params;
  }

  /**
   * Finds not allowed end points forwarding URL by the given request object. This method is used in oidc module.
   * If a case status is submitted but after submission a ET3-Form url page is requested, it should not be shown to
   * the respondent and needs to be forwarded to case details or case list page. This function checks request object
   * and if it finds any userCase and selected respondent, forwards to case details page else forwards to case list
   * page.
   * @param req is the object that has user case, selected respondent.
   * @return url value of case list or case details.
   */
  public static getNotAllowedEndPointsForwardingUrlByRequest(req: AppRequest): string {
    const selectedRespondent = RespondentUtils.findSelectedRespondentByRequest(req);
    if (
      ObjectUtils.isEmpty(req?.session?.userCase) ||
      StringUtils.isBlank(req.session.userCase.id) ||
      ObjectUtils.isEmpty(selectedRespondent) ||
      StringUtils.isBlank(selectedRespondent.ccdId)
    ) {
      return PageUrls.CASE_LIST + getLanguageParam(req?.url);
    }
    return (
      PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
      DefaultValues.STRING_SLASH +
      req.session.userCase.id +
      DefaultValues.STRING_SLASH +
      selectedRespondent.ccdId +
      getLanguageParam(req.url)
    );
  }

  /**
   * Checks if the given input string value is a valid URL.
   * @param text string value to be checked.
   * @return boolean true if valid URL else false.
   */
  public static isUrl(text: string): boolean {
    try {
      return Boolean(new URL(text));
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if the given string has any of the PageURLs or equal to any of the Legacy Urls.
   * For legacy URLs checks with an If clause and for {@PageURLs} check by validating with regexPattern.
   * @param url url string that should be checked.
   * @param validUrls optional parameter to check if URL exists in valid urls. If this parameter is empty checks URL
   *                  with the {@PageUrls} constant values.
   * @result true if string contains any of the PageURls
   */
  public static isValidUrl(url: string, validUrls?: string[]): boolean {
    const urlStr: string[] = url.split('?');
    const baseUrl: string = urlStr[0];
    if (baseUrl === LegacyUrls.SIGN_IN || baseUrl === LegacyUrls.SIGN_UP || baseUrl === '/' || baseUrl === '#') {
      return true;
    }
    validUrls = CollectionUtils.isNotEmpty(validUrls) ? validUrls : Object.values(PageUrls);
    for (const validUrl of validUrls) {
      if (validUrl === '/' || validUrl === '#') {
        continue;
      }
      if (baseUrl.includes(validUrl)) {
        return true;
      }
    }
    return false;
  }
}
