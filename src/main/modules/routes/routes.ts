import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import ChecklistController from '../../controllers/ChecklistController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import HomeController from '../../controllers/HomeController';
import RespondentRepliesController from '../../controllers/RespondentRepliesController';
import RespondentResponseLandingController from '../../controllers/RespondentResponseLandingController';
import RespondentResponseTaskListController from '../../controllers/RespondentResponseTaskListController';
import ResponseHubController from '../../controllers/ResponseHubController';
import SelfAssignmentCaseReferenceNumberController from '../../controllers/SelfAssignmentCaseReferenceNumberController';
import SelfAssignmentDetailsController from '../../controllers/SelfAssignmentDetailsController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import { PageUrls, Urls } from '../../definitions/constants';

export class Routes {
  public enableFor(app: Application): void {
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER, new SelfAssignmentCaseReferenceNumberController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER, new SelfAssignmentCaseReferenceNumberController().post);
    app.get(PageUrls.SELF_ASSIGNMENT_DETAILS, new SelfAssignmentDetailsController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_DETAILS, new SelfAssignmentDetailsController().post);
    app.get(PageUrls.RESPONDENT_REPLIES, new RespondentRepliesController().get);
    app.get(PageUrls.RESPONSE_HUB, new ResponseHubController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_LANDING, new RespondentResponseLandingController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_TASK_LIST, new RespondentResponseTaskListController().get);
    app.get(Urls.EXTEND_SESSION, new SessionTimeoutController().getExtendSession);
    app.get(
      Urls.INFO,
      infoRequestHandler({
        extraBuildInfo: {
          host: os.hostname(),
          name: 'et-syr-frontend',
          uptime: process.uptime(),
        },
        info: {},
      })
    );
  }
}
