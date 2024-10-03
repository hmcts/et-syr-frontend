import ET3CYAController from '../../../main/controllers/ET3CYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
} from '../../../main/helpers/controller/ET3CYAHelper';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/controller/ET3CYAHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');

describe('ET3CYAController', () => {
  let controller: ET3CYAController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed

  beforeEach(() => {
    controller = new ET3CYAController();
    request = mockRequest({
      session: {
        userCase,
      },
    });
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the ET3 CYA page with the correct translations and data', async () => {
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

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_ET3_CYA,
        expect.objectContaining({
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          redirectUrl: expect.any(String), // Check that a redirect URL is set
          welshEnabled: true, // Check if the Welsh feature flag is true
        })
      );
    });
  });
});
