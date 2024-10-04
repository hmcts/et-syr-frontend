import ApplicationSubmittedController from '../../../main/controllers/ApplicationSubmittedController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { retrieveCurrentLocale } from '../../../main/helpers/ApplicationTableRecordTranslationHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/ApplicationTableRecordTranslationHelper');
jest.mock('../../../main/helpers/RouterHelpers');

describe('ApplicationSubmittedController', () => {
  let controller: ApplicationSubmittedController;
  let req: AppRequest;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ApplicationSubmittedController();
    req = mockRequest({
      session: {
        userCase: {
          id: '12345',
        },
      },
    }) as AppRequest;
    res = mockResponse();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the application submitted page with the correct data', async () => {
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() + 7);
      const formattedDate = mockDate.toLocaleDateString('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Mocking external functions
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (retrieveCurrentLocale as jest.Mock).mockReturnValue('en');
      (getLanguageParam as jest.Mock).mockReturnValue('?lang=en');
      (req.t as unknown as jest.Mock).mockImplementation((key: string) => {
        if (key === TranslationKeys.COMMON) {
          return { common: 'Common Translation' };
        }
        if (key === TranslationKeys.APPLICATION_SUBMITTED) {
          return { submitted: 'Application Submitted' };
        }
        return {};
      });

      await controller.get(req, res);

      // Expect the correct data to be passed to res.render
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.APPLICATION_SUBMITTED, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_SUBMITTED, { returnObjects: true }),
        applicationDate: formattedDate,
        userCase: req.session?.userCase,
        redirectUrl: '/case-details/12345?lang=en',
        welshEnabled: true,
      });
    });

    it('should handle cases when the Welsh language feature flag is disabled', async () => {
      // Mocking the flag to return false (Welsh disabled)
      (getFlagValue as jest.Mock).mockResolvedValue(false);
      (retrieveCurrentLocale as jest.Mock).mockReturnValue('en');
      (getLanguageParam as jest.Mock).mockReturnValue('?lang=en');
      (req.t as unknown as jest.Mock).mockReturnValue({});

      await controller.get(req, res);

      // Expect the response to have welshEnabled set to false
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.APPLICATION_SUBMITTED,
        expect.objectContaining({
          welshEnabled: false,
        })
      );
    });

    it('should use the correct locale for formatting the application date', async () => {
      const mockDate = new Date();
      mockDate.setDate(mockDate.getDate() + 7);
      const formattedDate = mockDate.toLocaleDateString('cy', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Mocking the locale to return 'cy' for Welsh
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (retrieveCurrentLocale as jest.Mock).mockReturnValue('cy');
      (getLanguageParam as jest.Mock).mockReturnValue('?lang=cy');
      (req.t as unknown as jest.Mock).mockReturnValue({});

      await controller.get(req, res);

      // Expect the response to use the correct locale (Welsh in this case)
      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.APPLICATION_SUBMITTED,
        expect.objectContaining({
          applicationDate: formattedDate,
          welshEnabled: true,
        })
      );
    });
  });
});
