import AcasEarlyConciliationCertificateController from '../../../main/controllers/AcasEarlyConciliationCertificateController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('Acas early conciliation certificate Controller', () => {
  let controller: AcasEarlyConciliationCertificateController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new AcasEarlyConciliationCertificateController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE,
        expect.anything()
      );
    });

    it('should render the page when clear selection', () => {
      request.session.userCase.et3ResponseAcasAgree = YesOrNo.NO;
      request.session.userCase.et3ResponseAcasAgreeReason = 'Test';
      request.query = {
        redirect: 'clearSelection',
      };
      controller.get(request, response);
      expect(request.session.userCase.et3ResponseAcasAgree).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseAcasAgreeReason).toStrictEqual(undefined);
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when Yes is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.YES,
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES);
    });

    it('should redirect to next page when No is selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.NO,
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES);
    });

    it('should redirect to next page when No is selected and textarea filled', async () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.NO,
          et3ResponseAcasAgreeReason: '1'.repeat(800),
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES);
    });

    it('should redirect to next page when nothing is selected', async () => {
      request = mockRequest({ body: {} });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_EMPLOYMENT_DATES);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          et3ResponseAcasAgree: YesOrNo.NO,
          et3ResponseAcasAgreeReason: '1'.repeat(801),
        },
      });
      request.url = PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE);
      const errors = [{ propertyName: 'et3ResponseAcasAgreeReason', errorType: 'tooLong' }];
      expect(request.session.errors).toEqual(errors);
    });
  });
});
