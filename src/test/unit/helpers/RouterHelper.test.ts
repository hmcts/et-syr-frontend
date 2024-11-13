import { ErrorPages, PageUrls, languages } from '../../../main/definitions/constants';
import { FormFields } from '../../../main/definitions/form';
import {
  conditionalRedirect,
  endSubSection,
  getCancelLink,
  getLanguageParam,
  isClearSelection,
  returnNextPage,
  returnValidUrl,
  startSubSection,
} from '../../../main/helpers/RouterHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('RouterHelper', () => {
  describe('getLanguageParam', () => {
    it('should return Welsh language parameter if url contains lng=cy', () => {
      const result = getLanguageParam('/some-url?lng=cy');
      expect(result).toBe(languages.WELSH_URL_PARAMETER);
    });

    it('should return English language parameter if url does not contain lng=cy', () => {
      const result = getLanguageParam('/some-url?lng=en');
      expect(result).toBe(languages.ENGLISH_URL_PARAMETER);
    });

    it('should return English language parameter for a URL without a language parameter', () => {
      const result = getLanguageParam('/some-url');
      expect(result).toBe(languages.ENGLISH_URL_PARAMETER);
    });
  });

  describe('conditionalRedirect', () => {
    let req: ReturnType<typeof mockRequest>;
    const formFields: FormFields = {
      field1: { type: 'text', id: 'field1' },
      field2: { type: 'text', id: 'field2' },
    };

    beforeEach(() => {
      req = mockRequest({});
      req.body = {
        field1: 'test-value',
      };
    });

    it('should return true if condition matches the form field value', () => {
      const result = conditionalRedirect(req, formFields, 'test-value');
      expect(result).toBe(true);
    });

    it('should return false if condition does not match the form field value', () => {
      const result = conditionalRedirect(req, formFields, 'non-matching-value');
      expect(result).toBe(false);
    });

    it('should return true if condition is an array and at least one value matches', () => {
      const result = conditionalRedirect(req, formFields, ['test-value', 'another-value']);
      expect(result).toBe(true);
    });

    it('should return false if none of the values in the array match the form field value', () => {
      const result = conditionalRedirect(req, formFields, ['no-match', 'another-no-match']);
      expect(result).toBe(false);
    });
  });

  describe('returnNextPage', () => {
    let req: ReturnType<typeof mockRequest>;
    let res: ReturnType<typeof mockResponse>;

    beforeEach(() => {
      req = mockRequest({});
      res = mockResponse();
    });

    it('should redirect to the given URL if session.returnUrl is not set', () => {
      returnNextPage(req, res, PageUrls.HOME);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
    });

    it('should redirect to session.returnUrl if it is set and clear the returnUrl', () => {
      req.session.returnUrl = PageUrls.HOME; //returnUrl (valid as it's within PageUrls for returnValidUrl())
      returnNextPage(req, res, PageUrls.CASE_NUMBER_CHECK); // overridden within returnNextPage as returnUrl is present

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.HOME);
      expect(req.session.returnUrl).toBeUndefined(); // Ensuring returnUrl is cleared
    });
  });

  describe('returnValidUrl', () => {
    const validUrls = ['/page1', '/page2'];

    it('should return the original URL if it is a valid URL', () => {
      const result = returnValidUrl('/page1', validUrls);
      expect(result).toBe('/page1');
    });

    it('should return the Welsh version of the URL if the redirectUrl matches the Welsh version', () => {
      const result = returnValidUrl('/page1?lng=cy', validUrls);
      expect(result).toBe('/page1?lng=cy');
    });

    it('should return the English version of the URL if the redirectUrl matches the English version', () => {
      const result = returnValidUrl('/page1?lng=en', validUrls);
      expect(result).toBe('/page1?lng=en');
    });

    it('should return NOT_FOUND if the redirectUrl is not valid', () => {
      const result = returnValidUrl('/invalid-page', validUrls);
      expect(result).toBe(ErrorPages.NOT_FOUND);
    });
  });

  describe('isClearSelection', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should return true if req.query.redirect is "clearSelection" and userCase is defined in session', () => {
      req.query = { redirect: 'clearSelection' };

      const result = isClearSelection(req);

      expect(result).toBe(true);
    });

    it('should return false if req.query.redirect is not "clearSelection"', () => {
      req.query = { redirect: 'anotherRedirect' };

      const result = isClearSelection(req);

      expect(result).toBe(false);
    });

    it('should return false if userCase is not defined in session', () => {
      req.query = { redirect: 'clearSelection' };
      req.session.userCase = undefined;

      const result = isClearSelection(req);

      expect(result).toBe(false);
    });

    it('should return false if req.query is undefined', () => {
      req.query = undefined;

      const result = isClearSelection(req);

      expect(result).toBe(false);
    });
  });

  describe('startSubSection', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should set subSectionUrl to returnUrl and update returnUrl to forceRedirectUrl when returnUrl is defined', () => {
      req.session.returnUrl = PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS;
      const forceRedirectUrl = PageUrls.HOME;

      startSubSection(req, forceRedirectUrl);

      expect(req.session.subSectionUrl).toBe(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS);
      expect(req.session.returnUrl).toBe(forceRedirectUrl);
    });

    it('should not modify session if returnUrl is not set', () => {
      const initialSession = { ...req.session };
      const forceRedirectUrl = PageUrls.HOME;

      startSubSection(req, forceRedirectUrl);

      expect(req.session).toEqual(initialSession);
    });
  });

  describe('endSubSection', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should set returnUrl to subSectionUrl and clear subSectionUrl if subSectionUrl matches a CYA page', () => {
      req.session.subSectionUrl = PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS;

      endSubSection(req);

      expect(req.session.returnUrl).toBe(PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS);
      expect(req.session.subSectionUrl).toBeUndefined();
    });

    it('should not modify session if subSectionUrl does not match a CYA page', () => {
      req.session.subSectionUrl = '/some-other-page';

      endSubSection(req);

      expect(req.session.returnUrl).toBeUndefined();
      expect(req.session.subSectionUrl).toBe('/some-other-page');
    });

    it('should do nothing if subSectionUrl is not set', () => {
      const initialSession = { ...req.session };

      endSubSection(req);

      expect(req.session).toEqual(initialSession);
    });
  });

  describe('getCancelLink', () => {
    it('should return cancel URL', () => {
      const request = mockRequest({
        session: { userCase: mockUserCase },
      });
      const result = getCancelLink(request);
      expect(result).toBe('/case-details/1?lng=en');
    });
  });
});
