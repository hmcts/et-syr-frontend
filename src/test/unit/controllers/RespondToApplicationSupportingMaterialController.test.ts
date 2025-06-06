import RespondToApplicationSupportingMaterialController from '../../../main/controllers/RespondToApplicationSupportingMaterialController';
import { Applicant, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Application Supporting Material Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: RespondToApplicationSupportingMaterialController;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToApplicationSupportingMaterialController();
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL', () => {
      const req = mockRequestWithTranslation({}, translationJsons);
      controller.get(req, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL,
        expect.objectContaining({ hideContactUs: true })
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY page', async () => {
      const req = mockRequest({
        body: {},
        session: {
          userCase: {
            selectedGenericTseApplication: {
              value: {
                applicant: Applicant.RESPONDENT,
                type: application.CHANGE_PERSONAL_DETAILS.code,
              },
            },
            supportingMaterialFile: {
              document_binary_url: 'https://dummy.document.url/binary',
              document_url: 'https://dummy.document.url',
              document_filename: 'test.pdf',
            },
          },
        },
      });
      await controller.post(req, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY + languages.ENGLISH_URL_PARAMETER
      );
    });
  });

  it('should handle file upload and redirect on error', async () => {
    const req = mockRequest({
      body: { upload: 'true' },
      session: { userCase: {} },
    });
    await controller.post(req, response);
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL + languages.ENGLISH_URL_PARAMETER
    );
  });
});
