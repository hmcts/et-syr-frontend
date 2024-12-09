import fs from 'fs';
import path from 'path';

import { application } from '../../../main/definitions/contact-tribunal-applications';
import {
  getApplicationByUrl,
  getApplicationKeyByCode,
  getApplicationKeyByUrl,
  getApplicationTypeByCode,
  getApplicationTypeByUrl,
  isTypeAOrB,
} from '../../../main/helpers/ApplicationHelper';

const pageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/application-type.json'),
    'utf-8'
  )
);

describe('Applications Helper Test', () => {
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

  describe('getApplicationKeyByCode', () => {
    it('should return the application key for a valid application code', () => {
      const result = getApplicationKeyByCode('Change personal details');
      expect(result).toBe('CHANGE_PERSONAL_DETAILS');
    });

    it('should return undefined for an invalid application code', () => {
      const result = getApplicationKeyByCode('Non-existent code');
      expect(result).toBeUndefined();
    });
  });

  describe('getApplicationKeyByUrl', () => {
    it('should return the application key for a valid URL', () => {
      const result = getApplicationKeyByUrl('apply-to-amend-my-response');
      expect(result).toBe('AMEND_RESPONSE');
    });

    it('should return undefined for an invalid URL', () => {
      const result = getApplicationKeyByUrl('invalid-url');
      expect(result).toBeUndefined();
    });
  });

  describe('getApplicationTypeByUrl', () => {
    it('should return the correct translation for a valid URL', () => {
      const result = getApplicationTypeByUrl('apply-to-postpone-my-hearing', pageJson);
      expect(result).toBe(pageJson['POSTPONE_HEARING']);
    });

    it('should return an empty string if URL is empty', () => {
      const result = getApplicationTypeByUrl('', pageJson);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the URL', () => {
      const result = getApplicationTypeByUrl('unknown-url', pageJson);
      expect(result).toBe('');
    });
  });

  describe('getApplicationTypeByCode', () => {
    it('should return the correct translation for a valid application code', () => {
      const result = getApplicationTypeByCode('Change personal details', pageJson);
      expect(result).toBe(pageJson['CHANGE_PERSONAL_DETAILS']);
    });

    it('should return an empty string if application code is empty', () => {
      const result = getApplicationTypeByCode('', pageJson);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the application code', () => {
      const result = getApplicationTypeByCode('Non-existent code', pageJson);
      expect(result).toBe('');
    });
  });
});
