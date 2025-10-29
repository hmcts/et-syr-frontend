import RespondToNotificationCopyOfflineController from '../../../main/controllers/RespondToNotificationCopyOfflineController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Notification Copy to Other Party Offline Controller', () => {
  let controller: RespondToNotificationCopyOfflineController;
  let request: ReturnType<typeof mockRequestWithTranslation>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToNotificationCopyOfflineController();
    request = mockRequestWithTranslation({}, { ...applicationTypeJson });
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page COPY_TO_OTHER_PARTY', () => {
      request.session.userCase = mockUserCase;
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when Yes', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.YES,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_NOTIFICATION_CYA_OFFLINE + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to next page when No with details', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          copyToOtherPartyText: 'Test',
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_NOTIFICATION_CYA + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should render the same page when copyToOtherPartyYesOrNo empty', async () => {
      request = mockRequest({ body: {} });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE + languages.ENGLISH_URL_PARAMETER
      );
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyYesOrNo', errorType: 'required' }]);
    });

    it('should render the same page when No is selected but details empty', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE + languages.ENGLISH_URL_PARAMETER
      );
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyText', errorType: 'required' }]);
    });

    it('should render the same page when No is selected but details exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          copyToOtherPartyText: '1'.repeat(2501),
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE + languages.ENGLISH_URL_PARAMETER
      );
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyText', errorType: 'tooLong' }]);
    });
  });
});
