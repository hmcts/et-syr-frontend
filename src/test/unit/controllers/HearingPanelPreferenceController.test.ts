import HearingPanelPreferenceController from '../../../main/controllers/HearingPanelPreferenceController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/hearing-panel-preference.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('HearingPanelPreferenceController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: HearingPanelPreferenceController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new HearingPanelPreferenceController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the hearing panel preference page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PANEL_PREFERENCE, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters when preference is Judge', async () => {
      request = mockRequest({
        body: {
          respondentHearingPanelPreference: 'Judge',
          respondentHearingPanelPreferenceReason: 'Legal issues',
        },
      });
      request.url = PageUrls.REASONABLE_ADJUSTMENTS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
    });
  });
});
