import { AppRequest } from '../definitions/appRequest';
import { Representative, RespondentET3Model } from '../definitions/case';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';

export class RespondentUtils {
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
   * Finds the representative associated with the currently selected respondent in the user’s session.
   *
   * This method retrieves the `userCase` and the currently selected respondent index from the request session.
   * It then checks if both respondents and representatives exist, and if a valid respondent is selected.
   * If a representative is linked to the selected respondent (by matching `respondentId` with the respondent's `ccdId`),
   * that representative is returned. Otherwise, the method returns `undefined`.
   *
   * @param req - The application request object containing session data, including `userCase` and `selectedRespondentIndex`.
   * @returns The {@link Representative} associated with the selected respondent, or `undefined` if no match is found
   * or if required data is missing.
   *
   * @remarks
   * - Returns `undefined` if the session or user case is not properly initialized.
   * - Relies on `CollectionUtils.isEmpty` and `NumberUtils.isEmpty` to validate data presence.
   * - The association is based on `representative.respondentId === selectedRespondent.ccdId`.
   *
   * @example
   * ```typescript
   * const representative = CaseHelper.findSelectedRespondentRepresentative(req);
   * if (representative) {
   *   console.log(`Representative: ${representative.name}`);
   * } else {
   *   console.log('No representative found for the selected respondent.');
   * }
   * ```
   */
  public static findSelectedRespondentRepresentative(req: AppRequest): Representative {
    const userCase = req?.session?.userCase;
    const selectedIndex = req?.session?.selectedRespondentIndex;
    if (
      !userCase ||
      CollectionUtils.isEmpty(userCase.respondents) ||
      CollectionUtils.isEmpty(userCase.representatives) ||
      NumberUtils.isEmpty(selectedIndex)
    ) {
      return undefined;
    }
    const selectedRespondent = userCase.respondents[selectedIndex];
    if (!selectedRespondent?.ccdId) {
      return undefined;
    }
    for (const representative of userCase.representatives) {
      if (representative?.respondentId === selectedRespondent.ccdId) {
        return representative;
      }
    }
    return undefined;
  }
}
