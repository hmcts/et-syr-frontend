import { languages } from '../../../main/definitions/constants';
import {
  setChangeAnswersUrlLanguage,
  setCheckAnswersLanguage,
  setUrlLanguage,
} from '../../../main/helpers/LanguageHelper';
import { mockRequest } from '../mocks/mockRequest';

describe('Language Helper Functions', () => {
  describe('setUrlLanguage', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should append Welsh language parameter to the redirect URL and set session.lang to Welsh when URL contains Welsh parameter', () => {
      req.url = '/some-url?lng=cy';
      const redirectUrl = '/redirect-url';
      const result = setUrlLanguage(req, redirectUrl);

      expect(result).toBe(redirectUrl + languages.WELSH_URL_PARAMETER);
      expect(req.session.lang).toBe(languages.WELSH);
    });

    it('should append English language parameter to the redirect URL and set session.lang to English when URL contains English parameter', () => {
      req.url = '/some-url?lng=en';
      const redirectUrl = '/redirect-url';
      const result = setUrlLanguage(req, redirectUrl);

      expect(result).toBe(redirectUrl + languages.ENGLISH_URL_PARAMETER);
      expect(req.session.lang).toBe(languages.ENGLISH);
    });

    it('should return the original redirect URL if no language parameter is found in the URL', () => {
      req.url = '/some-url';
      const redirectUrl = '/redirect-url';
      const result = setUrlLanguage(req, redirectUrl);

      expect(result).toBe(redirectUrl);
      expect(req.session.lang).toBe(languages.ENGLISH); // ENG as default if no lang is set
    });
  });

  describe('setChangeAnswersUrlLanguage', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should return Welsh language parameter if the cookie i18next is set to Welsh', () => {
      req.cookies.i18next = languages.WELSH;
      const result = setChangeAnswersUrlLanguage(req);

      expect(result).toBe(languages.WELSH_URL_PARAMETER);
    });

    it('should return English language parameter if the cookie i18next is set to English', () => {
      req.cookies.i18next = languages.ENGLISH;
      const result = setChangeAnswersUrlLanguage(req);

      expect(result).toBe(languages.ENGLISH_URL_PARAMETER);
    });

    it('should return English language parameter by default if no i18next cookie is present', () => {
      req.cookies.i18next = undefined;
      const result = setChangeAnswersUrlLanguage(req);

      expect(result).toBe(languages.ENGLISH_URL_PARAMETER);
    });
  });

  describe('setCheckAnswersLanguage', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });

    it('should append Welsh language parameter to the session URL if the cookie i18next is set to Welsh', () => {
      req.cookies.i18next = languages.WELSH;
      const sessionUrl = '/check-answers';
      const result = setCheckAnswersLanguage(req, sessionUrl);

      expect(result).toBe(sessionUrl + languages.WELSH_URL_PARAMETER);
    });

    it('should append English language parameter to the session URL if the cookie i18next is set to English', () => {
      req.cookies.i18next = languages.ENGLISH;
      const sessionUrl = '/check-answers';
      const result = setCheckAnswersLanguage(req, sessionUrl);

      expect(result).toBe(sessionUrl + languages.ENGLISH_URL_PARAMETER);
    });

    it('should append English language parameter by default if no i18next cookie is present', () => {
      req.cookies.i18next = undefined;
      const sessionUrl = '/check-answers';
      const result = setCheckAnswersLanguage(req, sessionUrl);

      expect(result).toBe(sessionUrl + languages.ENGLISH_URL_PARAMETER);
    });
  });
});
