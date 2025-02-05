import { YesOrNo } from '../../../../main/definitions/case';
import { Applicant, Parties } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../../../main/definitions/links';
import {
  getClaimantsApplications,
  isClaimantAppsShare,
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
            type: application.CHANGE_PERSONAL_DETAILS.code,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            status: LinkStatus.IN_PROGRESS,
          },
        },
        {
          id: '2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            copyToOtherPartyText: 'No reason',
            status: LinkStatus.IN_PROGRESS,
          },
        },
        {
          id: '3',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.AMEND_RESPONSE.code,
            status: LinkStatus.WAITING_FOR_TRIBUNAL,
          },
        },
      ];

      const expectedOutput = [
        {
          id: '1',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            status: 'inProgress',
          },
          linkValue: 'Change my personal details',
          redirectUrl: '/claimants-application-details/1?lng=en',
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

  describe('isClaimantAppsShare', () => {
    it('should return false if the applicant is not a claimant', () => {
      const applicationItem = {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          type: application.AMEND_RESPONSE.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(false);
    });

    it('should return false if the application type is ORDER_WITNESS_ATTEND', () => {
      const applicationItem = {
        id: '2',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.ORDER_WITNESS_ATTEND.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(false);
    });

    it('should return true if copyToOtherPartyYesOrNo is YES', () => {
      const applicationItem = {
        id: '3',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.CHANGE_PERSONAL_DETAILS.code,
          copyToOtherPartyYesOrNo: YesOrNo.YES,
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(true);
    });

    it('should return true if an admin notified both parties in respondCollection', () => {
      const applicationItem = {
        id: '4',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.AMEND_RESPONSE.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          respondCollection: [
            {
              value: {
                from: Applicant.ADMIN,
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
          ],
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(true);
    });

    it('should return false if no valid conditions are met', () => {
      const applicationItem = {
        id: '5',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.AMEND_RESPONSE.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          respondCollection: [
            {
              value: {
                from: Applicant.RESPONDENT,
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
          ],
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(false);
    });

    it('should return false if respondCollection is empty', () => {
      const applicationItem = {
        id: '6',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.CHANGE_PERSONAL_DETAILS.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(false);
    });

    it('should return false if respondCollection contains responses but none from ADMIN notifying respondent', () => {
      const applicationItem = {
        id: '7',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.CHANGE_PERSONAL_DETAILS.code,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          respondCollection: [
            {
              value: {
                from: Applicant.CLAIMANT,
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
            {
              value: {
                from: Applicant.ADMIN,
                selectPartyNotify: Parties.CLAIMANT_ONLY,
              },
            },
          ],
        },
      };

      expect(isClaimantAppsShare(applicationItem)).toBe(false);
    });
  });
});
