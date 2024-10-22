import RespondentContactPreferencesController from '../../../main/controllers/RespondentContactPreferencesController';
import { EmailOrPost, EnglishOrWelsh } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-contact-preferences.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Respondent Contact Preferences Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentContactPreferencesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContactPreferencesController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when preferences are selected', async () => {
      request = mockRequest({
        body: {
          responseRespondentContactPreference: EmailOrPost.POST,
          et3ResponseLanguagePreference: EnglishOrWelsh.ENGLISH,
        },
      });
      request.url = PageUrls.RESPONDENT_CONTACT_PREFERENCES;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS);
    });
  });
});
