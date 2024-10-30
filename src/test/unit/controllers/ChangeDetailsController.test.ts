import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { ErrorPages, InterceptPaths, PageUrls, languages } from '../../../main/definitions/constants';
import { returnValidUrl } from '../../../main/helpers/RouterHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

// Mock returnValidUrl to return /some-url as a valid URL
jest.mock('../../../main/helpers/RouterHelpers', () => ({
  ...jest.requireActual('../../../main/helpers/RouterHelpers'),
  returnValidUrl: jest.fn(),
}));

describe('Change Details Controller', () => {
  it.each([
    ['answers', PageUrls.CHECK_YOUR_ANSWERS_ET3, InterceptPaths.ANSWERS_CHANGE],
    [
      'respondent-contact-preferences',
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      InterceptPaths.RESPONDENT_CONTACT_PREFERENCES,
    ],
    ['contact-details', PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS, InterceptPaths.CONTACT_DETAILS_CHANGE],
    ['employer-details', PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES, InterceptPaths.EMPLOYER_DETAILS_CHANGE],
    [
      'conciliation-and-employee-details',
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
      InterceptPaths.CONCILIATION_AND_EMPLOYEE_DETAILS_CHANGE,
    ],
    [
      'pay-pension-benefit-details',
      PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
      InterceptPaths.PAY_PENSION_BENEFITS_CHANGE,
    ],
    ['contest-claim', PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, InterceptPaths.CONTEST_CLAIM_CHANGE],
    [
      'employers-contract-claim',
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      InterceptPaths.EMPLOYERS_CONTRACT_CLAIM_CHANGE,
    ],
  ])(
    'should redirect to the correct respondent page and set request.session.returnUrl to %s CYA',
    (redirectValue, expectedReturnUrl, interceptPath) => {
      const controller = new ChangeDetailsController();
      const response = mockResponse();
      const request = mockRequest({});
      request.url = 'some-url' + interceptPath;
      request.query = {
        redirect: redirectValue,
      };

      // Set up returnValidUrl mock to return the request URL as valid
      (returnValidUrl as jest.Mock).mockReturnValue(request.url);

      controller.get(request, response);

      expect(request.session.returnUrl).toStrictEqual(expectedReturnUrl + languages.ENGLISH_URL_PARAMETER);
      expect(response.redirect).toHaveBeenCalledWith('some-url' + interceptPath);
    }
  );

  it('should redirect to the not found page if req.query.redirect is not "answers"', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.ANSWERS_CHANGE;
    request.query = {
      redirect: 'invalid', // This triggers the else block
    };

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
