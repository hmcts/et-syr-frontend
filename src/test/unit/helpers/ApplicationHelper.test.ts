import { ApplicationType, application } from '../../../main/definitions/contact-tribunal-applications';
import {
  getApplicationByCode,
  getApplicationByUrl,
  getApplicationKey,
  isTypeAOrB,
} from '../../../main/helpers/ApplicationHelper';

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
  });

  describe('getApplicationKey', () => {
    it('should return the correct key for a valid application object', () => {
      const app = application.AMEND_RESPONSE;
      const result = getApplicationKey(app);
      expect(result).toBe('AMEND_RESPONSE');
    });

    it('should return undefined for an invalid application object', () => {
      const invalidApp = {
        code: 'Invalid application',
        url: 'invalid-url',
        type: ApplicationType.C,
      };
      const result = getApplicationKey(invalidApp);
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

    it('should return false if application type is C', () => {
      expect(isTypeAOrB(application.ORDER_WITNESS_ATTEND)).toBe(false);
    });
  });
});
