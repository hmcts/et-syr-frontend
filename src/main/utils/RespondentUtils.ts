import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import {
  RespondentSolicitorType,
  getRespondentSolicitorTypeByIndex,
} from '../definitions/enums/respondentSolicitorType';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';

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
    const currentSolicitorType = getRespondentSolicitorTypeByIndex(req.session.selectedRespondentIndex);
    const policyMap: Record<RespondentSolicitorType, string> = {
      [RespondentSolicitorType.SOLICITORA]: 'respondentOrganisationPolicy0',
      [RespondentSolicitorType.SOLICITORB]: 'respondentOrganisationPolicy1',
      [RespondentSolicitorType.SOLICITORC]: 'respondentOrganisationPolicy2',
      [RespondentSolicitorType.SOLICITORD]: 'respondentOrganisationPolicy3',
      [RespondentSolicitorType.SOLICITORE]: 'respondentOrganisationPolicy4',
      [RespondentSolicitorType.SOLICITORF]: 'respondentOrganisationPolicy5',
      [RespondentSolicitorType.SOLICITORG]: 'respondentOrganisationPolicy6',
      [RespondentSolicitorType.SOLICITORH]: 'respondentOrganisationPolicy7',
      [RespondentSolicitorType.SOLICITORI]: 'respondentOrganisationPolicy8',
      [RespondentSolicitorType.SOLICITORJ]: 'respondentOrganisationPolicy9',
    };

    const policyKey = policyMap[currentSolicitorType];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const policy = req.session.userCase?.[policyKey];

    // Return true only if the policy exists and its organization is defined
    return ObjectUtils.isNotEmpty(policy?.Organisation);
  }
}
