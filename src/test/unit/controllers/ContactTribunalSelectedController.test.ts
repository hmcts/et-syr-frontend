import ContactTribunalSelectedController from '../../../main/controllers/ContactTribunalSelectedController';
import {PageUrls, TranslationKeys, languages, ErrorPages} from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
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
    it('should redirect to next page when type B and other party online', async () => {
      request = mockRequest({ body: { contactApplicationText: 'Test' } });
      request.params.selectedOption = application.CHANGE_PERSONAL_DETAILS.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to cya page when type C', async () => {
      request = mockRequest({ body: { contactApplicationText: 'Test' } });
      request.params.selectedOption = application.ORDER_WITNESS_ATTEND.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_CYA + languages.ENGLISH_URL_PARAMETER);
    });

    it('should redirect to error page when application invalid', async () => {
      request = mockRequest({ body: {} });
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
    });

    it('should render the same page when text and file empty', async () => {
      request = mockRequest({ body: { contactApplicationText: '' } });
      request.params.selectedOption = application.ORDER_WITNESS_ATTEND.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', request.params.selectedOption) +
          languages.ENGLISH_URL_PARAMETER
      );
      expect(request.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'required' }]);
    });

    it('should render the same page when No is selected but summary text exceeds 2500 characters', async () => {
      request = mockRequest({
        body: {
          contactApplicationText: '1'.repeat(2501),
        },
      });
      request.params.selectedOption = application.ORDER_WITNESS_ATTEND.url;
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', request.params.selectedOption) +
          languages.ENGLISH_URL_PARAMETER
      );
      expect(request.session.errors).toEqual([{ propertyName: 'contactApplicationText', errorType: 'tooLong' }]);
    });
  });
});
