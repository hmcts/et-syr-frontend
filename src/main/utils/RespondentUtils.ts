import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';

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

  /**
   * Determines whether the currently selected respondent is represented.
   *
   * This method checks the current request's session to identify if a representative
   * is assigned to the selected respondent. It performs the following steps:
   * 1. Verifies that there is at least one representative in the user case.
   * 2. Retrieves the respondent selected in the request context.
   * 3. Iterates over the list of representatives and checks if any of them
   *    are associated with the respondent via matching `respondentId`.
   *
   * @param req - The current HTTP request object, containing the session and user case context.
   * @returns `true` if the selected respondent has a matching representative; otherwise, `false`.
   */
  public static respondentRepresented(req: AppRequest): boolean {
    if (CollectionUtils.isEmpty(req.session.userCase?.representatives)) {
      return false;
    }
    const respondent: RespondentET3Model = this.findSelectedRespondentByRequest(req);
    if (ObjectUtils.isEmpty(respondent)) {
      return false;
    }
    for (const representative of req.session.userCase.representatives) {
      if (representative.respondentId === respondent.ccdId) {
        return true;
      }
    }
    return false;
  }
}
