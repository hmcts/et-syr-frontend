import ContactTribunalStoreCompleteController from '../../../main/controllers/ContactTribunalStoreCompleteController';
import { YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, TranslationKeys, languages } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

describe('Contact Tribunal Store Complete Controller', () => {
  let controller: ContactTribunalStoreCompleteController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalStoreCompleteController();

    req = mockRequest({});
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

  describe('GET method', () => {
    it('should render the page', () => {
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7';
      controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, expect.anything());
    });

    it('should return error when appId invalid', () => {
      req.session.user.id = 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78';
      req.params.appId = 'test';
      controller.get(req, res);
      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
