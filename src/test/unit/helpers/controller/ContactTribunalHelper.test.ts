import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { HubLinkStatus, HubLinksStatuses } from '../../../../main/definitions/hub';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getApplicationsAccordionItems,
  isClaimantSystemUser,
} from '../../../../main/helpers/controller/ContactTribunalHelper';
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

  describe('isClaimantSystemUser', () => {
    it('should return true when ET1 online submission is defined', () => {
      const userCase = {
        id: 'case123',
        et1OnlineSubmission: 'Yes',
      } as CaseWithId;
      const result = isClaimantSystemUser(userCase);
      expect(result).toBe(true);
    });

    it('should return true when hub links statuses are defined', () => {
      const userCase = {
        id: 'case123',
        hubLinksStatuses: {
          documents: HubLinkStatus.READY_TO_VIEW,
          et1ClaimForm: HubLinkStatus.SUBMITTED,
          hearingDetails: HubLinkStatus.NOT_YET_AVAILABLE,
          tribunalOrders: HubLinkStatus.NOT_YET_AVAILABLE,
          contactTribunal: HubLinkStatus.OPTIONAL,
          respondentResponse: HubLinkStatus.NOT_YET_AVAILABLE,
          tribunalJudgements: HubLinkStatus.NOT_YET_AVAILABLE,
          respondentApplications: HubLinkStatus.UPDATED,
          requestsAndApplications: HubLinkStatus.WAITING_FOR_TRIBUNAL,
        } as HubLinksStatuses,
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
