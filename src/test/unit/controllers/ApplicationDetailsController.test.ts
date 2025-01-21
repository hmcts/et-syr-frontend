import ApplicationDetailsController from '../../../main/controllers/ApplicationDetailsController';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Application Details Controller', () => {
  const translationJsons = { ...applicationTypeJson, ...commonJson };
  let controller: ApplicationDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ApplicationDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page APPLICATION_DETAILS', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      request.session.userCase = mockUserCase;
      request.session.userCase.genericTseApplicationCollection = mockGenericTseCollection;
      request.params.appId = '1';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.APPLICATION_DETAILS,
        expect.objectContaining({
          applicationType: 'Amend my response',
        })
      );
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
});
