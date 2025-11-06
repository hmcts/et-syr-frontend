import AxiosInstance from 'axios';
import { Response } from 'express';

import RespondToNotificationStoredSubmitController from '../../../main/controllers/RespondToNotificationStoredSubmitController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, TranslationKeys, languages } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../mocks/mockUser';

describe('Respond to Notification Stored to Submit Controller', () => {
  let controller: RespondToNotificationStoredSubmitController;
  let req: AppRequest;
  let res: Response;

  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    submitStoredResponseToNotification: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
  caseApi.submitStoredResponseToNotification = jest
    .fn()
    .mockResolvedValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  beforeEach(() => {
    controller = new RespondToNotificationStoredSubmitController();
    req = mockRequestWithTranslation({}, { ...applicationTypeJson });
    req.session.user = mockUserDetails;
    req.session.userCase.sendNotificationCollection = mockSendNotificationCollection;
    res = mockResponse();
  });

  describe('POST method', () => {
    it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE', async () => {
      req.body = { confirmCopied: YesOrNo.YES };
      req.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      req.params.responseId = '1309897b-5d71-4987-b4fc-04ae917a9cf5';

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/respond-to-notification-complete?lng=en');
    });

    it('should return error when confirmCopied empty', async () => {
      req.body = {};
      req.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      req.params.responseId = '1309897b-5d71-4987-b4fc-04ae917a9cf5';

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        '/respond-to-notification-stored-submit/d416f43f-10f4-402a-bdf1-ea9012a553d7/1309897b-5d71-4987-b4fc-04ae917a9cf5?lng=en'
      );
    });
  });

  describe('GET method', () => {
    it('should render application details if application exists', async () => {
      req.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      req.params.responseId = '1309897b-5d71-4987-b4fc-04ae917a9cf5';

      controller.get(req, res as Response);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.STORED_CORRESPONDENCE_SUBMIT,
        expect.objectContaining({
          viewCorrespondenceLink: '/notification-details/d416f43f-10f4-402a-bdf1-ea9012a553d7?lng=en',
        })
      );
    });

    it('should redirect to NOT_FOUND if itemId invalid', async () => {
      req.params.itemId = 'test';

      controller.get(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to NOT_FOUND if responseId invalid', async () => {
      req.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      req.params.responseId = 'test';

      controller.get(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
