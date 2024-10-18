import RespondentContactPhoneNumberController from '../../../main/controllers/RespondentContactPhoneNumberController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-contact-phone-number.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('RespondentContactPhoneNumberController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentContactPhoneNumberController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContactPhoneNumberController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          responseRespondentPhone1: '01234567890',
        },
      });
      request.url = PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTACT_PREFERENCES);
    });

    it('should redirect to same page when phone number is invalid', async () => {
      request = mockRequest({
        body: {
          responseRespondentPhone1: '1234567890_1234567890_1234567890',
        },
      });
      request.url = PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
      const errors = [{ propertyName: 'responseRespondentPhone1', errorType: 'invalidPhoneNumber' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
