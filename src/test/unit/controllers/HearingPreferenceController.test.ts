import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { HearingPreference } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/hearing-preferences.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('HearingPreferencesController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: HearingPreferencesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new HearingPreferencesController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the hearing preferences page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PREFERENCES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters when preferences are valid', async () => {
      request = mockRequest({
        body: {
          et3ResponseHearingRespondent: HearingPreference.VIDEO,
        },
      });
      request.url = PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
    });

    it('should redirect to next page when NEITHER is selected and details is filled in', async () => {
      request = mockRequest({
        body: {
          et3ResponseHearingRespondent: HearingPreference.NEITHER,
        },
      });
      request.url = PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
    });
  });
});
