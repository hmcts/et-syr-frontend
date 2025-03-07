import { UserDetails } from '../../../../main/definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { LinkStatus } from '../../../../main/definitions/links';
import {
  getYourApplicationCollection,
  isYourApplication,
  updateAppsDisplayInfo,
} from '../../../../main/helpers/controller/YourRequestAndApplicationsHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

describe('Your Request and Applications Helper', () => {
  describe('updateAppsDisplayInfo', () => {
    const translations = {
      ...applicationTypeJson,
      ...caseDetailsStatusJson,
    };

    it('should return an empty array if apps is empty', () => {
      const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      expect(updateAppsDisplayInfo([], req)).toEqual([]);
    });

    it('should update applications with linkValue, redirectUrl, statusColor, and displayStatus', () => {
      const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      req.session.user.id = '382afa39-0acf-467b-ad19-740b77ab3945';
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondentState: [
              {
                userIdamId: '382afa39-0acf-467b-ad19-740b77ab3945',
                applicationState: LinkStatus.NOT_STARTED_YET,
              },
            ],
          },
        },
        {
          id: '04a5064e-0766-4833-b740-d02520c604f2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.AMEND_RESPONSE.claimant,
            respondentState: [
              {
                userIdamId: 'b305e3eb-6aa6-4e7a-a506-f3c97c997953',
                applicationState: LinkStatus.NOT_VIEWED,
              },
              {
                userIdamId: '382afa39-0acf-467b-ad19-740b77ab3945',
                applicationState: LinkStatus.VIEWED,
              },
            ],
          },
        },
        {
          id: 'fc80aca1-d884-4a29-a42d-df5862e40efc',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.POSTPONE_HEARING.claimant,
          },
        },
      ];

      const updatedApps = updateAppsDisplayInfo(apps, req);

      expect(updatedApps).toHaveLength(3);

      expect(updatedApps[0].linkValue).toBe('Change my personal details');
      expect(updatedApps[0].redirectUrl).toBe('/application-details/fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c?lng=en');
      expect(updatedApps[0].statusColor).toBe('--red');
      expect(updatedApps[0].displayStatus).toBe('Not started yet');

      expect(updatedApps[1].linkValue).toBe('Amend my response');
      expect(updatedApps[1].redirectUrl).toBe('/application-details/04a5064e-0766-4833-b740-d02520c604f2?lng=en');
      expect(updatedApps[1].statusColor).toBe('--turquoise');
      expect(updatedApps[1].displayStatus).toBe('Viewed');

      expect(updatedApps[2].linkValue).toBe('Postpone a hearing');
      expect(updatedApps[2].redirectUrl).toBe('/application-details/fc80aca1-d884-4a29-a42d-df5862e40efc?lng=en');
      expect(updatedApps[2].statusColor).toBe('--red');
      expect(updatedApps[2].displayStatus).toBe('Not viewed yet');
    });
  });

  describe('getApplicationCollection', () => {
    const translations = {
      ...applicationTypeJson,
      ...caseDetailsStatusJson,
    };

    it('should return filtered and formatted user applications', () => {
      const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      req.url = '/url';
      req.session.user.id = '77734122-ddd9-4e29-921d-65a7efb2f9eb';
      req.session.userCase.genericTseApplicationCollection = [
        {
          id: 'c7816b56-2e08-4acf-8b96-542456fcb96e',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: '77734122-ddd9-4e29-921d-65a7efb2f9eb',
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondentState: [
              {
                userIdamId: '77734122-ddd9-4e29-921d-65a7efb2f9eb',
                applicationState: LinkStatus.IN_PROGRESS,
              },
            ],
          },
        },
        {
          id: '2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.AMEND_RESPONSE.code,
          },
        },
      ];

      const result = getYourApplicationCollection(req);

      expect(result).toHaveLength(1);
      expect(result[0].linkValue).toBe('Change my personal details');
      expect(result[0].redirectUrl).toBe('/application-details/c7816b56-2e08-4acf-8b96-542456fcb96e?lng=en');
      expect(result[0].statusColor).toBe('--yellow');
      expect(result[0].displayStatus).toBe('In progress');
    });

    it('should return an empty array if no Respondent application exist', () => {
      const request = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      request.url = '/url';
      request.session.userCase.genericTseApplicationCollection = [
        {
          id: '1',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.AMEND_RESPONSE.code,
            status: LinkStatus.IN_PROGRESS,
          },
        },
      ];

      const result = getYourApplicationCollection(request);

      expect(result).toEqual([]);
    });
  });

  describe('isYourApplication', () => {
    it('should return true when applicant is Respondent and ID matches', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT, applicantIdamId: 'user123' };
      const user: UserDetails = { id: 'user123' } as UserDetails;
      const result = isYourApplication(app, user);
      expect(result).toEqual(true);
    });

    it('should return false when applicant is not Respondent', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.CLAIMANT, applicantIdamId: 'user123' };
      const user: UserDetails = { id: 'user123' } as UserDetails;
      const result = isYourApplication(app, user);
      expect(result).toEqual(false);
    });

    it('should return false when applicant ID does not match user ID', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT, applicantIdamId: 'user123' };
      const user: UserDetails = { id: 'user456' } as UserDetails;
      const result = isYourApplication(app, user);
      expect(result).toEqual(false);
    });

    it('should return false when applicantIdamId is undefined', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT, applicantIdamId: undefined };
      const user: UserDetails = { id: 'user123' } as UserDetails;
      const result = isYourApplication(app, user);
      expect(result).toEqual(false);
    });

    it('should return false when GenericTseApplicationType is undefined', () => {
      const user: UserDetails = { id: 'user123' } as UserDetails;
      const result = isYourApplication(undefined, user);
      expect(result).toEqual(false);
    });

    it('should return false when user ID is undefined', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT, applicantIdamId: 'user123' };
      const user: UserDetails = { id: undefined } as UserDetails;
      const result = isYourApplication(app, user);
      expect(result).toEqual(false);
    });

    it('should return false when user is undefined', () => {
      const app: GenericTseApplicationType = { applicant: Applicant.RESPONDENT, applicantIdamId: 'user123' };
      const result = isYourApplication(app, undefined);
      expect(result).toEqual(false);
    });
  });
});
