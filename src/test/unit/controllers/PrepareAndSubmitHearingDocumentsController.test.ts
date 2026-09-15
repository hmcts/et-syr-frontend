import PrepareAndSubmitHearingDocumentsController from '../../../main/controllers/PrepareAndSubmitHearingDocumentsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import UrlUtils from '../../../main/utils/UrlUtils';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Prepare and submit hearing documents controller', () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);

  it('should render the prepare and submit hearing documents page', async () => {
    const controller = new PrepareAndSubmitHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequest({});
    const redirectUrl = setUrlLanguage(request, PageUrls.AGREEING_DOCUMENTS);
    const cancelLink = UrlUtils.getCaseDetailsUrlByRequest(request);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.PREPARE_AND_SUBMIT_HEARING_DOCUMENTS,
      expect.objectContaining({
        redirectUrl,
        cancelLink,
        hideContactUs: true,
      })
    );
  });
});
