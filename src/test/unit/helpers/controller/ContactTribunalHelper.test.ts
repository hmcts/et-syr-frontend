import fs from 'fs';
import path from 'path';

import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getApplicationDisplayByCode,
  getApplicationDisplayByUrl,
  getApplicationsAccordionItems,
  getNextPage,
  isClaimantSystemUser,
} from '../../../../main/helpers/controller/ContactTribunalHelper';
import mockUserCase from '../../mocks/mockUserCase';

const contactTribunalPageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../../main/resources/locales/en/translation/contact-tribunal.json'),
    'utf-8'
  )
);

const applicationTypePageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../../main/resources/locales/en/translation/application-type.json'),
    'utf-8'
  )
);

describe('Contact Tribunal Helper', () => {
  describe('getApplicationsAccordionItems', () => {
    it('should return an array of accordion items with proper content from JSON data', () => {
      const url = PageUrls.CONTACT_TRIBUNAL;
      const translations: AnyRecord = contactTribunalPageJson;
      const accordionItems = getApplicationsAccordionItems(url, translations);
      expect(accordionItems).toBeInstanceOf(Array);
      expect(accordionItems).toHaveLength(Object.keys(translations.sections).length);
      expect(accordionItems[0].heading.text).toBe(contactTribunalPageJson.sections.CHANGE_PERSONAL_DETAILS.label);
    });
  });

  describe('getApplicationTypeByUrl', () => {
    it('should return the correct translation for a valid URL', () => {
      const result = getApplicationDisplayByUrl('apply-to-postpone-my-hearing', applicationTypePageJson);
      expect(result).toBe(applicationTypePageJson['POSTPONE_HEARING']);
    });

    it('should return an empty string if URL is empty', () => {
      const result = getApplicationDisplayByUrl('', applicationTypePageJson);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the URL', () => {
      const result = getApplicationDisplayByUrl('unknown-url', applicationTypePageJson);
      expect(result).toBe('');
    });
  });

  describe('getApplicationTypeByCode', () => {
    it('should return the correct translation for a valid application code', () => {
      const result = getApplicationDisplayByCode('Change personal details', applicationTypePageJson);
      expect(result).toBe(applicationTypePageJson['CHANGE_PERSONAL_DETAILS']);
    });

    it('should return an empty string if application code is empty', () => {
      const result = getApplicationDisplayByCode('', applicationTypePageJson);
      expect(result).toBe('');
    });

    it('should return an empty string if no translation exists for the application code', () => {
      const result = getApplicationDisplayByCode('Non-existent code', applicationTypePageJson);
      expect(result).toBe('');
    });
  });

  describe('getNextPage', () => {
    it('should return COPY_TO_OTHER_PARTY page for Type A/B applications when claimant is system user', () => {
      const nextPage = getNextPage(application.CHANGE_PERSONAL_DETAILS);
      expect(nextPage).toBe(PageUrls.COPY_TO_OTHER_PARTY);
    });

    it('should return CONTACT_TRIBUNAL_CYA page for Type C', () => {
      const nextPage = getNextPage(application.ORDER_WITNESS_ATTEND);
      expect(nextPage).toBe(PageUrls.CONTACT_TRIBUNAL_CYA);
    });
  });

  describe('isClaimantSystemUser', () => {
    it('should return true page when claimant is system user', () => {
      const nextPage = isClaimantSystemUser(mockUserCase);
      expect(nextPage).toBe(true);
    });

    it('should return false when claimant is offline', () => {
      const userCase = { id: 'case123', hubLinksStatuses: undefined } as CaseWithId;
      const nextPage = isClaimantSystemUser(userCase);
      expect(nextPage).toBe(false);
    });
  });
});
