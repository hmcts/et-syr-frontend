import HearingPanelPreferenceController from '../../../main/controllers/HearingPanelPreferenceController';
import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
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
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the hearing panel preference page with the correct translations', async () => {
      request = mockRequestWithTranslation({}, translationJsons);
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PANEL_PREFERENCE, expect.anything());
    });

    it('should redirect to reasonable adjustments when the ERA feature is disabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);

      await controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
    });

    it('should redirect to respondent employees when ERA is disabled and CUI Your Support is enabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequest({
        userCase: {
          caseTypeId: CaseTypeId.SCOTLAND,
        },
      });

      await controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_EMPLOYEES);
    });

    it('should clear the preference and reason when clear selection is requested', async () => {
      request = mockRequest({
        userCase: {
          respondentHearingPanelPreference: 'Judge',
          respondentHearingPanelPreferenceReason: 'Legal issues',
        },
      });
      request.query = { redirect: 'clearSelection' };

      await controller.get(request, response);

      expect(request.session.userCase.respondentHearingPanelPreference).toBeUndefined();
      expect(request.session.userCase.respondentHearingPanelPreferenceReason).toBeUndefined();
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

    it('should continue to respondent employees when CUI Your Support is enabled', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequest({
        body: {
          respondentHearingPanelPreference: 'Panel',
          respondentHearingPanelPreferenceReason: 'Workplace experience would help',
        },
        userCase: {
          caseTypeId: CaseTypeId.SCOTLAND,
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_EMPLOYEES);
    });

    it('should continue to reasonable adjustments when no preference is selected (optional question)', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.REASONABLE_ADJUSTMENTS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(request.session.errors).toEqual([]);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
    });

    it('should not save a hearing-panel preference when the ERA feature is disabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      request = mockRequest({
        body: {
          respondentHearingPanelPreference: 'Judge',
          respondentHearingPanelPreferenceReason: 'Legal issues',
        },
      });

      await controller.post(request, response);

      expect(updateET3DataMock).not.toHaveBeenCalled();
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
    });

    it('should continue to respondent employees without saving when ERA is disabled and CUI Your Support is enabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequest({
        body: {
          respondentHearingPanelPreference: 'Judge',
          respondentHearingPanelPreferenceReason: 'Legal issues',
        },
        userCase: {
          caseTypeId: CaseTypeId.SCOTLAND,
        },
      });

      await controller.post(request, response);

      expect(updateET3DataMock).not.toHaveBeenCalled();
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_EMPLOYEES);
    });
  });
});
