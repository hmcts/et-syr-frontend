import ClaimantET1FormDetailsController from '../../../main/controllers/ClaimantET1FormDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

describe('Claimant ET1 Form Details Controller', () => {
  let controller: ClaimantET1FormDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantET1FormDetailsController();
    request = mockRequest({});
    response = mockResponse();

    // Mocking external dependencies
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.CLAIMANT_ET1_FORM_DETAILS);
    (getFlagValue as jest.Mock).mockResolvedValue(true); // Assume Welsh is enabled for the test
    (getLanguageParam as jest.Mock).mockReturnValue('en');
  });

  describe('GET method', () => {
    it('should call res.render with the correct parameters', async () => {
      // Call the controller's GET method
      await controller.get(request, response);

      // Expect that res.render was called with the right template and object
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_ET1_FORM_DETAILS,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.CLAIMANT_ET1_FORM_DETAILS,
          languageParam: 'en',
          welshEnabled: true,
        })
      );
    });
  });
});
