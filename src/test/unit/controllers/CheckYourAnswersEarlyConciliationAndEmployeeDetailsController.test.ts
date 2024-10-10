import CheckYourAnswersEarlyConciliationAndEmployeeDetailsController from '../../../main/controllers/CheckYourAnswersEarlyConciliationAndEmployeeDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

describe('CheckYourAnswersEarlyConciliationAndEmployeeDetailsController', () => {
  let controller: CheckYourAnswersEarlyConciliationAndEmployeeDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  const updateET3ResponseWithET3FormMock = jest.fn();

  beforeEach(() => {
    controller = new CheckYourAnswersEarlyConciliationAndEmployeeDetailsController();
    request = mockRequest({
      session: {
        userCase,
        selectedRespondent: {
          haveYouCompleted: 'Yes',
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
        TranslationKeys.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to the respondent response task list on valid submission', async () => {
      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.CLAIMANT_PAY_DETAILS,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PAY_DETAILS); // Ensure the correct redirect occurs
    });

    it('should redirect back to Early Conciliation and Employee Details if ET3 data update fails', async () => {
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
