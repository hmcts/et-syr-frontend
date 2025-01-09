import RespondToTribunalSupportingMaterialController from '../../../main/controllers/RespondToTribunalSupportingMaterialController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Tribunal Supporting Material Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: RespondToTribunalSupportingMaterialController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToTribunalSupportingMaterialController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY page', () => {
      request = mockRequest({ body: {} });
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + '?lng=en');
    });
  });
});
