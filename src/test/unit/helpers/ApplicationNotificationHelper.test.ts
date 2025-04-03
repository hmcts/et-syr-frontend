import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesRespond } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../main/definitions/util-types';
import {
  getAppNotificationFromSubmit,
  getAppRequestNotification,
} from '../../../main/helpers/notification/ApplicationNotificationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsJson from '../../../main/resources/locales/en/translation/case-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockUserDetails } from '../mocks/mockUser';

describe('Application Notification Helper', () => {
  const translations: AnyRecord = {
    ...applicationTypeJson,
    ...caseDetailsJson,
  };
  const req = mockRequestWithTranslation({}, translations);
  req.session.user = mockUserDetails;

  describe('getApplicationNotificationFromAdmin', () => {
    it('should return notification banner when input valid', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: '1234',
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                },
              },
            ],
            respondentResponseRequired: YesOrNo.YES,
          },
        },
      ];
      const result = getAppRequestNotification(apps, req);
      expect(result).toHaveLength(1);
      expect(result[0].from).toEqual('your');
      expect(result[0].appName).toEqual('change my personal details');
      expect(result[0].appUrl).toEqual('/application-details/fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c?lng=en');
    });

    it('should return multiple notifications for multiple responses', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                },
              },
            ],
            respondentResponseRequired: YesOrNo.YES,
          },
        },
        {
          id: '6b5fb921-0522-4700-b81f-d391ac9b6ec4',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.POSTPONE_HEARING.claimant,
            respondCollection: [
              {
                id: '3d01849d-c586-4f43-8d2b-8c6432827dec',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.BOTH_PARTIES,
                },
              },
            ],
            respondentResponseRequired: YesOrNo.YES,
          },
        },
      ];
      const result = getAppRequestNotification(apps, req);
      expect(result).toHaveLength(2);
      expect(result[0].from).toEqual("the respondent's");
      expect(result[0].appName).toEqual('change my personal details');
      expect(result[1].from).toEqual("the claimant's");
      expect(result[1].appName).toEqual('postpone a hearing');
    });

    it('should return empty array when applications have no respondCollection', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
          },
        },
      ];
      const result = getAppRequestNotification(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when no response required', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.CLAIMANT,
                },
              },
            ],
            respondentResponseRequired: YesOrNo.NO,
          },
        },
      ];
      const result = getAppRequestNotification(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return an empty array when applications is empty', () => {
      const apps: GenericTseApplicationTypeItem[] = [];
      const result = getAppRequestNotification(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when applications is undefined', () => {
      const result = getAppRequestNotification(undefined, req);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAppNotificationFromSubmit', () => {
    it('should return notifications for multiple applications with respondent responses required', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
          },
        },
        {
          id: '6b5fb921-0522-4700-b81f-d391ac9b6ec4',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.POSTPONE_HEARING.claimant,
          },
        },
      ];
      const result = getAppNotificationFromSubmit(apps, req);
      expect(result).toHaveLength(2);
      expect(result[0].from).toEqual('respondent');
      expect(result[0].appName).toEqual('change my personal details');
      expect(result[0].appType).toEqual('B');
      expect(result[1].from).toEqual('claimant');
      expect(result[1].appName).toEqual('postpone a hearing');
      expect(result[1].appType).toEqual('A');
    });

    it('should return empty array when respondent response is required', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                },
              },
            ],
          },
        },
      ];
      const result = getAppNotificationFromSubmit(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when user has responded', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.code,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.RESPONDENT,
                  fromIdamId: '1234',
                },
              },
            ],
          },
        },
      ];
      const result = getAppNotificationFromSubmit(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when no applications are provided', () => {
      const apps: GenericTseApplicationTypeItem[] = [];
      const result = getAppNotificationFromSubmit(apps, req);
      expect(result).toHaveLength(0);
    });

    it('should return empty array when applications parameter is undefined', () => {
      const result = getAppNotificationFromSubmit(undefined, req);
      expect(result).toHaveLength(0);
    });
  });
});
