import ReturnToExistingResponseController from '../../../main/controllers/ReturnToExistingResponseController';
import { ReturnToExistingOption } from '../../../main/definitions/case';
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
    it('should forward to return to existing page when returnToExisting is empty', () => {
      const response = mockResponse();
      const request = mockRequest({ body: {}, t });
      returnToExistingResponseController.post(request, response);
      expect(request.session.errors).toEqual([{ propertyName: 'returnToExisting', errorType: 'required' }]);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RETURN_TO_EXISTING_RESPONSE + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should forward to return to existing page when draftOption is empty', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.DRAFT_RESPONSE,
      };
      returnToExistingResponseController.post(request, response);
      expect(request.session.errors).toEqual([{ propertyName: 'returnToExisting', errorType: 'required' }]);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RETURN_TO_EXISTING_RESPONSE + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should forward to return to existing page when submittedOption is empty', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.SUBMITTED_RESPONSE,
      };
      returnToExistingResponseController.post(request, response);
      expect(request.session.errors).toEqual([{ propertyName: 'returnToExisting', errorType: 'required' }]);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RETURN_TO_EXISTING_RESPONSE + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should forward to case list when DRAFT_RESPONSE and HAVE_ACCOUNT', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.DRAFT_RESPONSE,
        draftOption: ReturnToExistingOption.HAVE_ACCOUNT,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER);
    });

    it('should forward to Legacy ET3 url when DRAFT_RESPONSE and HAVE_RETURN_NUMBER', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.DRAFT_RESPONSE,
        draftOption: ReturnToExistingOption.HAVE_RETURN_NUMBER,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(LegacyUrls.SIGN_IN);
    });

    it('should forward to case list when SUBMITTED_RESPONSE and HAVE_ACCOUNT', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.SUBMITTED_RESPONSE,
        submittedOption: ReturnToExistingOption.HAVE_ACCOUNT,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER);
    });

    it('should forward to case number page when SUBMITTED_RESPONSE and NO_ACCOUNT', () => {
      const response = mockResponse();
      const request = mockRequest({ t });
      request.body = {
        returnToExisting: ReturnToExistingOption.SUBMITTED_RESPONSE,
        submittedOption: ReturnToExistingOption.NO_ACCOUNT,
      };
      returnToExistingResponseController.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
