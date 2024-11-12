import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
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
}
