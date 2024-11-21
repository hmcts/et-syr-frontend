import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues, PageUrls } from '../../../main/definitions/constants';
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
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual('/case-details/1234/3453xaa?lng=en');
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have selected index', () => {
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session does not have user case', () => {
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = undefined;
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondents are empty', () => {
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents = [];
    expect(UrlUtils.getCaseDetailsUrlByRequest(request)).toStrictEqual(PageUrls.NOT_IMPLEMENTED);
  });
  test('getCaseDetailsUrlByRequest returns empty string when request.session.userCase respondent not found by selected index', () => {
    request.session.userCase = mockCaseWithIdWithRespondents;
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
});
