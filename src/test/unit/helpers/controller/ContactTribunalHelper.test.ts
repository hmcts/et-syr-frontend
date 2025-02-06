import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  clearTempFields,
  getApplicationDisplayByCode,
  getApplicationDisplayByUrl,
  getApplicationsAccordionItems,
  isClaimantSystemUser,
} from '../../../../main/helpers/controller/ContactTribunalHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import contactTribunalJson from '../../../../main/resources/locales/en/translation/contact-tribunal.json';

describe('Contact Tribunal Helper', () => {
  describe('getApplicationsAccordionItems', () => {
    it('should return an array of accordion items with proper content from JSON data', () => {
      const url = PageUrls.CONTACT_TRIBUNAL;
      const translations: AnyRecord = contactTribunalJson;
      const accordionItems = getApplicationsAccordionItems(url, translations);
      expect(accordionItems).toBeInstanceOf(Array);
      expect(accordionItems).toHaveLength(Object.keys(translations.sections).length);
      expect(accordionItems[0].heading.text).toBe(contactTribunalJson.sections.CHANGE_PERSONAL_DETAILS.label);
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

  describe('clearTempFields', () => {
    it('should clear all temporary fields from userCase', () => {
      const userCase = {
        id: 'case123',
        contactApplicationType: 'witness',
        contactApplicationText: 'Change claim',
        contactApplicationFile: {
          document_url: '12345',
          document_filename: 'test.pdf',
          document_binary_url: '',
          document_size: 1000,
          document_mime_type: 'pdf',
        },
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No reason',
      } as CaseWithId;

      clearTempFields(userCase);

      expect(userCase.contactApplicationType).toBeUndefined();
      expect(userCase.contactApplicationText).toBeUndefined();
      expect(userCase.contactApplicationFile).toBeUndefined();
      expect(userCase.copyToOtherPartyYesOrNo).toBeUndefined();
      expect(userCase.copyToOtherPartyText).toBeUndefined();
    });
  });
});
