import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { ET3CaseDetailsLinksStatuses } from '../definitions/links';
import { getET3CaseDetailsLinkNames } from '../helpers/controller/CaseDetailsHelper';
import { getSectionsList } from '../helpers/controller/RespondentRepHubHelper';

export default class RespondentRepHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];

    const et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses = await getET3CaseDetailsLinkNames(
      selectedRespondent.et3CaseDetailsLinksStatuses,
      req
    );
    const sections = getSectionsList(et3CaseDetailsLinksStatuses, selectedRespondent, req);

    res.render(TranslationKeys.REP_CASE_OVERVIEW, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      sections,
    });
  }
}
