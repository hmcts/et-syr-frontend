import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../main/definitions/util-types';
import {
  findSelectedGenericTseApplication,
  getApplicationDisplay,
  isTypeAOrB,
} from '../../../main/helpers/GenericTseApplicationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import { mockRequest } from '../mocks/mockRequest';

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
      expect(result).toEqual('Amend my response');
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

    it('should return undefined when application is undefined', () => {
      const result = isTypeAOrB(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined when applicant not match the code', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        type: application.AMEND_RESPONSE.claimant,
      };
      const result = isTypeAOrB(app);
      expect(result).toBeUndefined();
    });
  });
});
