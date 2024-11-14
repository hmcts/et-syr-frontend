import ET3ResponseController from '../../../main/controllers/ET3ResponseController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
} from '../../../main/helpers/controller/CheckYourAnswersET3Helper';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/helpers/controller/CheckYourAnswersET3Helper');

describe('ET3 Response Controller', () => {
  let controller: ET3ResponseController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed

  beforeEach(() => {
    controller = new ET3ResponseController();
    request = mockRequest({
      session: {
        userCase,
      },
    });
    response = mockResponse();

    // Mocking external dependencies
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_ET3_RESPONSE);
    (getFlagValue as jest.Mock).mockResolvedValue(true); // Assume Welsh is enabled for the test
    (getLanguageParam as jest.Mock).mockReturnValue('en');
  });

  describe('GET method', () => {
    it('should call res.render with the correct parameters', async () => {
      const sectionTranslations = {
        /* mock section translations here */
      };
      (getFlagValue as jest.Mock).mockResolvedValue(true); // mock welshEnabled
      (request.t as unknown as jest.Mock).mockReturnValueOnce(sectionTranslations);

      (getEt3Section1 as jest.Mock).mockReturnValue('mocked section 1 data');
      (getEt3Section2 as jest.Mock).mockReturnValue('mocked section 2 data');
      (getEt3Section3 as jest.Mock).mockReturnValue('mocked section 3 data');
      (getEt3Section4 as jest.Mock).mockReturnValue('mocked section 4 data');
      (getEt3Section5 as jest.Mock).mockReturnValue('mocked section 5 data');

      // Call the controller's GET method
      await controller.get(request, response);

      // Expect that res.render was called with the right template and object
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_ET3_RESPONSE,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          userCase,
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          redirectUrl: expect.any(String), // Check that a redirect URL is set
          languageParam: 'en',
          welshEnabled: true,
        })
      );
    });
  });
});
