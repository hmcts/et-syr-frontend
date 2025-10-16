import { AppRequest } from '../../../main/definitions/appRequest';
import { Representative } from '../../../main/definitions/case';
import { RespondentUtils } from '../../../main/utils/RespondentUtils';
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

  describe('RespondentUtils.isSelectedRespondentRepresented', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return false when respondents are empty', () => {
      const req = {
        session: {
          userCase: {
            respondents: [],
            representatives: [{}],
          },
          selectedRespondentIndex: 0,
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.findSelectedRespondentRepresentative(req);
      expect(result).toBe(undefined);
    });

    it('should return false when representatives are empty', () => {
      const req = {
        session: {
          userCase: {
            respondents: [{}],
            representatives: [],
          },
          selectedRespondentIndex: 0,
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.findSelectedRespondentRepresentative(req);
      expect(result).toBe(undefined);
    });

    it('should return false when selectedRespondentIndex is empty', () => {
      const req = {
        session: {
          userCase: {
            respondents: [{}],
            representatives: [{}],
          },
          selectedRespondentIndex: null,
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.findSelectedRespondentRepresentative(req);
      expect(result).toBe(undefined);
    });

    it('should return true when a respondent matches a representative', () => {
      const representative: Representative = { respondentId: '123' };
      const req = {
        session: {
          userCase: {
            respondents: [{ ccdId: '123' }],
            representatives: [representative],
          },
          selectedRespondentIndex: 0,
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.findSelectedRespondentRepresentative(req);
      expect(result).toBe(representative);
    });

    it('should return false when no respondents match representatives', () => {
      const req = {
        session: {
          userCase: {
            respondents: [{ ccdId: '111' }],
            representatives: [{ respondentId: '222' }],
          },
          selectedRespondentIndex: 0,
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.findSelectedRespondentRepresentative(req);
      expect(result).toBe(undefined);
    });
  });
});
