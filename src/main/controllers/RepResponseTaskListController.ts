import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { buildRepTaskListSections } from '../helpers/controller/RepResponseTaskListHelper';

export default class RepResponseTaskListController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    res.render(TranslationKeys.REP_RESPONSE_TASK_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
      sections: buildRepTaskListSections(req),
      hideContactUs: true,
    });
  }
}
