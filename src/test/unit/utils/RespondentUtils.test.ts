import { AppRequest } from '../../../main/definitions/appRequest';
import RespondentUtils from '../../../main/utils/RespondentUtils';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';

describe('RespondentUtils tests', () => {
  describe('findSelectedRespondentByRequest tests', () => {
    it('Cannot find selected respondent when request is undefined.', () => {
      expect(RespondentUtils.findSelectedRespondentByRequest(undefined)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session is undefined.', () => {
      const request: AppRequest = mockRequest({});
      request.session = undefined;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session user case is undefined.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = undefined;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session user case respondents is undefined.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase.respondents = undefined;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session selected respondent index is undefined.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase.respondents = [mockRespondentET3Model];
      request.session.selectedRespondentIndex = undefined;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session selected respondent index is equal to size of the respondent collection.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase.respondents = [mockRespondentET3Model];
      request.session.selectedRespondentIndex = 1;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Cannot find selected respondent when request session selected respondent index is bigger than size of the respondent collection.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase.respondents = [mockRespondentET3Model];
      request.session.selectedRespondentIndex = 2;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(undefined);
    });
    it('Should find selected respondent when request session selected respondent index is less than size of the respondent collection.', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase.respondents = [mockRespondentET3Model];
      request.session.selectedRespondentIndex = 0;
      expect(RespondentUtils.findSelectedRespondentByRequest(request)).toStrictEqual(mockRespondentET3Model);
    });
  });
});
