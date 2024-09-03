import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import ChecklistController from '../../controllers/ChecklistController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import HomeController from '../../controllers/HomeController';
import NewSelfAssignmentRequestController from '../../controllers/NewSelfAssignmentRequestController';
import CaseListCheckController from '../../controllers/CaseListCheckController';
import CaseListController from '../../controllers/CaseListController';
import RespondentResponseLandingController from '../../controllers/RespondentResponseLandingController';
import RespondentResponseTaskListController from '../../controllers/RespondentResponseTaskListController';
import ResponseHubController from '../../controllers/ResponseHubController';
import SelfAssignmentCheckController from '../../controllers/SelfAssignmentCheckController';
import SelfAssignmentFormController from '../../controllers/SelfAssignmentFormController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import { PageUrls, Urls } from '../../definitions/constants';

export class Routes {
  public enableFor(app: Application): void {
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.CASE_LIST_CHECK, new CaseListCheckController().get);
    app.get(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().post);
    app.get(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().post);
    app.get(PageUrls.CASE_LIST, new CaseListController().get);
    app.get(PageUrls.RESPONSE_HUB, new ResponseHubController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_LANDING, new RespondentResponseLandingController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_TASK_LIST, new RespondentResponseTaskListController().get);
    app.get(PageUrls.NEW_SELF_ASSIGNMENT_REQUEST, new NewSelfAssignmentRequestController().get);
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
