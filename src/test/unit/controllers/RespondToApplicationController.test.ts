import RespondToApplicationController from '../../../main/controllers/RespondToApplicationController';
import { YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, PageUrls, PartiesRespond, TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respond to Application Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: RespondToApplicationController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToApplicationController();
    request = mockRequestWithTranslation({}, translationJsons);
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_APPLICATION', () => {
      request.session.userCase.genericTseApplicationCollection = [
        {
          id: '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e',
          value: {
            applicant: Applicant.RESPONDENT,
            respondCollection: [
              {
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                },
              },
            ],
          },
        },
      ];
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION, expect.anything());
    });

    it('should redirect to NOT_FOUND page if missing appId', () => {
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.params.appId = undefined;
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if application undefined', () => {
      request.session.userCase.genericTseApplicationCollection = undefined;
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to NOT_FOUND page if userCase undefined', () => {
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.userCase = undefined;
      controller.get(request, response);
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
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.post(request, response);
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.YES);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL + '?lng=en');
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
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.post(request, response);
      expect(request.session.userCase.responseText).toEqual('Test response');
      expect(request.session.userCase.hasSupportingMaterial).toEqual(YesOrNo.NO);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY + '?lng=en');
    });

    it('should redirect to RESPOND_TO_APPLICATION if nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        '/respond-to-application/5d0118c9-bdd6-4d32-9131-6aa6f5ec718e?lng=en'
      );
      const errors = [{ propertyName: 'responseText', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to RESPOND_TO_APPLICATION if responseText exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          responseText: '1'.repeat(2501),
          hasSupportingMaterial: YesOrNo.NO,
        },
      });
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.session.errors = [];
      request.params.appId = '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e';
      controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        '/respond-to-application/5d0118c9-bdd6-4d32-9131-6aa6f5ec718e?lng=en'
      );
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
