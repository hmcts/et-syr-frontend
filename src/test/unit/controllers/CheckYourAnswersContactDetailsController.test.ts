import CheckYourAnswersContactDetailsController from '../../../main/controllers/CheckYourAnswersContactDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

describe('CheckYourAnswersContactDetailsController', () => {
  let controller: CheckYourAnswersContactDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const updateET3ResponseWithET3FormMock = jest.fn();
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  beforeEach(() => {
    controller = new CheckYourAnswersContactDetailsController();
    request = mockRequest({
      session: {
        mockCaseWithIdWithRespondents,
        selectedRespondent: {
          personalDetailsSection: 'Yes',
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
        TranslationKeys.CHECK_YOUR_ANSWERS_CONTACT_DETAILS,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should update the user case and redirect to the hearing preferences page if there are no errors', async () => {
      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.HEARING_PREFERENCES,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );
      await controller.post(request, response);
      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.HEARING_PREFERENCES); // Ensure the correct redirect occurs
    });

    it('should redirect back to the same page if ET3 data update fails', async () => {
      updateET3ResponseWithET3FormMock.mockImplementationOnce(
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
