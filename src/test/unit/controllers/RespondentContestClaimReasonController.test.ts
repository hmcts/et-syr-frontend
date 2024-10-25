import RespondentContestClaimReasonController from '../../../main/controllers/RespondentContestClaimReasonController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-contest-claim-reason.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');

describe('RespondentContestClaimReasonController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentContestClaimReasonController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContestClaimReasonController();
    request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Respondent Name' }],
        },
      },
    });
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct form data and translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);

      controller.get(request, response);

      // Ensure the page is rendered with the correct translation keys and content
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON,
        expect.objectContaining({
          redirectUrl: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
          hideContactUs: true,
        })
      );
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          et3ResponseContestClaimDetails: 'Claim reason details',
        },
      });
      request.url = PageUrls.RESPONDENT_CONTEST_CLAIM_REASON;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(), // Form object
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM
      );
    });
  });
});
