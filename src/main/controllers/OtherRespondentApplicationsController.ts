import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getOtherRespondentApplications } from '../helpers/controller/OtherRespondentApplicationsHelper';

export default class OtherRespondentApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    res.render(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.OTHER_RESPONDENT_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      appList: getOtherRespondentApplications(req),
    });
  };
}
