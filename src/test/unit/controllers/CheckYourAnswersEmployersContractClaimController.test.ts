import CheckYourAnswersEmployersContractClaimController from '../../../main/controllers/CheckYourAnswersEmployersContractClaimController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { FormError } from '../../../main/definitions/form';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/controller/CheckYourAnswersET3Helper');
jest.mock('../../../main/utils/ET3Util');

describe('CheckYourAnswersEmployersContractClaimController', () => {
  let controller: CheckYourAnswersEmployersContractClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };

  beforeEach(() => {
    controller = new CheckYourAnswersEmployersContractClaimController();
    request = mockRequest({
      session: {
        userCase,
        selectedRespondent: {
          employersContractClaimSection: 'Yes',
        },
      },
    });
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
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should go to the respondent response task list on valid submission', async () => {
      request.body = {
        employersContractClaimSection: 'Yes', // Ensure this is set
      };

      (ET3Util.updateET3Data as jest.Mock).mockResolvedValue(userCase); // Mock the ET3 update function

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(userCase); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_RESPONSE_TASK_LIST); // Ensure the correct redirect occurs
    });

    it('should redirect back to Employers Contract Claim if ET3 data update fails', async () => {
      // Simulate validation errors
      const mockFormError: FormError = {
        propertyName: 'employersContractClaimSection',
        errorType: 'required',
      };

      request.body = {
        employersContractClaimSection: '', // Simulate invalid input
      };

      // Simulate an error during ET3 update
      (ET3Util.updateET3Data as jest.Mock).mockRejectedValue(mockFormError);

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(request.url);
      expect(request.session.errors).toEqual([mockFormError]); // Ensure the errors are still present
    });
  });
});
