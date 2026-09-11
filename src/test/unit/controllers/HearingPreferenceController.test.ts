import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { CaseTypeId, HearingPreference } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
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
    updateET3DataMock.mockClear();
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  describe('GET method', () => {
    it('should render the hearing preferences page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PREFERENCES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to reasonable adjustments by default when preferences are valid', async () => {
      request = mockRequest({
        body: {
          et3ResponseHearingRespondent: HearingPreference.VIDEO,
        },
      });
      request.url = PageUrls.HEARING_PREFERENCES;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
    });

    it('should redirect to Your Support when Scotland is enabled', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequest({
        body: {
          et3ResponseHearingRespondent: HearingPreference.NEITHER,
        },
        userCase: {
          caseTypeId: CaseTypeId.SCOTLAND,
        },
      });
      request.url = PageUrls.HEARING_PREFERENCES;
      updateET3DataMock.mockResolvedValue({
        ...mockCaseWithIdWithRespondents,
        caseTypeId: CaseTypeId.SCOTLAND,
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    });
  });
});
