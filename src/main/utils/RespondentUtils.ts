import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';

export default class RespondentUtils {
  public static findSelectedRespondentByRequest(request: AppRequest): RespondentET3Model {
    if (
      CollectionUtils.isEmpty(request?.session?.userCase?.respondents) ||
      NumberUtils.isEmpty(request?.session?.selectedRespondentIndex)
    ) {
      return undefined;
    }
    return request.session.userCase.respondents[request.session.selectedRespondentIndex];
  }
}
