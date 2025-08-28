import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, ErrorPages, PageUrls, languages } from '../../../main/definitions/constants';
import { FormFields } from '../../../main/definitions/form';
import {
  conditionalRedirect,
  endSubSection,
  endSubSectionReturnNextPage,
  getLanguageParam,
  isClearSelection,
  isClearSelectionWithoutRequestUserCaseCheck,
  returnNextPage,
  returnValidNotAllowedEndPointsForwardingUrl,
  returnValidUrl,
  startSubSection,
} from '../../../main/helpers/RouterHelpers';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
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

  describe('endSubSectionReturnNextPage', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should set returnUrl to subSectionUrl and clear subSectionUrl if subSectionUrl matches a CYA page', () => {
      req.session.subSectionUrl = PageUrls.CHECK_YOUR_ANSWERS_ET3;

      const result = endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD);

      expect(result).toBe(PageUrls.CHECK_YOUR_ANSWERS_ET3);
      expect(req.session.subSectionUrl).toBeUndefined();
    });

    it('should not modify session if subSectionUrl does not match a CYA page', () => {
      req.session.subSectionUrl = '/some-other-page';

      const result = endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD);

      expect(result).toBe(PageUrls.CLAIMANT_NOTICE_PERIOD);
      expect(req.session.subSectionUrl).toBe('/some-other-page');
    });

    it('should do nothing if subSectionUrl is not set', () => {
      const result = endSubSectionReturnNextPage(req, PageUrls.CLAIMANT_NOTICE_PERIOD);

      expect(result).toEqual(PageUrls.CLAIMANT_NOTICE_PERIOD);
    });
  });

  describe('isClearSelectionWithoutRequestUserCaseCheck', () => {
    it('should return false if request.query is empty', () => {
      const request = mockRequest({
        session: { userCase: mockUserCase },
      });
      expect(isClearSelectionWithoutRequestUserCaseCheck(request)).toBe(false);
    });
    it('should return false if request.query.redirect is empty', () => {
      const request = mockRequest({
        session: { userCase: mockUserCase },
      });
      request.query = { redirect: DefaultValues.STRING_EMPTY };
      expect(isClearSelectionWithoutRequestUserCaseCheck(request)).toBe(false);
    });
    it('should return true if request.query.redirect is clearSelection', () => {
      const request = mockRequest({
        session: { userCase: mockUserCase },
      });
      request.query = { redirect: DefaultValues.CLEAR_SELECTION };
      expect(isClearSelectionWithoutRequestUserCaseCheck(request)).toBe(true);
    });
  });
  describe('returnValidNotAllowedEndPointsForwardingUrl', () => {
    it('should return not found page when redirect url is undefined', () => {
      const request: AppRequest = mockRequest({});
      const redirectUrl: string = undefined;
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return not found page when redirect url does not contain case details or case list url', () => {
      const request: AppRequest = mockRequest({});
      const redirectUrl: string = 'https://localhost:3003/dummy-page';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return case list page with the given language parameter when redirect url includes case list url', () => {
      const request: AppRequest = mockRequest({});
      const redirectUrl: string = 'https://localhost:3003/case-list';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    it('should return not found page when redirect url includes case details but there is no selected respondent', () => {
      const request: AppRequest = mockRequest({});
      const redirectUrl: string = 'https://localhost:3003/case-details';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return not found page when there is no parameter for case-details', () => {
      const request: AppRequest = mockRequest({});
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      const redirectUrl: string = 'https://localhost:3003/case-details';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return not found page when first parameter not equals to case id', () => {
      const request: AppRequest = mockRequest({});
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      const redirectUrl: string = 'https://localhost:3003/case-details/123456/abcdefg';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return not found page when second parameter not equals to respondent ccdId', () => {
      const request: AppRequest = mockRequest({});
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      const redirectUrl: string = 'https://localhost:3003/case-details/1234/abcdef';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(ErrorPages.NOT_FOUND);
    });
    it('should return case details page when all parameters are valid', () => {
      const request: AppRequest = mockRequest({});
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      const redirectUrl: string = 'https://localhost:3003/case-details/1234/3453xaa';
      expect(returnValidNotAllowedEndPointsForwardingUrl(redirectUrl, request)).toStrictEqual(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
          DefaultValues.STRING_SLASH +
          request.session.userCase.id +
          DefaultValues.STRING_SLASH +
          request.session.userCase.respondents[0].ccdId +
          languages.ENGLISH_URL_PARAMETER
      );
    });
  });
});
