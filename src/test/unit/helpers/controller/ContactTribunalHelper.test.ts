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
    it('should return true when ET1 online submission is defined', () => {
      const userCase = {
        id: 'case123',
        et1OnlineSubmission: 'submitted Et1 Form',
      } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(true);
    });

    it('should return true when hub links statuses are defined', () => {
      const userCase = {
        id: 'case123',
        hubLinksStatuses: {},
      } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(true);
    });

    it('should return true when claimant is represented by MyHMCTS', () => {
      const userCase = {
        id: 'case123',
        caseSource: 'MyHMCTS',
        claimantRepresentedQuestion: 'Yes',
        representativeClaimantType: {
          myHmctsOrganisation: {
            organisationID: 'orgId',
            organisationName: 'orgName',
          },
        },
      } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(true);
    });

    it('should return false when no relevant fields are defined', () => {
      const userCase = { id: 'case123' } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(false);
    });

    it('should return false when input is undefined', () => {
      const result = isClaimantSystemUser(undefined);
      expect(result).toBe(false);
    });

    it('should return false when claimant is not represented and other fields are undefined', () => {
      const userCase = {
        id: 'case123',
        caseSource: 'Test',
        claimantRepresentedQuestion: 'No',
      } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(false);
    });
  });
});