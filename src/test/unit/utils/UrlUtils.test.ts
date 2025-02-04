import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, PageUrls, languages } from '../../../main/definitions/constants';
import UrlUtils from '../../../main/utils/UrlUtils';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';

describe('UrlUtils tests', () => {
  const t = {
    common: {},
  };
  const request: AppRequest = mockRequest({ t });
  request.url = 'http://localhost:8080';
  test('getCaseDetailsUrlByRequest returns a valid URL', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 0;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual('/case-details/1234/3453xaa?lng=en');
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have selected index', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have user case', () => {
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondents are empty', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents = [];
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondent not found by selected index', () => {
    request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
    request.session.selectedRespondentIndex = 110;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  describe('removeParameterFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?test=test&lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: '',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: ' ',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: undefined,
        result: 'https://localhost:3003/employers-contract-claim',
      },
      { url: undefined, parameter: 'redirect=clearSelection', result: undefined },
      { url: DefaultValues.STRING_SPACE, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_SPACE },
      { url: DefaultValues.STRING_EMPTY, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_EMPTY },
    ])('check if given parameter is removed from url: %o', ({ url, parameter, result }) => {
      expect(UrlUtils.removeParameterFromUrl(url, parameter)).toStrictEqual(result);
    });
  });
  describe('getRequestParamsFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        result: ['redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        result: ['redirect=clearSelection', 'lng=cy', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        result: ['redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        result: ['lng=cy', 'test=test', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        result: ['lng=cy', 'redirect=clearSelection', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        result: ['test=test', 'redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        result: ['lng=cy', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        result: [],
      },
      { url: undefined, result: [] },
      { url: DefaultValues.STRING_SPACE, result: [] },
      { url: DefaultValues.STRING_EMPTY, result: [] },
    ])('check if given urls parameters are listed as string list: %o', ({ url, result }) => {
      expect(UrlUtils.getRequestParamsFromUrl(url)).toStrictEqual(result);
    });
  });
  describe('findParameterWithValueByParameterName tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        parameterName: 'redirectInvalid',
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: 'redirect',
        result: 'redirect=clearSelection',
      },
      { url: undefined, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_EMPTY, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      { url: DefaultValues.STRING_SPACE, parameterName: 'redirect', result: DefaultValues.STRING_EMPTY },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: undefined,
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: DefaultValues.STRING_EMPTY,
        result: DefaultValues.STRING_EMPTY,
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameterName: DefaultValues.STRING_SPACE,
        result: DefaultValues.STRING_EMPTY,
      },
    ])('check if given urls parameters are listed as string list: %o', ({ url, parameterName, result }) => {
      expect(UrlUtils.findParameterWithValueByParameterName(url, parameterName)).toStrictEqual(result);
    });
  });
  describe('getNotAllowedEndPointsForwardingUrlByRequest tests', () => {
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request is undefined', () => {
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(undefined)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session user case is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when request session user case id is empty', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.userCase.id = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when selected respondent is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case list page when selected respondent ccdId is undefined', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      req.session.userCase.respondents[0].ccdId = undefined;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_LIST + languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case details page', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
          DefaultValues.STRING_SLASH +
          req.session.userCase.id +
          DefaultValues.STRING_SLASH +
          req.session.userCase.respondents[0].ccdId +
          languages.ENGLISH_URL_PARAMETER
      );
    });
    test('getNotAllowedEndPointsForwardingUrlByRequest returns case details page with welsh language parameter if request url is welsh', () => {
      const req: AppRequest = mockRequest({});
      req.url = 'https://localhost:8080?lng=cy';
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.selectedRespondentIndex = 0;
      expect(UrlUtils.getNotAllowedEndPointsForwardingUrlByRequest(req)).toStrictEqual(
        PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER +
          DefaultValues.STRING_SLASH +
          req.session.userCase.id +
          DefaultValues.STRING_SLASH +
          req.session.userCase.respondents[0].ccdId +
          languages.WELSH_URL_PARAMETER
      );
    });
  });
  describe('getValidUrl tests', () => {
    it.each([
      {
        url: undefined,
        result: DefaultValues.STRING_HASH,
      },
      {
        url: null,
        result: DefaultValues.STRING_HASH,
      },
      {
        url: '',
        result: DefaultValues.STRING_HASH,
      },
      {
        url: '    ',
        result: DefaultValues.STRING_HASH,
      },
      {
        url: 'employers-contract-claim',
        result: DefaultValues.STRING_HASH,
      },
      {
        url: 'employers-contract-claim?lng=cy&redirect=clearSelection',
        result: DefaultValues.STRING_HASH,
      },
      {
        url: '/employers-contract-claim',
        result: '/employers-contract-claim',
      },
      {
        url: '/employers-contract-claim?lng=cy',
        result: '/employers-contract-claim?lng=cy',
      },
      {
        url: '/employers-contract-claim?lng=cy&redirect=clearSelection',
        result: '/employers-contract-claim?lng=cy&redirect=clearSelection',
      },
      {
        url: '/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        result: '/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&test=test&lng=cy',
        result: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&test=test&lng=cy',
      },
    ])('check if given url is a valid url: %o', ({ url, result }) => {
      expect(UrlUtils.getValidUrl(url)).toStrictEqual(result);
    });
  });
});
