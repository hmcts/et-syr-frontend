import RespondentNameController from '../../../main/controllers/RespondentNameController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('RespondentNameController', () => {
  let controller: RespondentNameController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new RespondentNameController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Test Respondent' }],
        },
      },
    });
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.user = mockUserDetails;
    request.session.selectedRespondentIndex = 0;

    translationMock = {
      label1: 'this is label1 ',
      label2: ' this is label2',
      yes: 'Yes',
      no: 'No',
      respondentNameTextLabel: 'is this respondentNameTextLabel',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Name page with the correct form content', async () => {
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_NAME, expect.anything());

      // Verify that the main label function returns the correct value
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.responseRespondentNameQuestion.values[0].label(translationMock)).toBe('Yes');
      expect(form.fields.responseRespondentNameQuestion.values[1].label(translationMock)).toBe('No');
      expect(
        form.fields.responseRespondentNameQuestion.values[1].subFields.responseRespondentName.label(translationMock)
      ).toBe('is this respondentNameTextLabel');
    });
  });

  describe('POST method', () => {
    it('should handle the post method with valid data (Yes selected)', async () => {
      request.body = {
        responseRespondentNameQuestion: YesOrNo.YES,
      };
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.TYPE_OF_ORGANISATION);
    });

    it('should handle the post method with valid data (No selected and subField filled)', async () => {
      request.body = {
        responseRespondentNameQuestion: YesOrNo.NO,
        responseRespondentName: 'Test Respondent Name Detail',
      };
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.TYPE_OF_ORGANISATION);
    });
  });
});
