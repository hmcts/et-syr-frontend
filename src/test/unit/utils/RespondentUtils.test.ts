import { AppRequest } from '../../../main/definitions/appRequest';
import { RespondentSolicitorType } from '../../../main/definitions/enums/respondentSolicitorType';
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
  describe('respondentRepresented', () => {
    const baseRequest = {
      session: {
        selectedRespondentIndex: 0,
        userCase: {},
      },
    } as unknown as AppRequest;

    const solicitorTypes = Object.values(RespondentSolicitorType);

    it.each(solicitorTypes)('should return true when organisation is present for %s', type => {
      const req = {
        ...baseRequest,
        session: {
          ...baseRequest.session,
          userCase: {
            [`respondentOrganisationPolicy${solicitorTypes.indexOf(type)}`]: {
              Organisation: { Name: 'Some Org' },
            },
          },
          selectedRespondentIndex: solicitorTypes.indexOf(type),
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.respondentRepresented(req);
      expect(result).toBe(true);
    });

    it('should return false when organisation is undefined', () => {
      const req = {
        ...baseRequest,
        session: {
          ...baseRequest.session,
          userCase: {
            respondentOrganisationPolicy0: { Organisation: undefined },
          },
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.respondentRepresented(req);
      expect(result).toBe(false);
    });

    it('should return false when policy does not exist', () => {
      const req = {
        ...baseRequest,
        session: {
          ...baseRequest.session,
          userCase: {
            // respondentOrganisationPolicy1 is missing
          },
        },
      } as unknown as AppRequest;

      const result = RespondentUtils.respondentRepresented(req);
      expect(result).toBe(false);
    });
  });
});
