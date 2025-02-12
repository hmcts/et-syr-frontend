import _ from 'lodash';

import RespondentHearingPanelPreferenceController from '../../../main/controllers/RespondentHearingPanelPreferenceController';
import { YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

import SpyInstance = jest.SpyInstance;

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3ResponseWithET3FormMock: SpyInstance = jest.spyOn(ET3Util, 'updateET3ResponseWithET3Form');

describe('RespondentHearingPanelPreferenceController', () => {
  let controller: RespondentHearingPanelPreferenceController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentHearingPanelPreferenceController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the respondent contest claim page with the correct translations', () => {
      // Prepare the mock request with translation and session data
      request = mockRequest({});

      // Call the GET method of the controller
      controller.get(request, response);

      // Assert that the response.render method is called with the correct translation key and any content
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_HEARING_PANEL_PREFERENCE,
        expect.anything()
      );
    });
  });
  describe('POST method', () => {
    it('should not reset both judge and panel preference reason when there is no user case', async () => {
      request = mockRequest({
        body: {},
      });
      request.session.userCase = undefined;
      const fieldsToReset: string[] = [];
      updateET3ResponseWithET3FormMock.mockImplementationOnce(() => {});
      await controller.post(request, response);
      expect(fieldsToReset).toStrictEqual([]);
    });

    it('should reset both judge and panel preference reason when form data respondent hearing panel preference is empty', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentContestClaim: YesOrNo.NO,
        },
      });
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      const fieldsToReset: string[] = [];
      updateET3ResponseWithET3FormMock.mockImplementationOnce(() => {
        fieldsToReset.push(
          'respondentHearingPanelPreferenceReasonJudge',
          'respondentHearingPanelPreferenceReasonPanel'
        );
      });
      await controller.post(request, response);
      expect(fieldsToReset).toStrictEqual([
        'respondentHearingPanelPreferenceReasonJudge',
        'respondentHearingPanelPreferenceReasonPanel',
      ]);
    });
  });
});
