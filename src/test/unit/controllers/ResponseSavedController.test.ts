import ResponseSavedController from '../../../main/controllers/ResponseSavedController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
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
    respondents: [{ respondentName: 'test respondent', ccdId: '1234' }],
  };

  beforeEach(() => {
    controller = new ResponseSavedController();
    req = mockRequest({
      session: {
        userCase: mockUserCase,
        selectedRespondentIndex: 0,
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

      const index = req.session.selectedRespondentIndex;
      const expectedRedirectUrl = `/case-details/${mockUserCase.id}/${mockUserCase.respondents[index].ccdId}${mockLanguageParam}`;

      expect(getFlagValue).toHaveBeenCalledWith('welsh-language', null);
      expect(getLanguageParam).toHaveBeenCalledWith(req.url);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONSE_SAVED, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
        userCase: mockUserCase,
        redirectToResponse: expectedRedirectUrl,
        redirectToCaseList: PageUrls.CASE_LIST + mockLanguageParam,
        respondentResponseDeadline: ET3DataModelUtil.getRespondentResponseDeadline(req),
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

      const index = req.session.selectedRespondentIndex;
      const expectedRedirectUrl = `/case-details/${mockUserCase.id}/${mockUserCase.respondents[index].ccdId}${mockLanguageParam}`;

      expect(getFlagValue).toHaveBeenCalledWith('welsh-language', null);
      expect(getLanguageParam).toHaveBeenCalledWith(req.url);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONSE_SAVED, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.RESPONSE_SAVED, { returnObjects: true }),
        userCase: mockUserCase,
        redirectToResponse: expectedRedirectUrl,
        redirectToCaseList: PageUrls.CASE_LIST + mockLanguageParam,
        respondentResponseDeadline: ET3DataModelUtil.getRespondentResponseDeadline(req),
        welshEnabled: mockWelshEnabled,
      });
    });
  });
});
