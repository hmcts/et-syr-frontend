import { Application, ApplicationType, application } from '../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../main/definitions/util-types';
import {
  getApplicationByCode,
  getApplicationByUrl,
  getApplicationDisplayByClaimantCode,
  getApplicationDisplayByCode,
  getApplicationDisplayByUrl,
  getApplicationKey,
  isTypeAOrB,
} from '../../../main/helpers/ApplicationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';

describe('Applications Helper Test', () => {
  describe('getApplicationByCode', () => {
    it('should return the correct application for a valid code', () => {
      const result = getApplicationByCode('Strike out all or part of a claim');
      expect(result).toEqual(application.STRIKE_OUT_CLAIM);
    });

    it('should return undefined for an invalid code', () => {
      const result = getApplicationByCode('Invalid code');
      expect(result).toBeUndefined();
    });

    it('should return undefined for an undefined code', () => {
      const result = getApplicationByCode(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getApplicationByUrl', () => {
    it('should return the application object for a given valid URL', () => {
      const result = getApplicationByUrl('apply-to-postpone-my-hearing');
      expect(result).toEqual(application.POSTPONE_HEARING);
    });

    it('should return undefined for an invalid URL', () => {
      const result = getApplicationByUrl('invalid-url');
      expect(result).toBeUndefined();
    });

    it('should return undefined for an undefined URL', () => {
      const result = getApplicationByUrl(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getApplicationKey', () => {
    it('should return the correct key for a valid application', () => {
      const app = application.AMEND_RESPONSE;
      const result = getApplicationKey(app);
      expect(result).toBe('AMEND_RESPONSE');
    });

    it('should return undefined for an invalid application', () => {
      const invalidApp: Application = {
        code: 'Invalid application',
        claimant: 'Invalid application',
        url: 'invalid-url',
        type: ApplicationType.C,
      };
      const result = getApplicationKey(invalidApp);
      expect(result).toBeUndefined();
    });

    it('should return undefined for an undefined application', () => {
      const result = getApplicationKey(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('isTypeAOrB', () => {
    it('should return true if application type is A', () => {
      expect(isTypeAOrB(application.POSTPONE_HEARING)).toBe(true);
    });

    it('should return true if application type is B', () => {
      expect(isTypeAOrB(application.CONSIDER_DECISION_AFRESH)).toBe(true);
    });

    it('should return false if application is WITHDRAWAL_OF_ALL_OR_PART_CLAIM', () => {
      expect(isTypeAOrB(application.WITHDRAWAL_OF_ALL_OR_PART_CLAIM)).toBe(true);
    });

    it('should return false if application type is C', () => {
      expect(isTypeAOrB(application.ORDER_WITNESS_ATTEND)).toBe(false);
    });
  });

  describe('getApplicationTypeByUrl', () => {
    const translations: AnyRecord = applicationTypeJson;

    it('should return the correct translation for a valid URL', () => {
      const result = getApplicationDisplayByUrl(application.CHANGE_PERSONAL_DETAILS.url, translations);
      expect(result).toBe(translations['CHANGE_PERSONAL_DETAILS']);
    });

    it('should return an empty string if URL is empty', () => {
      const result = getApplicationDisplayByUrl('', translations);
      expect(result).toBe('');
    });

    it('should return an empty string if URL is undefined', () => {
      const result = getApplicationDisplayByUrl(undefined, translations);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the URL', () => {
      const result = getApplicationDisplayByUrl('unknown-url', translations);
      expect(result).toBe('');
    });
  });

  describe('getApplicationTypeByCode', () => {
    const translations: AnyRecord = applicationTypeJson;

    it('should return the correct translation for a valid application code', () => {
      const result = getApplicationDisplayByCode(application.CHANGE_PERSONAL_DETAILS.code, translations);
      expect(result).toBe(translations['CHANGE_PERSONAL_DETAILS']);
    });

    it('should return an empty string if application code is empty', () => {
      const result = getApplicationDisplayByCode('', translations);
      expect(result).toBe('');
    });

    it('should return an empty string if application code is undefined', () => {
      const result = getApplicationDisplayByCode(undefined, translations);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the application code', () => {
      const result = getApplicationDisplayByCode('Non-existent code', translations);
      expect(result).toBe('');
    });
  });

  describe('getApplicationDisplayByClaimantCode', () => {
    const translations: AnyRecord = applicationTypeJson;

    it('should return the correct translation for a valid application code', () => {
      const result = getApplicationDisplayByClaimantCode(application.CHANGE_PERSONAL_DETAILS.claimant, translations);
      expect(result).toBe(translations['CHANGE_PERSONAL_DETAILS']);
    });

    it('should return an empty string if application code is empty', () => {
      const result = getApplicationDisplayByClaimantCode('', translations);
      expect(result).toBe('');
    });

    it('should return an empty string if application code is undefined', () => {
      const result = getApplicationDisplayByClaimantCode(undefined, translations);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the application code', () => {
      const result = getApplicationDisplayByClaimantCode('Non-existent code', translations);
      expect(result).toBe('');
    });
  });
});
