import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
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
});
