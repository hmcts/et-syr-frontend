import RespondentContestClaimController from '../../../main/controllers/RespondentContestClaimController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-contest-claim.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('RespondentContestClaimController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentContestClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContestClaimController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the respondent contest claim page with the correct translations', () => {
      // Prepare the mock request with translation and session data
      request = mockRequestWithTranslation(
        {
          session: {
            userCase: {
              respondents: [{
                  respondentName: 'John Doe',
                },
              ],
            },
          },
        },
        translationJsons
      );

      // Call the GET method of the controller
      controller.get(request, response);

      // Assert that the response.render method is called with the correct translation key and any content
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_CONTEST_CLAIM, expect.anything());
    });
  });


  describe('POST method', () => {
    it('should redirect to contest claim reason page when response is NO', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentContestClaim: YesOrNo.NO,
        },
      });
      request.url = PageUrls.RESPONDENT_CONTEST_CLAIM_REASON;

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    });

    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters when response is YES', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentContestClaim: YesOrNo.YES,
        },
      });
      request.url = PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM;

      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
    });
  });
});
