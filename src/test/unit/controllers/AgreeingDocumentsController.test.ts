import AgreeingDocumentsController from '../../../main/controllers/AgreeingDocumentsController';
import { AgreedDocuments } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import agreeingDocumentsJson from '../../../main/resources/locales/en/translation/agreeing-documents.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Agreeing documents controller', () => {
  let controller: AgreeingDocumentsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new AgreeingDocumentsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the agreeing documents page', () => {
      const translatedRequest = mockRequestWithTranslation({}, agreeingDocumentsJson);
      controller.get(translatedRequest, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.AGREEING_DOCUMENTS, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when Yes is selected', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.YES,
        },
      });
      await controller.post(request, response);
      expect(request.session.userCase.bundlesRespondentAgreedDocWith).toBe(AgreedDocuments.YES);
      expect(request.session.userCase.bundlesRespondentAgreedDocWithBut).toBeUndefined();
      expect(request.session.userCase.bundlesRespondentAgreedDocWithNo).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when agreed but with disputed documents details', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT,
          bundlesRespondentAgreedDocWithBut: 'These documents are disputed',
        },
      });
      await controller.post(request, response);
      expect(request.session.userCase.bundlesRespondentAgreedDocWith).toBe(AgreedDocuments.AGREEDBUT);
      expect(request.session.userCase.bundlesRespondentAgreedDocWithBut).toBe('These documents are disputed');
      expect(request.session.userCase.bundlesRespondentAgreedDocWithNo).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when not agreed with reason', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.NOTAGREED,
          bundlesRespondentAgreedDocWithNo: 'Could not agree with the other party',
        },
      });
      await controller.post(request, response);
      expect(request.session.userCase.bundlesRespondentAgreedDocWith).toBe(AgreedDocuments.NOTAGREED);
      expect(request.session.userCase.bundlesRespondentAgreedDocWithNo).toBe('Could not agree with the other party');
      expect(request.session.userCase.bundlesRespondentAgreedDocWithBut).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to the same page when no option is selected', async () => {
      request = mockRequest({ body: {} });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.AGREEING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([
        { propertyName: 'bundlesRespondentAgreedDocWith', errorType: 'required' },
      ]);
    });

    it('should redirect to the same page when agreed but is selected but details are empty', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.AGREEING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([
        { propertyName: 'bundlesRespondentAgreedDocWithBut', errorType: 'required' },
      ]);
    });

    it('should redirect to the same page when not agreed is selected but reason is empty', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.NOTAGREED,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.AGREEING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([
        { propertyName: 'bundlesRespondentAgreedDocWithNo', errorType: 'required' },
      ]);
    });

    it('should redirect to the same page when agreed but details exceed 2500 characters', async () => {
      request = mockRequest({
        body: {
          bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT,
          bundlesRespondentAgreedDocWithBut: '1'.repeat(2501),
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.AGREEING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([
        { propertyName: 'bundlesRespondentAgreedDocWithBut', errorType: 'tooLong' },
      ]);
    });
  });
});
