import RespondToNotificationStoreConfirmController from '../../../main/controllers/RespondToNotificationStoreConfirmController';
import { ErrorPages, TranslationKeys, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockSendNotificationCollection } from '../mocks/mockSendNotificationCollection';
import { mockUserDetails } from '../mocks/mockUser';

describe('Respond to Notification Store Confirmation Controller', () => {
  let controller: RespondToNotificationStoreConfirmController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToNotificationStoreConfirmController();

    req = mockRequest({});
    req.session.user = mockUserDetails;
    req.session.userCase.sendNotificationCollection = mockSendNotificationCollection;

    res = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      req.params.itemId = 'd416f43f-10f4-402a-bdf1-ea9012a553d7';
      controller.get(req, res);
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, expect.anything());
    });

    it('should return error when appId invalid', () => {
      req.params.itemId = 'test';
      controller.get(req, res);
      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
