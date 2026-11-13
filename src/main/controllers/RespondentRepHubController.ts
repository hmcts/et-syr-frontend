import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { ET3CaseDetailsLinksStatuses } from '../definitions/links';
import { getProgressBarItems } from '../helpers/ProgressBarHelpers';
import { getET3CaseDetailsLinkNames } from '../helpers/controller/CaseDetailsHelper';
import { getSectionsList } from '../helpers/controller/RespondentRepHubHelper';
import StringUtils from '../utils/StringUtils';

export default class RespondentRepHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];
    const et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses = await getET3CaseDetailsLinkNames(
      selectedRespondent.et3CaseDetailsLinksStatuses,
      req
    );

    res.render(TranslationKeys.REP_CASE_OVERVIEW, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
      userCase: req.session.userCase,
      respondentName: getRespondentName(selectedRespondent),
      progressBarItems: getProgressBarItems(selectedRespondent, req.session.userCase, {
        ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
      }),
      sections: getSectionsList(et3CaseDetailsLinksStatuses, selectedRespondent, req),
    });
  }
}

const getRespondentName = (selectedRespondent: RespondentET3Model): string => {
  if (StringUtils.isNotBlank(selectedRespondent.respondentName)) {
    return selectedRespondent.respondentName;
  }
  if (StringUtils.isNotBlank(selectedRespondent.respondentOrganisation)) {
    return selectedRespondent.respondentOrganisation;
  }
  return selectedRespondent.respondentFirstName + ' ' + selectedRespondent.respondentLastName;
};
