import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../definitions/constants';
import {
  findSelectedGenericTseApplication,
  getAllTseApplicationCollection,
  getTseApplicationDetails,
} from '../helpers/GenericTseApplicationHelper';
import { getApplicationDisplayByCode } from '../helpers/controller/ContactTribunalHelper';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      getAllTseApplicationCollection(userCase),
      req.params.appId
    );

    let appContent;
    try {
      appContent = getTseApplicationDetails(selectedApplication, req.url, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      });
    } catch (err) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationType: getApplicationDisplayByCode(selectedApplication.value.type, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent,
    });
  };
}
