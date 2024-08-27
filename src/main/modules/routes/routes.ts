import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import ChecklistController from '../../controllers/ChecklistController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import HomeController from '../../controllers/HomeController';
import RespondentCaseListCheckController from '../../controllers/RespondentCaseListCheckController';
import RespondentRepliesController from '../../controllers/RespondentRepliesController';
import RespondentResponseLandingController from '../../controllers/RespondentResponseLandingController';
import ResponseHubController from '../../controllers/ResponseHubController';
import SelfAssignmentCheckController from '../../controllers/SelfAssignmentCheckController';
import SelfAssignmentFormController from '../../controllers/SelfAssignmentFormController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import { PageUrls, Urls } from '../../definitions/constants';
import RespondentResponseTaskListController from '../../controllers/RespondentResponseTaskListController';
import RespondentAddressController from '../../controllers/RespondentAddressController';
import RespondentNameController from '../../controllers/RespondentNameController';
import TypeOfOrganisationController from '../../controllers/TypeOfOrganisationController';
import RespondentEnterPostCodeController from '../../controllers/RespondentEnterPostCodeController';
import RespondentSelectPostCodeController from '../../controllers/RespondentSelectPostCodeController';

export class Routes {
  public enableFor(app: Application): void {
    app.get(PageUrls.HOME, new HomeController().get);
    app.get(PageUrls.CHECKLIST, new ChecklistController().get);
    app.get(PageUrls.RESPONDENT_CASE_LIST_CHECK, new RespondentCaseListCheckController().get);
    app.get(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_FORM, new SelfAssignmentFormController().post);
    app.get(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().get);
    app.post(PageUrls.SELF_ASSIGNMENT_CHECK, new SelfAssignmentCheckController().post);
    app.get(PageUrls.RESPONDENT_REPLIES, new RespondentRepliesController().get);
    app.get(PageUrls.RESPONSE_HUB, new ResponseHubController().get);
    app.get(PageUrls.COOKIE_PREFERENCES, new CookiePreferencesController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_LANDING, new RespondentResponseLandingController().get);
    app.get(PageUrls.RESPONDENT_RESPONSE_TASK_LIST, new RespondentResponseTaskListController().get);
    app.get(PageUrls.RESPONDENT_NAME, new RespondentNameController().get);
    app.get(PageUrls.TYPE_OF_ORGANISATION, new TypeOfOrganisationController().get);
    app.get(PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().get);
    app.get(PageUrls.RESPONDENT_ENTER_POST_CODE, new RespondentEnterPostCodeController().get);
    app.get(PageUrls.RESPONDENT_SELECT_POST_CODE, new RespondentSelectPostCodeController().get);
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
