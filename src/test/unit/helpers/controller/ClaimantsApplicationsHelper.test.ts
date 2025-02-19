import { YesOrNo } from '../../../../main/definitions/case';
import {
  TseAdminDecisionItem,
  TseRespondTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../../../main/definitions/links';
import {
  getClaimantsApplications,
  isAdminResponseShareToRespondent,
  isApplicationShare,
  isDecisionShareToRespondent,
} from '../../../../main/helpers/controller/ClaimantsApplicationsHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

describe('Claimants Applications Helper', () => {
  describe('getClaimantsApplications', () => {
    const translations = {
      ...applicationTypeJson,
      ...caseDetailsStatusJson,
    };

    it('should return filtered and formatted claimant applications', () => {
      const request = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      request.url = '/url';

      request.session.userCase.genericTseApplicationCollection = [
        {
          id: '1',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            applicationState: LinkStatus.IN_PROGRESS,
          },
        },
        {
          id: '2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            copyToOtherPartyText: 'No reason',
            applicationState: LinkStatus.IN_PROGRESS,
          },
        },
        {
          id: '3',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.AMEND_RESPONSE.code,
            applicationState: LinkStatus.WAITING_FOR_TRIBUNAL,
          },
        },
      ];

      const expectedOutput = [
        {
          id: '1',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            applicationState: 'inProgress',
          },
          linkValue: 'Change my personal details',
          redirectUrl: '/application-details/1?lng=en',
          statusColor: linkStatusColorMap.get(LinkStatus.IN_PROGRESS),
          displayStatus: 'In progress',
        },
      ];

      const result = getClaimantsApplications(request);

      expect(result).toHaveLength(1);
      expect(result).toEqual(expectedOutput);
    });

    it('should handle empty application collection', () => {
      const request = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      request.url = '/url';
      request.session.userCase.genericTseApplicationCollection = undefined;
      const result = getClaimantsApplications(request);
      expect(result).toEqual([]);
    });
  });

  describe('isAdminResponseShareToRespondent', () => {
    it('should return true when from is ADMIN and selectPartyNotify is BOTH_PARTIES', () => {
      const mockResponse: TseRespondTypeItem = {
        value: {
          from: Applicant.ADMIN,
          selectPartyNotify: Parties.BOTH_PARTIES,
        },
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(true);
    });

    it('should return true when from is ADMIN and selectPartyNotify is RESPONDENT_ONLY', () => {
      const mockResponse: TseRespondTypeItem = {
        value: {
          from: Applicant.ADMIN,
          selectPartyNotify: Parties.RESPONDENT_ONLY,
        },
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(true);
    });

    it('should return false when from is not ADMIN', () => {
      const mockResponse: TseRespondTypeItem = {
        value: {
          from: Applicant.RESPONDENT,
          selectPartyNotify: Parties.BOTH_PARTIES,
        },
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });

    it('should return false when selectPartyNotify is CLAIMANT_ONLY', () => {
      const mockResponse: TseRespondTypeItem = {
        value: {
          from: Applicant.ADMIN,
          selectPartyNotify: Parties.CLAIMANT_ONLY,
        },
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });

    it('should return false when response.value is undefined', () => {
      const mockResponse: TseRespondTypeItem = {};
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });
  });

  describe('isDecisionShareToRespondent', () => {
    it('should return true when selectPartyNotify is BOTH_PARTIES', () => {
      const mockDecision: TseAdminDecisionItem = {
        value: {
          selectPartyNotify: Parties.BOTH_PARTIES,
        },
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(true);
    });

    it('should return true when selectPartyNotify is RESPONDENT_ONLY', () => {
      const mockDecision: TseAdminDecisionItem = {
        value: {
          selectPartyNotify: Parties.RESPONDENT_ONLY,
        },
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(true);
    });

    it('should return false when selectPartyNotify is CLAIMANT_ONLY', () => {
      const mockDecision: TseAdminDecisionItem = {
        value: {
          selectPartyNotify: Parties.CLAIMANT_ONLY,
        },
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });

    it('should return false when selectPartyNotify is undefined', () => {
      const mockDecision: TseAdminDecisionItem = {
        value: {},
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });

    it('should return false when value is undefined', () => {
      const mockDecision: TseAdminDecisionItem = {};
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });
  });

  describe('isApplicationShare', () => {
    it('should return false if type is ORDER_WITNESS_ATTEND.code', () => {
      const mockApp = {
        value: {
          type: application.ORDER_WITNESS_ATTEND.code,
        },
      };
      expect(isApplicationShare(mockApp)).toBe(false);
    });

    it('should return true if copyToOtherPartyYesOrNo is YES', () => {
      const mockApp = {
        value: {
          copyToOtherPartyYesOrNo: YesOrNo.YES,
        },
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return true if respondCollection contains at least one valid response', () => {
      const mockApp = {
        value: {
          respondCollection: [
            {
              id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
              value: {
                from: Applicant.ADMIN,
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
          ],
        },
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return true if adminDecision contains at least one valid decision', () => {
      const mockApp = {
        value: {
          adminDecision: [
            {
              value: {
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
          ],
        },
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return false if none of the conditions are met', () => {
      const mockApp = {
        value: {
          type: application.CHANGE_PERSONAL_DETAILS.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      };
      expect(isApplicationShare(mockApp)).toBe(false);
    });

    it('should return false if value is undefined', () => {
      const mockApp = {};
      expect(isApplicationShare(mockApp)).toBe(false);
    });
  });
});
