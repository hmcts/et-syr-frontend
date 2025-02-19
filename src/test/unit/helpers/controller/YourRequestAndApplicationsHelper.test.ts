import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import { LinkStatus, linkStatusColorMap } from '../../../../main/definitions/links';
import {
  getApplicationCollection,
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
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            applicationState: HubLinkStatus.NOT_STARTED_YET,
          },
        },
        {
          id: '04a5064e-0766-4833-b740-d02520c604f2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.AMEND_RESPONSE.claimant,
            applicationState: HubLinkStatus.NOT_VIEWED,
          },
        },
      ];

      const updatedApps = updateAppsDisplayInfo(apps, req);

      expect(updatedApps).toHaveLength(2);
      expect(updatedApps[0].linkValue).toBe('Change my personal details');
      expect(updatedApps[0].redirectUrl).toBe('/application-details/fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c?lng=en');
      expect(updatedApps[0].statusColor).toBe('--red');
      expect(updatedApps[0].displayStatus).toBe('Not started yet');

      expect(updatedApps[1].linkValue).toBe('Amend my response');
      expect(updatedApps[1].redirectUrl).toBe('/application-details/04a5064e-0766-4833-b740-d02520c604f2?lng=en');
      expect(updatedApps[1].statusColor).toBe('--red');
      expect(updatedApps[1].displayStatus).toBe('Not viewed yet');
    });
  });

  describe('getApplicationCollection', () => {
    const translations = {
      ...applicationTypeJson,
      ...caseDetailsStatusJson,
    };

    it('should return filtered and formatted claimant items', () => {
      const request = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      request.url = '/url';
      request.session.userCase.genericTseApplicationCollection = [
        {
          id: '1',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            applicationState: LinkStatus.IN_PROGRESS,
          },
        },
        {
          id: '2',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.AMEND_RESPONSE.code,
            applicationState: LinkStatus.WAITING_FOR_TRIBUNAL,
          },
        },
      ];

      const expectedOutput = [
        {
          id: '1',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            applicationState: 'inProgress',
          },
          linkValue: 'Change my personal details',
          redirectUrl: '/application-details/1?lng=en',
          statusColor: linkStatusColorMap.get(LinkStatus.IN_PROGRESS),
          displayStatus: 'In progress',
        },
      ];

      const result = getApplicationCollection(request);

      expect(result).toEqual(expectedOutput);
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

      const result = getApplicationCollection(request);

      expect(result).toEqual([]);
    });
  });
});
