import CheckYourAnswersEmployersContractClaimController from '../../../main/controllers/CheckYourAnswersEmployersContractClaimController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

jest.mock('../../../main/helpers/controller/CheckYourAnswersET3Helper');
jest.mock('../../../main/utils/ET3Util');
jest.mock('../../../main/helpers/RouterHelpers', () => ({
  conditionalRedirect: jest.fn(),
}));

describe('CheckYourAnswersEmployersContractClaimController', () => {
  let controller: CheckYourAnswersEmployersContractClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  const updateET3ResponseWithET3FormMock = jest.fn();

  beforeEach(() => {
    controller = new CheckYourAnswersEmployersContractClaimController();
    request = mockRequest({
      session: {
        mockCaseWithIdWithRespondents,
        selectedRespondent: {
          employersContractClaimSection: 'Yes',
        },
      },
    });
    ET3Util.updateET3ResponseWithET3Form = updateET3ResponseWithET3FormMock;
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should go to the respondent response task list on valid submission', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(true);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.RESPONDENT_RESPONSE_TASK_LIST,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );
      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_RESPONSE_TASK_LIST); // Ensure the correct redirect occurs
    });

    it('should redirect back to Employers Contract Claim if ET3 data update fails', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(false);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          request.url,
          request,
          response,
          [mockFormError],
          mockCaseWithIdWithRespondents
        )
      );
      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.url);
      expect(request.session.errors).toEqual([mockFormError]); // Ensure the errors are still present
    });
  });
});
