import { AppRequest } from '../../../../main/definitions/appRequest';
import { YesOrNo } from '../../../../main/definitions/case';
import { isRequestedUrlNotAllowedAfterSubmission } from '../../../../main/modules/oidc/notAllowedEndpointsAfterSubmission';
import { mockCaseWithIdWithRespondents } from '../../mocks/mockCaseWithId';
import { mockRequest } from '../../mocks/mockRequest';

describe('notAllowedEndpointsAfterSubmission tests', () => {
  describe('isRequestedUrlNotAllowedAfterSubmission tests', () => {
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request is undefined', () => {
      expect(isRequestedUrlNotAllowedAfterSubmission(undefined)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request url is blank', () => {
      const request: AppRequest = mockRequest({});
      request.url = undefined;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request session is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.url = 'http://localhost:8080';
      request.session = undefined;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request session user case is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.url = 'http://localhost:8080';
      request.session.userCase = undefined;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request session user case response received is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.url = 'http://localhost:8080';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = undefined;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when request session user case response received is YesOrNo.NO', () => {
      const request: AppRequest = mockRequest({});
      request.url = 'http://localhost:8080';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = YesOrNo.NO;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns false when URL is allowed after submission', () => {
      const request: AppRequest = mockRequest({});
      request.url = 'http://localhost:8080';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = YesOrNo.YES;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(false);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns true when URL is not allowed after submission and there is no language parameter', () => {
      const request: AppRequest = mockRequest({});
      request.url = '/respondent-name';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = YesOrNo.YES;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(true);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns true when URL is not allowed after submission and language is English', () => {
      const request: AppRequest = mockRequest({});
      request.url = '/respondent-name?lng=en';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = YesOrNo.YES;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(true);
    });
    test('isRequestedUrlNotAllowedAfterSubmission returns true when URL is not allowed after submission and language is Welsh', () => {
      const request: AppRequest = mockRequest({});
      request.url = '/respondent-name?lng=cy';
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.responseReceived = YesOrNo.YES;
      expect(isRequestedUrlNotAllowedAfterSubmission(request)).toStrictEqual(true);
    });
  });
});
