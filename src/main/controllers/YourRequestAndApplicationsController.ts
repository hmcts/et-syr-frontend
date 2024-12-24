import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getApplicationCollection } from '../helpers/controller/YourRequestAndApplicationsHelper';

export default class YourRequestAndApplicationsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    res.render(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_REQUEST_AND_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      appList: getApplicationCollection(req.session.userCase, req.url, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
        ...req.t(TranslationKeys.DISPLAY_STATUS, { returnObjects: true }),
      }),
    });
  };
}
