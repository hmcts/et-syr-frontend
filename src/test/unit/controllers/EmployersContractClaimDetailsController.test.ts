import EmployersContractClaimDetailsController from '../../../main/controllers/EmployersContractClaimDetailsController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/employers-contract-claim-details.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');

describe('EmployersContractClaimDetailsController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: EmployersContractClaimDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new EmployersContractClaimDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        expect.objectContaining({
          hideContactUs: true,
        })
      );
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmployerClaimDetails: 'Some claim details text',
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(), // Form object
        ET3HubLinkNames.EmployersContractClaim,
        LinkStatus.IN_PROGRESS,
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM
      );
    });
  });
});
