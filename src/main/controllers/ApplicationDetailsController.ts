import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
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
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('ApplicationDetailsController');

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      const newStatus: LinkStatus = getApplicationStatusAfterViewed(selectedApplication.value, req.session.user);
      if (newStatus) {
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req, selectedApplication, newStatus);
        changeApplicationState(selectedApplication.value, req.session.user, newStatus);
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
      isRespondButton: isResponseToTribunalRequired(selectedApplication.value, req.session.user),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
