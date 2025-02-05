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
  isResponseToTribunalRequired,
} from '../helpers/controller/ApplicationDetailsHelper';
import { isClaimantAppsShare } from '../helpers/controller/ClaimantsApplicationsHelper';
import { getApplicationDisplayByClaimantCode } from '../helpers/controller/ContactTribunalHelper';

export default class ClaimantsApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (!isClaimantAppsShare(selectedApplication)) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationType: getApplicationDisplayByClaimantCode(selectedApplication.value.type, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication, req),
      allResponses: getAllResponses(selectedApplication, req),
      decisionContent: getDecisionContent(selectedApplication, req),
      isRespondButton: isResponseToTribunalRequired(selectedApplication),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_TRIBUNAL.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
