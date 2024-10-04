import ResponseSavedController from '../../../main/controllers/ResponseSavedController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

describe('ResponseSavedController', () => {
  let controller: ResponseSavedController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  const mockUserCase = {
    id: '12345',
    respondentResponseDeadline: '2024-12-31', // Example deadline
  };

  beforeEach(() => {
    controller = new ResponseSavedController();
    req = mockRequest({
      session: {
        userCase: mockUserCase,
      },
    });
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the response saved page with the correct translations and data', async () => {
      const mockWelshEnabled = true;
      const mockLanguageParam = '?lang=cy'; // Example language parameter

      // Mock function implementations
      (getFlagValue as jest.Mock).mockResolvedValue(mockWelshEnabled);
      (getLanguageParam as jest.Mock).mockReturnValue(mockLanguageParam);

      await controller.get(req, res);

      const expectedRedirectUrl = `/case-details/${mockUserCase.id}${mockLanguageParam}`;

      expect(getFlagValue).toHaveBeenCalledWith('welsh-language', null);
      expect(getLanguageParam).toHaveBeenCalledWith(req.url);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONSE_SAVED, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
        applicationDeadline: mockUserCase.respondentResponseDeadline,
        userCase: mockUserCase,
        redirectUrl: expectedRedirectUrl,
        welshEnabled: mockWelshEnabled,
      });
    });

    it('should render the response saved page with welsh disabled when feature flag is false', async () => {
      const mockWelshEnabled = false;
      const mockLanguageParam = ''; // No language parameter

      // Mock function implementations
      (getFlagValue as jest.Mock).mockResolvedValue(mockWelshEnabled);
      (getLanguageParam as jest.Mock).mockReturnValue(mockLanguageParam);

      await controller.get(req, res);

      const expectedRedirectUrl = `/case-details/${mockUserCase.id}${mockLanguageParam}`;

      expect(getFlagValue).toHaveBeenCalledWith('welsh-language', null);
      expect(getLanguageParam).toHaveBeenCalledWith(req.url);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONSE_SAVED, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
        applicationDeadline: mockUserCase.respondentResponseDeadline,
        userCase: mockUserCase,
        redirectUrl: expectedRedirectUrl,
        welshEnabled: mockWelshEnabled,
      });
    });
  });
});
