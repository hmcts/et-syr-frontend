import EmployersContractClaimController from '../../../main/controllers/EmployersContractClaimController';
import { YesOrNo } from '../../../main/definitions/case';
import { DefaultValues, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/employers-contract-claim.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Employers Contract Claim Controller', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: EmployersContractClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new EmployersContractClaimController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the Employers Contract Claim page with correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM, expect.anything());
    });

    it('should render the Employers Contract Claim page if req.query.redirect is clearSection', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      request.query = { redirect: DefaultValues.CLEAR_SELECTION };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseEmployerClaim === undefined).toBe(true);
      expect(request.session.errors).toHaveLength(DefaultValues.NUMBER_ZERO);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to the appropriate next page when YES is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmployerClaim: YesOrNo.YES,
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
    });

    it('should redirect to the check your answers page when NO is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmployerClaim: YesOrNo.NO,
        },
      });
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
    });

    it('should update request url to remove redirect=clearSelection parameter', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmployerClaim: YesOrNo.NO,
        },
      });
      request.url = 'http://localhost:8080?redirect=clearSelection&lng=cy&testValue=test';
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(request.url).toContain('http://localhost:8080?lng=cy&testValue=test');
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM + '?testValue=test&lng=cy'
      );
    });
  });
});
