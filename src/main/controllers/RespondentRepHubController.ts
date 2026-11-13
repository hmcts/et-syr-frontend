import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { ET3CaseDetailsLinksStatuses } from '../definitions/links';
import { getProgressBarItems } from '../helpers/ProgressBarHelpers';
import { getET3CaseDetailsLinkNames, getRespondentName, getSections } from '../helpers/controller/CaseDetailsHelper';
import { CaseOverviewSectionIndexForRep } from '../helpers/controller/RespondentRepHubHelper';

export default class RespondentRepHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];

    const et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses = await getET3CaseDetailsLinkNames(
      selectedRespondent.et3CaseDetailsLinksStatuses,
      req
    );

    res.render(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      userCase: req.session.userCase,
      respondentName: getRespondentName(selectedRespondent),
      progressBarItems: getProgressBarItems(selectedRespondent, req.session.userCase, {
        ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
      }),
      sections: getSections(CaseOverviewSectionIndexForRep, et3CaseDetailsLinksStatuses, selectedRespondent, req),
    });
  }
}
