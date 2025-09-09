import AxiosInstance from 'axios';
import { Response } from 'express';

import ContactTribunalSubmitStoredController from '../../../main/controllers/ContactTribunalSubmitStoredController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

describe('StoredApplicationSubmitController', () => {
  let controller: ContactTribunalSubmitStoredController;
  let req: AppRequest;
  let res: Response;

  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    submitStoredRespondentTse: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
  caseApi.submitStoredRespondentTse = jest
    .fn()
    .mockResolvedValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  beforeEach(() => {
    controller = new ContactTribunalSubmitStoredController();

    req = mockRequestWithTranslation({}, { ...applicationTypeJson });
    req.session.user = mockUserDetails;
    req.session.userCase.tseRespondentStoredCollection = [
      {
        id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
        value: {
          applicant: Applicant.RESPONDENT,
          applicantIdamId: 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78',
          type: application.AMEND_RESPONSE.code,
          documentUpload: {
            document_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca',
            document_filename: 'Attachment.txt',
            document_binary_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca/binary',
          },
          copyToOtherPartyYesOrNo: YesOrNo.YES,
          dueDate: '10 February 2025',
        },
      },
    ];

    res = mockResponse();
  });

  describe('POST method', () => {
    it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE', async () => {
      req.body = { confirmCopied: YesOrNo.YES };
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should return error when confirmCopied empty', async () => {
      req.body = {};
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7') +
          languages.ENGLISH_URL_PARAMETER
      );
    });
  });

  describe('GET method', () => {
    it('should render application details if application exists', async () => {
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';

      await controller.get(req, res as Response);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.STORED_APPLICATION_SUBMIT,
        expect.objectContaining({
          title: 'Amend my response',
          viewCorrespondenceLink: '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en',
          viewCorrespondenceFileLink:
            '<a href="/getSupportingMaterial/04ee9057-4d4b-44d0-b371-6bb396f078ca" target="_blank">Attachment.txt</a><br>',
        })
      );
    });

    it('should redirect to NOT_FOUND if appId invalid', async () => {
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = 'test';

      await controller.get(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to NOT_FOUND if user id invalid', async () => {
      req.session.user.id = 'test';
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';

      await controller.get(req, res as Response);

      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
