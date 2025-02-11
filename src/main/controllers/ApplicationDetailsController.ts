import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { findSelectedGenericTseApplication } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getAllResponses,
  getApplicationContent,
  getDecisionContent,
  isApplicationVisible,
  isResponseToTribunalRequired,
} from '../helpers/controller/ApplicationDetailsHelper';
import { getApplicationDisplayByCode } from '../helpers/controller/ContactTribunalHelper';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (!isApplicationVisible(selectedApplication)) {
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
      appContent: getApplicationContent(selectedApplication, req),
      allResponses: getAllResponses(selectedApplication, req),
      decisionContent: getDecisionContent(selectedApplication, req),
      isRespondButton: isResponseToTribunalRequired(selectedApplication),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
