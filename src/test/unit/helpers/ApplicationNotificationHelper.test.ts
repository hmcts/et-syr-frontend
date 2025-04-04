import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesRespond } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { AnyRecord } from '../../../main/definitions/util-types';
import { getAppNotifications } from '../../../main/helpers/notification/ApplicationNotificationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsJson from '../../../main/resources/locales/en/translation/case-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockUserDetails } from '../mocks/mockUser';

describe('Application Notification Helper', () => {
  describe('getAppNotifications', () => {
    const translations: AnyRecord = {
      ...applicationTypeJson,
      ...caseDetailsJson,
    };
    const req = mockRequestWithTranslation({}, translations);
    req.session.user = mockUserDetails;
    const apps: GenericTseApplicationTypeItem[] = [
      {
        id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.CHANGE_PERSONAL_DETAILS.claimant,
          dueDate: '10 February 2025',
        },
      },
    ];

    it('should return notification when other party submit application', () => {
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(1);
      expect(result.appSubmitNotifications[0].from).toEqual('claimant');
      expect(result.appSubmitNotifications[0].fromName).toEqual('');
      expect(result.appSubmitNotifications[0].appName).toEqual('change my personal details');
      expect(result.appSubmitNotifications[0].isTypeB).toEqual(true);
      expect(result.appSubmitNotifications[0].dueDate).toEqual(new Date('10 February 2025'));
      expect(result.appSubmitNotifications[0].appUrl).toEqual(
        '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en'
      );
    });

    it('should return notification when user responded the application', () => {
      apps[0].value.respondCollection = [];
      apps[0].value.respondCollection.push({
        id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
        value: {
          from: Applicant.RESPONDENT,
          fromIdamId: '1234',
        },
      });
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return notification when tribunal require user response', () => {
      apps[0].value.respondCollection.push({
        id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
        value: {
          from: Applicant.ADMIN,
          isResponseRequired: YesOrNo.YES,
          selectPartyRespond: PartiesRespond.RESPONDENT,
        },
      });
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(1);
      expect(result.appSubmitNotifications).toHaveLength(0);
      expect(result.appRequestNotifications[0].from).toEqual("the claimant's");
      expect(result.appRequestNotifications[0].appName).toEqual('change my personal details');
      expect(result.appRequestNotifications[0].appUrl).toEqual(
        '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en'
      );
    });

    it('should return notification when user responded to tribunal', () => {
      apps[0].value.respondCollection.push({
        id: 'd8a57e44-2e9c-4e25-9853-6c2a312a3e6f',
        value: {
          from: Applicant.RESPONDENT,
          fromIdamId: '1234',
        },
      });
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return empty array when no applications are provided', () => {
      const result = getAppNotifications([], req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return empty array when applications parameter is undefined', () => {
      const result = getAppNotifications(undefined, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });
  });
});
