import { YesOrNo } from '../../../../main/definitions/case';
import {
  GenericTseApplicationType,
  TseAdminDecision,
  TseRespondType,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesNotify } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
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
    const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);

    it('should return an empty array when genericTseApplicationCollection is undefined', () => {
      req.session.userCase.genericTseApplicationCollection = undefined;
      const result = getClaimantsApplications(req);
      expect(result).toEqual([]);
    });

    it('should return an empty array when genericTseApplicationCollection is empty', () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const result = getClaimantsApplications(req);
      expect(result).toEqual([]);
    });

    it('should filter out applications not from CLAIMANT', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getClaimantsApplications(req);
      expect(result).toEqual([]);
    });

    it('should not include applications from CLAIMANT say No', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
          },
        },
      ];
      const result = getClaimantsApplications(req);
      expect(result).toEqual([]);
    });

    it('should include applications from CLAIMANT', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getClaimantsApplications(req);
      expect(result).toHaveLength(1);
    });

    it('should include applications if admin response is shared with respondent', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            respondCollection: [
              {
                value: {
                  from: Applicant.ADMIN,
                  selectPartyNotify: PartiesNotify.BOTH_PARTIES,
                },
              },
            ],
          },
        },
      ];
      const result = getClaimantsApplications(req);
      expect(result).toHaveLength(1);
    });

    it('should include applications if admin decision is shared with respondent', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            adminDecision: [
              {
                value: {
                  selectPartyNotify: PartiesNotify.RESPONDENT_ONLY,
                },
              },
            ],
          },
        },
      ];
      const result = getClaimantsApplications(req);
      expect(result).toHaveLength(1);
    });
  });

  describe('isAdminResponseShareToRespondent', () => {
    it('should return true when from is ADMIN and selectPartyNotify is BOTH_PARTIES', () => {
      const mockResponse: TseRespondType = {
        from: Applicant.ADMIN,
        selectPartyNotify: PartiesNotify.BOTH_PARTIES,
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(true);
    });

    it('should return true when from is ADMIN and selectPartyNotify is RESPONDENT_ONLY', () => {
      const mockResponse: TseRespondType = {
        from: Applicant.ADMIN,
        selectPartyNotify: PartiesNotify.RESPONDENT_ONLY,
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(true);
    });

    it('should return false when from is not ADMIN', () => {
      const mockResponse: TseRespondType = {
        from: Applicant.RESPONDENT,
        selectPartyNotify: PartiesNotify.BOTH_PARTIES,
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });

    it('should return false when selectPartyNotify is CLAIMANT_ONLY', () => {
      const mockResponse: TseRespondType = {
        from: Applicant.ADMIN,
        selectPartyNotify: PartiesNotify.CLAIMANT_ONLY,
      };
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });

    it('should return false when response is empty', () => {
      const mockResponse: TseRespondType = {};
      expect(isAdminResponseShareToRespondent(mockResponse)).toBe(false);
    });

    it('should return false when response is undefined', () => {
      expect(isAdminResponseShareToRespondent(undefined)).toBe(false);
    });
  });

  describe('isDecisionShareToRespondent', () => {
    it('should return true when selectPartyNotify is BOTH_PARTIES', () => {
      const mockDecision: TseAdminDecision = {
        selectPartyNotify: PartiesNotify.BOTH_PARTIES,
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(true);
    });

    it('should return true when selectPartyNotify is RESPONDENT_ONLY', () => {
      const mockDecision: TseAdminDecision = {
        selectPartyNotify: PartiesNotify.RESPONDENT_ONLY,
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(true);
    });

    it('should return false when selectPartyNotify is CLAIMANT_ONLY', () => {
      const mockDecision: TseAdminDecision = {
        selectPartyNotify: PartiesNotify.CLAIMANT_ONLY,
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });

    it('should return false when selectPartyNotify is undefined', () => {
      const mockDecision: TseAdminDecision = {
        selectPartyNotify: undefined,
      };
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });

    it('should return false when Decision is empty', () => {
      const mockDecision: TseAdminDecision = {};
      expect(isDecisionShareToRespondent(mockDecision)).toBe(false);
    });

    it('should return false when Decision is undefined', () => {
      expect(isDecisionShareToRespondent(undefined)).toBe(false);
    });
  });

  describe('isApplicationShare', () => {
    it('should return false if type is ORDER_WITNESS_ATTEND.code', () => {
      const mockApp: GenericTseApplicationType = {
        type: application.ORDER_WITNESS_ATTEND.code,
      };
      expect(isApplicationShare(mockApp)).toBe(false);
    });

    it('should return true if copyToOtherPartyYesOrNo is YES', () => {
      const mockApp: GenericTseApplicationType = {
        copyToOtherPartyYesOrNo: YesOrNo.YES,
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return true if respondCollection contains at least one valid response', () => {
      const mockApp: GenericTseApplicationType = {
        respondCollection: [
          {
            id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
            value: {
              from: Applicant.ADMIN,
              selectPartyNotify: PartiesNotify.BOTH_PARTIES,
            },
          },
        ],
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return true if adminDecision contains at least one valid decision', () => {
      const mockApp: GenericTseApplicationType = {
        adminDecision: [
          {
            value: {
              selectPartyNotify: PartiesNotify.BOTH_PARTIES,
            },
          },
        ],
      };
      expect(isApplicationShare(mockApp)).toBe(true);
    });

    it('should return false if none of the conditions are met', () => {
      const mockApp: GenericTseApplicationType = {
        type: application.CHANGE_PERSONAL_DETAILS.code,
        copyToOtherPartyYesOrNo: YesOrNo.NO,
      };
      expect(isApplicationShare(mockApp)).toBe(false);
    });

    it('should return false if value is undefined', () => {
      const mockApp: GenericTseApplicationType = {};
      expect(isApplicationShare(mockApp)).toBe(false);
    });
  });
});
