import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys } from '../definitions/constants';
import { getTaskSectionsForRep } from '../helpers/controller/RepResponseLandingHelper';

export default class RepResponseTaskListController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const selectedRespondent: RespondentET3Model =
      req.session.userCase.respondents[req.session.selectedRespondentIndex];

    res.render(TranslationKeys.REP_RESPONSE_TASK_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
      sections: getTaskSectionsForRep(selectedRespondent, req),
      hideContactUs: true,
    });
  }
}
