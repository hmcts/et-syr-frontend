import ReturnToExistingResponseController from '../../../main/controllers/ReturnToExistingResponseController';
import { YesOrNo } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const returnToExistingResponseController = new ReturnToExistingResponseController();

describe('ReturnToExistingResponseController', () => {
  const t = {
    home: {},
  };
  describe('get', () => {
    it('should render the introduction (home) page', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      returnToExistingResponseController.get(request, response);
      expect(response.render).toHaveBeenCalledWith('return-to-existing-response', expect.anything());
    });
  });
  describe('post', () => {
    it('should forward to return to existing page when request body returnToExisting is empty', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RETURN_TO_EXISTING_RESPONSE + languages.ENGLISH_URL_PARAMETER
      );
    });
    it('should forward to Legacy ET3 url when request body returnToExisting is Yes', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: YesOrNo.YES,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.SIGN_IN);
    });
    it('should forward to case list when request body returnToExisting is No', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: YesOrNo.NO,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
