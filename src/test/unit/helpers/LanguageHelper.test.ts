import { DefaultValues, ErrorPages, PageUrls, languages } from '../../../main/definitions/constants';
import {
  addParameterToUrl,
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
      const redirectUrl: string = PageUrls.TESTING_REDIRECT_URL;
      const result = setUrlLanguage(req, redirectUrl);

      expect(result).toBe(redirectUrl + languages.WELSH_URL_PARAMETER);
      expect(req.session.lang).toBe(languages.WELSH);
    });

    it('should append English language parameter to the redirect URL and set session.lang to English when URL contains English parameter', () => {
      req.url = '/some-url?lng=en';
      const redirectUrl: string = PageUrls.TESTING_REDIRECT_URL;
      const result = setUrlLanguage(req, redirectUrl);

      expect(result).toBe(redirectUrl + languages.ENGLISH_URL_PARAMETER);
      expect(req.session.lang).toBe(languages.ENGLISH);
    });

    it('should return the original redirect URL if no language parameter is found in the URL', () => {
      req.url = '/some-url';
      const redirectUrl: string = PageUrls.TESTING_REDIRECT_URL;
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
  describe('addParameterToUrl', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        param: 'test=test',
        result: 'https://localhost:3003/employers-contract-claim?test=test',
      },
      { url: undefined, param: 'test=test', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_SPACE, param: 'test=test', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_EMPTY, param: 'test=test', result: DefaultValues.STRING_EMPTY },
    ])('check if given urls parameters are listed as string list: %o', ({ url, param, result }) => {
      expect(addParameterToUrl(url, param)).toStrictEqual(result);
    });
  });
  describe('setUrlLanguage version2', () => {
    let req: ReturnType<typeof mockRequest>;

    beforeEach(() => {
      req = mockRequest({});
    });
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam&lng=cy',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?testParam=testingParam&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam&lng=cy&test=test',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?testParam=testingParam&test=test&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?testParam=testingParam',
        expectedLang: languages.ENGLISH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&testParam=testingParam',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?test=test&testParam=testingParam&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&testParam=testingParam&test=test',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?testParam=testingParam&test=test&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&testParam=testingParam&lng=cy',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?test=test&testParam=testingParam&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&testParam=testingParam',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim?testParam=testingParam&lng=cy',
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: '/employers-contract-claim',
        expectedLang: languages.ENGLISH,
      },
      {
        url: undefined,
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        expectedLang: languages.ENGLISH,
      },
      {
        url: DefaultValues.STRING_SPACE,
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        expectedLang: languages.ENGLISH,
      },
      {
        url: DefaultValues.STRING_EMPTY,
        redirectUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        result: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
        expectedLang: languages.ENGLISH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam&test=test&lng=cy',
        redirectUrl: undefined,
        result: ErrorPages.NOT_FOUND,
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam&test=test&lng=cy',
        redirectUrl: DefaultValues.STRING_EMPTY,
        result: ErrorPages.NOT_FOUND,
        expectedLang: languages.WELSH,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?testParam=testingParam&test=test&lng=cy',
        redirectUrl: DefaultValues.STRING_SPACE,
        result: ErrorPages.NOT_FOUND,
        expectedLang: languages.WELSH,
      },
      {
        url: DefaultValues.STRING_EMPTY,
        redirectUrl: DefaultValues.STRING_SPACE,
        result: DefaultValues.STRING_HASH,
        expectedLang: languages.ENGLISH,
      },
    ])('check if given urls parameters are listed as string list: %o', ({ url, redirectUrl, result, expectedLang }) => {
      req.url = url;
      expect(setUrlLanguage(req, redirectUrl)).toStrictEqual(result);
      expect(req.session.lang).toStrictEqual(expectedLang);
    });
  });
});
