import ContactTribunalSelectedController from '../../../main/controllers/ContactTribunalSelectedController';
import { ErrorPages, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { mockValidMulterFile } from '../mocks/mockExpressMulterFile';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Selected Controller', () => {
  let controller: ContactTribunalSelectedController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalSelectedController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_SELECTED, expect.anything());
    });

    it('should redirect to error page when application invalid', () => {
      controller.get(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL);
    });
  });

  describe('POST method', () => {
    it('should detect bot activity and return a thank you message', async () => {
      request = mockRequest({ body: { url: 'http://test-url.com' } });
      await controller.post(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.end).toHaveBeenCalledWith('Thank you for your submission. You will be contacted in due course.');
    });

    it('should redirect to error page when params not found', async () => {
      request = mockRequest({ body: {} });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should redirect to error page when application invalid', async () => {
      request = mockRequest({ body: {} });
      request.params.selectedOption = 'Test';
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should remove uploaded file when remove button is clicked', async () => {
      request = mockRequest({
        body: { remove: 'true' },
        session: { userCase: { contactApplicationFile: { document_filename: 'test.pdf' } } },
      });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(request.session.userCase.contactApplicationFile).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/change-my-personal-details?lng=en');
    });

    it('should process a valid file upload', async () => {
      request = mockRequest({
        body: {
          upload: 'true',
          file: mockValidMulterFile,
        },
      });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/change-my-personal-details?lng=en');
    });

    it('should return error when file not selected', async () => {
      request = mockRequest({ body: { upload: 'true' } });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/change-my-personal-details?lng=en');
      expect(request.session.errors).toEqual([
        { propertyName: 'contactApplicationFile', errorType: 'fileNameNotSelected' },
      ]);
    });

    it('should return error when text and file missing', async () => {
      request = mockRequest({ body: {} });
      request.params.selectedOption = application.AMEND_RESPONSE.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/apply-to-amend-my-response?lng=en');
      expect(request.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'required' }]);
    });

    it('should return error when text empty and file missing', async () => {
      request = mockRequest({ body: { contactApplicationText: '' } });
      request.params.selectedOption = application.AMEND_RESPONSE.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/apply-to-amend-my-response?lng=en');
      expect(request.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'required' }]);
    });

    it('should return error when summary text exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          contactApplicationText: '1'.repeat(2501),
        },
      });
      request.params.selectedOption = application.AMEND_RESPONSE.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal/apply-to-amend-my-response?lng=en');
      expect(request.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'tooLong' }]);
    });

    it('should allow exactly 2500 characters for contactApplicationText', async () => {
      request = mockRequest({ body: { contactApplicationText: 'A'.repeat(2500) } });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
    });

    it('should redirect to COPY_TO_OTHER_PARTY when application type is A', async () => {
      request = mockRequest({ body: { contactApplicationText: 'Test' } });
      request.params.selectedOption = application.POSTPONE_HEARING.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
    });

    it('should redirect to COPY_TO_OTHER_PARTY when application type is B', async () => {
      request = mockRequest({ body: { contactApplicationText: 'Test' } });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/copy-to-other-party?lng=en');
    });

    it('should redirect to CONTACT_TRIBUNAL_CYA when application type is C', async () => {
      request = mockRequest({ body: { contactApplicationText: 'Test' } });
      request.params.selectedOption = application.ORDER_WITNESS_ATTEND.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith('/contact-tribunal-check-your-answers?lng=en');
    });
  });
});
