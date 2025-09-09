import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { LinkStatus } from '../definitions/links';
import { getApplicationStatusAfterViewed } from '../helpers/ApplicationStateHelper';
import {
  findSelectedGenericTseApplication,
  getApplicationDisplay,
  isResponseToTribunalRequired,
} from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getSelectedStoredApplication } from '../helpers/StoredApplicationHelper';
import {
  getAllResponses,
  getApplicationContent,
  getDecisionContent,
  isNeverResponseBefore,
} from '../helpers/controller/ApplicationDetailsHelper';
import { isApplicationShare } from '../helpers/controller/ClaimantsApplicationsHelper';
import { isYourApplication } from '../helpers/controller/YourRequestAndApplicationsHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('ApplicationDetailsController');

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem =
      findSelectedGenericTseApplication(req) ?? getSelectedStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (
      !isYourApplication(selectedApplication.value, req.session.user) &&
      !isApplicationShare(selectedApplication.value)
    ) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_SHARE + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      const newStatus: LinkStatus = getApplicationStatusAfterViewed(selectedApplication.value, req.session.user);
      if (newStatus) {
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req, selectedApplication, newStatus);
      }
    } catch (error) {
      logger.error(TseErrors.ERROR_UPDATE_LINK_STATUS);
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
      isRespondButton: isNeverResponseBefore(selectedApplication.value, req.session.user),
      isAdminRespondButton: isResponseToTribunalRequired(selectedApplication.value, req.session.user),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
