import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { getHearingCollection } from '../helpers/HearingHelper';

export default class HearingDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session.userCase;
    res.render(TranslationKeys.HEARING_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.HEARING_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hearingDetailsCollection: getHearingCollection(
        userCase.hearingCollection,
        userCase.sendNotificationCollection,
        req
      ),
      hideContactUs: true,
    });
  };
}
