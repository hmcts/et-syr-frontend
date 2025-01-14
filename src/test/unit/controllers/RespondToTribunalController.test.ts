import RespondToTribunalController from '../../../main/controllers/RespondToTribunalController';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Tribunal Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: RespondToTribunalController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToTribunalController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_TRIBUNAL', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      request.session.userCase = mockUserCase;
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.params.appId = '1';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_TRIBUNAL, expect.anything());
    });

    it('should redirect to NOT_FOUND page if missing appId', async () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if application invalid', async () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.genericTseApplicationCollection = undefined;
      request.params.appId = '1';
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if missing userCase', async () => {
      request.session.userCase = undefined;
      await controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });
  });

  describe('POST method', () => {
    it('should redirect to SUPPORTING_MATERIAL page if hasSupportingMaterial is YES', () => {
      request = mockRequest({
        body: {
          hasSupportingMaterial: YesOrNo.YES,
        },
      });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '1';
      controller.post(request, response);
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.YES);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL + '?lng=en');
    });

    it('should redirect to COPY_TO_OTHER_PARTY page if hasSupportingMaterial is NO', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '1';
      controller.post(request, response);
      expect(request.session.userCase.responseText).toEqual('Test response');
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.NO);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + '?lng=en');
    });

    it('should redirect to RESPOND_TO_TRIBUNAL if nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '1';
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/respond-to-tribunal/1?lng=en');
      const errors = [{ propertyName: 'responseText', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to RESPOND_TO_TRIBUNAL if responseText exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          responseText: '1'.repeat(2501),
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '1';
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/respond-to-tribunal/1?lng=en');
      const errors = [{ propertyName: 'responseText', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to NOT_FOUND if no selected application is found', async () => {
      request = mockRequest({
        body: {
          responseText: 'Test response',
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.genericTseApplicationCollection = undefined;
      request.session.errors = [];
      request.params.appId = '1';
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
    });
  });
});
