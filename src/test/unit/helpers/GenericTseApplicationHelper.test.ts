import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesRespond } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../main/definitions/util-types';
import {
  findSelectedGenericTseApplication,
  getAppType,
  getApplicationDisplay,
  isApplicantClaimant,
  isApplicantRespondent,
  isResponseToTribunalRequired,
  isTypeAOrB,
} from '../../../main/helpers/GenericTseApplicationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest } from '../mocks/mockRequest';
import { mockUserDetails } from '../mocks/mockUser';

describe('Generic Tse Application Helper', () => {
  describe('findSelectedGenericTseApplication', () => {
    const mockApp1: GenericTseApplicationTypeItem = {
      id: '1',
      value: {
        applicant: Applicant.RESPONDENT,
        type: application.CHANGE_PERSONAL_DETAILS.code,
      },
    };
    const mockApp2: GenericTseApplicationTypeItem = {
      id: '2',
      value: {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.code,
      },
    };

    it('should return the correct application when appId matches an item in the collection', () => {
      const request = mockRequest({});
      request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
      request.params.appId = '2';
      const result = findSelectedGenericTseApplication(request);
      expect(result).toEqual(request.session.userCase.genericTseApplicationCollection[1]);
    });

    it('should return undefined when appId does not match any item in the collection', () => {
      const request = mockRequest({});
      request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
      request.params.appId = '3';
      const result = findSelectedGenericTseApplication(request);
      expect(result).toBeUndefined();
    });

    it('should return undefined when appId is not defined', () => {
      const request = mockRequest({});
      request.session.userCase.genericTseApplicationCollection = [mockApp1, mockApp2];
      request.params.appId = undefined;
      const result = findSelectedGenericTseApplication(request);
      expect(result).toBeUndefined();
    });

    it('should return undefined when userCase is not defined', () => {
      const request = mockRequest({});
      request.session.userCase = undefined;
      request.params.appId = '2';
      const result = findSelectedGenericTseApplication(request);
      expect(result).toBeUndefined();
    });
  });

  describe('isApplicantRespondent', () => {
    it('should return true when applicant is Respondent', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT };
      const result = isApplicantRespondent(app);
      expect(result).toEqual(true);
    });

    it('should return true when applicant is Respondent Representative', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT_REP };
      const result = isApplicantRespondent(app);
      expect(result).toEqual(true);
    });

    it('should return false when applicant is Claimant', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.CLAIMANT };
      const result = isApplicantRespondent(app);
      expect(result).toEqual(false);
    });

    it('should return false when applicant is Claimant Representative', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.CLAIMANT_REP };
      const result = isApplicantRespondent(app);
      expect(result).toEqual(false);
    });

    it('should return false when applicant is undefined', () => {
      const app: GenericTseApplicationType = { applicant: undefined };
      const result = isApplicantRespondent(app);
      expect(result).toEqual(false);
    });

    it('should return false when GenericTseApplicationType is undefined', () => {
      const result = isApplicantRespondent(undefined);
      expect(result).toEqual(false);
    });
  });

  describe('isApplicantClaimant', () => {
    it('should return true when applicant is Claimant', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.CLAIMANT };
      const result = isApplicantClaimant(app);
      expect(result).toEqual(true);
    });

    it('should return true when applicant is Claimant Representative', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.CLAIMANT_REP };
      const result = isApplicantClaimant(app);
      expect(result).toEqual(true);
    });

    it('should return false when applicant is Respondent', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT };
      const result = isApplicantClaimant(app);
      expect(result).toEqual(false);
    });

    it('should return false when applicant is Respondent Representative', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT_REP };
      const result = isApplicantClaimant(app);
      expect(result).toEqual(false);
    });

    it('should return false when applicant is undefined', () => {
      const app: GenericTseApplicationType = { applicant: undefined };
      const result = isApplicantClaimant(app);
      expect(result).toEqual(false);
    });

    it('should return false when GenericTseApplicationType is undefined', () => {
      const result = isApplicantClaimant(undefined);
      expect(result).toEqual(false);
    });
  });

  describe('getApplicationDisplay', () => {
    const translations: AnyRecord = applicationTypeJson;

    it('should return translation when applicant is Respondent', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.code,
      };
      const result = getApplicationDisplay(app, translations);
      expect(result).toEqual('Amend my response');
    });

    it('should return translation when applicant is Claimant', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.AMEND_RESPONSE.claimant,
      };
      const result = getApplicationDisplay(app, translations);
      expect(result).toEqual('Amend my claim');
    });

    it('should return empty when applicant not match the code', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.claimant,
      };
      const result = getApplicationDisplay(app, translations);
      expect(result).toEqual('');
    });
  });

  describe('getAppType', () => {
    it('should return A when applicant is Respondent and type A', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.code,
      };
      const result = getAppType(app);
      expect(result).toEqual('A');
    });

    it('should return B when applicant is Respondent and type B', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.CHANGE_PERSONAL_DETAILS.code,
      };
      const result = getAppType(app);
      expect(result).toEqual('B');
    });

    it('should return C when applicant is Respondent and type C', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.ORDER_WITNESS_ATTEND.code,
      };
      const result = getAppType(app);
      expect(result).toEqual('C');
    });

    it('should return A when applicant is Claimant and type A', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.AMEND_RESPONSE.claimant,
      };
      const result = getAppType(app);
      expect(result).toEqual('A');
    });

    it('should return true when applicant is Claimant and type B', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.CHANGE_PERSONAL_DETAILS.claimant,
      };
      const result = getAppType(app);
      expect(result).toEqual('B');
    });

    it('should return C when applicant is Claimant and type C', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.ORDER_WITNESS_ATTEND.claimant,
      };
      const result = getAppType(app);
      expect(result).toEqual('C');
    });

    it('should return undefined when applicant is undefined', () => {
      const app: GenericTseApplicationType = {
        applicant: undefined,
        type: application.ORDER_WITNESS_ATTEND.claimant,
      };
      const result = getAppType(app);
      expect(result).toBeUndefined();
    });

    it('should return undefined when type is undefined', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: undefined,
      };
      const result = getAppType(app);
      expect(result).toBeUndefined();
    });

    it('should return undefined when applicant not match the code', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: 'Test',
      };
      const result = getAppType(app);
      expect(result).toBeUndefined();
    });

    it('should return undefined when application is undefined', () => {
      const result = getAppType(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('isTypeAOrB', () => {
    it('should return true when applicant is Respondent and type A', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.code,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(true);
    });

    it('should return false when applicant is Respondent and type C', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.ORDER_WITNESS_ATTEND.code,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(false);
    });

    it('should return true when applicant is Claimant and type A', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.AMEND_RESPONSE.claimant,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(true);
    });

    it('should return false when applicant is Claimant and type C', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.CLAIMANT,
        type: application.ORDER_WITNESS_ATTEND.claimant,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(false);
    });

    it('should return undefined when applicant is undefined', () => {
      const app: GenericTseApplicationType = {
        applicant: undefined,
        type: application.ORDER_WITNESS_ATTEND.claimant,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(false);
    });

    it('should return undefined when type is undefined', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: undefined,
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(false);
    });

    it('should return undefined when applicant not match the code', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: 'Test',
      };
      const result = isTypeAOrB(app);
      expect(result).toEqual(false);
    });

    it('should return undefined when application is undefined', () => {
      const result = isTypeAOrB(undefined);
      expect(result).toEqual(false);
    });
  });

  describe('isResponseToTribunalRequired', () => {
    it('should return true when user has not responded', () => {
      const app = {
        respondCollection: [
          {
            value: {
              from: Applicant.ADMIN,
              selectPartyRespond: PartiesRespond.RESPONDENT,
            },
          },
        ],
      };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(true);
    });

    it('should return false when admin not require responded', () => {
      const app = {
        respondCollection: [
          {
            value: {
              from: Applicant.ADMIN,
              selectPartyRespond: PartiesRespond.CLAIMANT,
            },
          },
        ],
      };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(false);
    });

    it('should return true when admin latest required response date is after user latest response date', () => {
      const app = {
        respondCollection: [
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '1234',
            },
          },
          {
            value: {
              from: Applicant.ADMIN,
              selectPartyRespond: PartiesRespond.BOTH_PARTIES,
            },
          },
        ],
      };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(true);
    });

    it('should return false when user latest response date is after admin required response date', () => {
      const app = {
        respondCollection: [
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '1234',
            },
          },
          {
            value: {
              from: Applicant.ADMIN,
              selectPartyRespond: PartiesRespond.BOTH_PARTIES,
            },
          },
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '1234',
            },
          },
        ],
      };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(false);
    });

    it('should return false when user is undefined', () => {
      const app: GenericTseApplicationType = mockGenericTseCollection[0].value;
      expect(isResponseToTribunalRequired(app, undefined)).toBe(false);
    });

    it('should return false when application is undefined', () => {
      expect(isResponseToTribunalRequired(undefined, mockUserDetails)).toBe(false);
    });

    it('should return false when respondCollection is undefined', () => {
      const app: GenericTseApplicationType = { respondCollection: undefined };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(false);
    });

    it('should return false when respondCollection is empty', () => {
      const app: GenericTseApplicationType = { respondCollection: [] };
      expect(isResponseToTribunalRequired(app, mockUserDetails)).toBe(false);
    });
  });
});
