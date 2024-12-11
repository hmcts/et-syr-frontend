import fs from 'fs';
import path from 'path';

import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getApplicationsAccordionItems,
  getNextPage,
  isClaimantSystemUser,
} from '../../../../main/helpers/controller/ContactTribunalHelper';
import mockUserCase from '../../mocks/mockUserCase';

const pageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../../main/resources/locales/en/translation/contact-tribunal.json'),
    'utf-8'
  )
);

describe('Contact Tribunal Helper', () => {
  describe('getApplicationsAccordionItems', () => {
    it('should return an array of accordion items with proper content from JSON data', () => {
      const url = PageUrls.CONTACT_TRIBUNAL;
      const translations: AnyRecord = pageJson;
      const accordionItems = getApplicationsAccordionItems(url, translations);
      expect(accordionItems).toBeInstanceOf(Array);
      expect(accordionItems).toHaveLength(Object.keys(translations.sections).length);
      expect(accordionItems[0].heading.text).toBe(pageJson.sections.CHANGE_PERSONAL_DETAILS.label);
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
      const userCase = { id: 'case123', et1OnlineSubmission: undefined, hubLinksStatuses: undefined } as CaseWithId;
      const nextPage = isClaimantSystemUser(userCase);
      expect(nextPage).toBe(false);
    });
  });
});
