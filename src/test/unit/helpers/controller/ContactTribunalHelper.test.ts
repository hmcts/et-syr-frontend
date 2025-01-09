import fs from 'fs';
import path from 'path';

import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  clearTempFields,
  getApplicationDisplayByCode,
  getApplicationDisplayByUrl,
  getApplicationsAccordionItems,
  getCyaContent,
  getNextPage,
  isClaimantSystemUser,
} from '../../../../main/helpers/controller/ContactTribunalHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import contactTribunalCyaJson from '../../../../main/resources/locales/en/translation/contact-tribunal-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

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

  describe('getCyaContent', () => {
    it('should generate the correct summary list for a complete case', () => {
      const translations = {
        ...commonJson,
        ...applicationTypeJson,
        ...contactTribunalCyaJson,
      };
      const req = mockRequestWithTranslation({}, translations);

      const userCase = req.session.userCase;
      userCase.contactApplicationType = 'Strike out all or part of a claim';
      userCase.contactApplicationText = 'Test';
      userCase.contactApplicationFile = {
        document_binary_url: 'test-binary-url',
        document_size: 1024,
        document_mime_type: 'application/pdf',
        document_filename: 'test-file.pdf',
        document_url: 'test-url',
      };
      userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
      userCase.copyToOtherPartyText = 'No Reason';

      const expectedRows = [
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.applicationType,
          },
          value: {
            text: 'Strike out the claim',
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.applicationType,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.legend,
          },
          value: {
            text: userCase.contactApplicationText,
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal/strike-out-all-or-part-of-application?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.legend,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.supportingMaterial,
          },
          value: {
            html: 'link',
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal/strike-out-all-or-part-of-application?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.supportingMaterial,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.copyToOtherPartyYesOrNo,
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: '/copy-to-other-party?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.copyToOtherPartyYesOrNo,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.copyToOtherPartyText,
          },
          value: {
            text: userCase.copyToOtherPartyText,
          },
          actions: {
            items: [
              {
                href: '/copy-to-other-party?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.copyToOtherPartyText,
              },
            ],
          },
        },
      ];

      const cyaContent = getCyaContent(req, translations);

      expect(cyaContent).toEqual(expectedRows);
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
