import { Response } from 'express';

import StoredTseSubmitFormController from '../../../main/controllers/StoredTseSubmitFormController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

describe('StoredTseSubmitFormController', () => {
  let controller: StoredTseSubmitFormController;
  let req: AppRequest;
  let res: Response;

  beforeEach(() => {
    controller = new StoredTseSubmitFormController();
    req = mockRequest({});
    res = mockResponse();
  });

  describe('POST method', () => {
    it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE', async () => {
      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE);
    });
  });

  describe('GET method', () => {
    it('should render application details if application exists', async () => {
      req = mockRequestWithTranslation({}, { ...applicationTypeJson });
      req.session.user = mockUserDetails;
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
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
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';

      await controller.get(req, res as Response);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.STORED_TSE_SUBMIT_FORM,
        expect.objectContaining({
          applicationType: 'Amend my response',
          viewCorrespondenceLink: '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en',
          viewCorrespondenceFileLink:
            '<a href="/getSupportingMaterial/04ee9057-4d4b-44d0-b371-6bb396f078ca" target="_blank">Attachment.txt</a><br>',
        })
      );
    });

    it('should redirect to NOT_FOUND if application does not exist', async () => {
      await controller.get(req, res as Response);
      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });
});
