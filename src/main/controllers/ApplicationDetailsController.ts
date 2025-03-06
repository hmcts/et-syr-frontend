import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';
import { changeApplicationState } from '../helpers/ApplicationStateHelper';
import { findSelectedGenericTseApplication, getApplicationDisplay } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getAllResponses,
  getApplicationContent,
  getApplicationStatusAfterViewed,
  getDecisionContent,
  isResponseToTribunalRequired,
} from '../helpers/controller/ApplicationDetailsHelper';
import { getCaseApi } from '../services/CaseService';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      const newStatus: LinkStatus = getApplicationStatusAfterViewed(selectedApplication.value, req.session.user);
      if (newStatus) {
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req, selectedApplication, newStatus);
        changeApplicationState(selectedApplication.value, req.session.user, newStatus);
      }
    } catch (error) {
      res.redirect(ErrorPages.NOT_FOUND);
    }

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationType: getApplicationDisplay(selectedApplication.value, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication.value, req),
      allResponses: getAllResponses(selectedApplication.value, req),
      decisionContent: getDecisionContent(selectedApplication.value, req),
      isRespondButton: isResponseToTribunalRequired(selectedApplication.value, req.session.user),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
