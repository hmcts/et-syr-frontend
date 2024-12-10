import CopyToOtherPartyController from '../../../main/controllers/CopyToOtherPartyController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Copy to Other Party Controller', () => {
  let controller: CopyToOtherPartyController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new CopyToOtherPartyController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.COPY_TO_OTHER_PARTY, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should redirect to next page when Yes', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.YES,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to next page when No with details', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          copyToOtherPartyText: 'Test',
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });

    it('should render the same page when copyToOtherPartyYesOrNo empty', async () => {
      request = mockRequest({ body: {} });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyYesOrNo', errorType: 'required' }]);
    });

    it('should render the same page when No is selected but details empty', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyText', errorType: 'required' }]);
    });

    it('should render the same page when No is selected but details exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          copyToOtherPartyText: '1'.repeat(2501),
        },
      });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
      expect(request.session.errors).toEqual([{ propertyName: 'copyToOtherPartyText', errorType: 'tooLong' }]);
    });
  });
});
