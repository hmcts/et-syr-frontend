import os from 'os';

import { infoRequestHandler } from '@hmcts/info-provider';
import { Application } from 'express';

import ChecklistController from '../../controllers/ChecklistController';
import CookiePreferencesController from '../../controllers/CookiePreferencesController';
import HomeController from '../../controllers/HomeController';
import RespondentAddressController from '../../controllers/RespondentAddressController';
import NewSelfAssignmentRequestController from '../../controllers/NewSelfAssignmentRequestController';
import RespondentCaseListCheckController from '../../controllers/RespondentCaseListCheckController';
import RespondentContactPhoneNumberController from '../../controllers/RespondentContactPhoneNumberController';
import RespondentContactPreferencesController from '../../controllers/RespondentContactPreferencesController';
import RespondentDXAddressController from '../../controllers/RespondentDXAddressController';
import RespondentEnterAddressController from '../../controllers/RespondentEnterAddressController';
import RespondentEnterPostCodeController from '../../controllers/RespondentEnterPostCodeController';
import RespondentNameController from '../../controllers/RespondentNameController';
import RespondentPreferredContactNameController from '../../controllers/RespondentPreferredContactNameController';
import RespondentRepliesController from '../../controllers/RespondentRepliesController';
import RespondentResponseLandingController from '../../controllers/RespondentResponseLandingController';
import RespondentResponseTaskListController from '../../controllers/RespondentResponseTaskListController';
import RespondentSelectPostCodeController from '../../controllers/RespondentSelectPostCodeController';
import ResponseHubController from '../../controllers/ResponseHubController';
import SelfAssignmentCheckController from '../../controllers/SelfAssignmentCheckController';
import SelfAssignmentFormController from '../../controllers/SelfAssignmentFormController';
import SessionTimeoutController from '../../controllers/SessionTimeoutController';
import TypeOfOrganisationController from '../../controllers/TypeOfOrganisationController';
import { PageUrls, Urls } from '../../definitions/constants';

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
    app.post(PageUrls.RESPONDENT_NAME, new RespondentNameController().post);
    app.get(PageUrls.TYPE_OF_ORGANISATION, new TypeOfOrganisationController().get);
    app.post(PageUrls.TYPE_OF_ORGANISATION, new TypeOfOrganisationController().post);
    app.get(PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().get);
    app.post(PageUrls.RESPONDENT_ADDRESS, new RespondentAddressController().post);
    app.get(PageUrls.RESPONDENT_ENTER_POST_CODE, new RespondentEnterPostCodeController().get);
    app.post(PageUrls.RESPONDENT_ENTER_POST_CODE, new RespondentEnterPostCodeController().post);
    app.get(PageUrls.RESPONDENT_SELECT_POST_CODE, new RespondentSelectPostCodeController().get);
    app.post(PageUrls.RESPONDENT_SELECT_POST_CODE, new RespondentSelectPostCodeController().post);
    app.get(PageUrls.RESPONDENT_ENTER_ADDRESS, new RespondentEnterAddressController().get);
    app.post(PageUrls.RESPONDENT_ENTER_ADDRESS, new RespondentEnterAddressController().post);
    app.get(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME, new RespondentPreferredContactNameController().get);
    app.post(PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME, new RespondentPreferredContactNameController().post);
    app.get(PageUrls.RESPONDENT_DX_ADDRESS, new RespondentDXAddressController().get);
    app.post(PageUrls.RESPONDENT_DX_ADDRESS, new RespondentDXAddressController().post);
    app.get(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER, new RespondentContactPhoneNumberController().get);
    app.post(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER, new RespondentContactPhoneNumberController().post);
    app.get(PageUrls.RESPONDENT_CONTACT_PREFERENCES, new RespondentContactPreferencesController().get);
    app.post(PageUrls.RESPONDENT_CONTACT_PREFERENCES, new RespondentContactPreferencesController().post);
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
