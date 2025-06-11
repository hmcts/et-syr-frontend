import _ from 'lodash';

import ClearSelectionController from '../../../main/controllers/ClearSelectionController';
import { HearingPanelPreference } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('ClearSelectionController', () => {
  let controller: ClearSelectionController;
  let request: ReturnType<typeof mockRequestWithTranslation>;
  let response: ReturnType<typeof mockResponse>;
  const hearingPanelPreferenceReasonJudge = 'Dummy Hearing Panel Preference Judge reason';
  const hearingPanelPreferenceReasonPanel = 'Dummy Hearing Panel Preference Judge reason';

  beforeEach(() => {
    controller = new ClearSelectionController();
    response = mockResponse();
  });

  describe('get method tests without page name parameter respondent hearing panel preference', () => {
    it('should not reset respondent hearing panel preference and redirect to respondent hearing panel preference page when there is no request parameters', async () => {
      request = mockRequest({});
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.respondentHearingPanelPreference = HearingPanelPreference.JUDGE;
      request.session.userCase.respondentHearingPanelPreferenceReasonJudge = hearingPanelPreferenceReasonJudge;
      request.session.userCase.respondentHearingPanelPreferenceReasonPanel = hearingPanelPreferenceReasonPanel;
      request.params.pageName = undefined;
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
      expect(request.session.userCase.respondentHearingPanelPreference).toStrictEqual(HearingPanelPreference.JUDGE);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonJudge).toStrictEqual(
        hearingPanelPreferenceReasonJudge
      );
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonPanel).toStrictEqual(
        hearingPanelPreferenceReasonPanel
      );
    });
    it('should not reset respondent hearing panel preference and redirect to respondent hearing panel preference page when request parameters page name is not respondent hearing preference', async () => {
      request = mockRequest({});
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.respondentHearingPanelPreference = HearingPanelPreference.JUDGE;
      request.session.userCase.respondentHearingPanelPreferenceReasonJudge = hearingPanelPreferenceReasonJudge;
      request.params.pageName = TranslationKeys.RESPONDENT_NAME;
      request.session.userCase.respondentHearingPanelPreferenceReasonPanel = hearingPanelPreferenceReasonPanel;
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonJudge).toStrictEqual(
        hearingPanelPreferenceReasonJudge
      );
      expect(request.session.userCase.respondentHearingPanelPreference).toStrictEqual(HearingPanelPreference.JUDGE);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonPanel).toStrictEqual(
        hearingPanelPreferenceReasonPanel
      );
    });
  });
  describe('get method tests with page name parameter respondent hearing panel preference', () => {
    it('should not reset respondent hearing panel preference and redirect to respondent hearing panel preference page when request parameters page name is respondent hearing preference but request user case is empty', async () => {
      request = mockRequest({});
      request.params = {
        pageName: TranslationKeys.RESPONDENT_HEARING_PANEL_PREFERENCE,
      };
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
      expect(request.session.userCase.respondentHearingPanelPreference).toStrictEqual(undefined);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonJudge).toStrictEqual(undefined);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonPanel).toStrictEqual(undefined);
    });
    it('should reset respondent hearing panel preference and redirect to respondent hearing panel preference page when request parameters page name is respondent hearing preference', async () => {
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.respondentHearingPanelPreference = HearingPanelPreference.JUDGE;
      request.session.userCase.respondentHearingPanelPreferenceReasonJudge = hearingPanelPreferenceReasonJudge;
      request.session.userCase.respondentHearingPanelPreferenceReasonPanel = hearingPanelPreferenceReasonPanel;
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonJudge).toStrictEqual(undefined);
      expect(request.session.userCase.respondentHearingPanelPreference).toStrictEqual(undefined);
      expect(request.session.userCase.respondentHearingPanelPreferenceReasonPanel).toStrictEqual(undefined);
    });
  });
});
