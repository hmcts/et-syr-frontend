import { YesOrNo } from '../../../../main/definitions/case';
import { Applicant, PartiesNotify } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { getOtherRespondentApplications } from '../../../../main/helpers/controller/OtherRespondentApplicationsHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

describe('Other Respondent Applications Helper', () => {
  describe('getOtherRespondentApplications', () => {
    const translations = {
      ...applicationTypeJson,
      ...caseDetailsStatusJson,
    };
    const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
    req.session.user.id = 'user1';

    it('should return an empty array when genericTseApplicationCollection is undefined', () => {
      req.session.userCase.genericTseApplicationCollection = undefined;
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should return an empty array when genericTseApplicationCollection is empty', () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should filter out applications not from RESPONDENT', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.CLAIMANT,
            applicantIdamId: 'user2',
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should filter out applications from the same user', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user1',
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should exclude ORDER_WITNESS_ATTEND applications', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user2',
            type: application.ORDER_WITNESS_ATTEND.code,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should not include applications when copyToOtherPartyYesOrNo is No', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user2',
            copyToOtherPartyYesOrNo: YesOrNo.NO,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toEqual([]);
    });

    it('should include applications when copyToOtherPartyYesOrNo is YES', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user2',
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toHaveLength(1);
    });

    it('should include applications when applicantIdamId is missing', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toHaveLength(1);
    });

    it('should include applications if admin response is shared with respondent', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user2',
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            respondCollection: [
              {
                value: {
                  from: Applicant.ADMIN,
                  selectPartyNotify: PartiesNotify.RESPONDENT_ONLY,
                },
              },
            ],
          },
        },
      ];
      const result = getOtherRespondentApplications(req);
      expect(result).toHaveLength(1);
    });

    it('should include applications if admin decision is shared with respondent', () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'user2',
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
      const result = getOtherRespondentApplications(req);
      expect(result).toHaveLength(1);
    });
  });
});
