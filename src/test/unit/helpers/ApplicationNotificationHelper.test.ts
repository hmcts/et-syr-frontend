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
    const req = mockRequestWithTranslation(
      {
        userCase: {
          respondents: [
            {
              idamId: 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78',
              respondentName: 'Respondent Name',
            },
          ],
        },
      },
      translations
    );
    req.session.user = mockUserDetails;

    it('should return notification when claimant submit application', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
          },
        },
      ];
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
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
            respondCollection: [
              {
                id: '4a2e6d81-b6a7-4f6e-a4f1-dc1eb96e87c2',
                value: {
                  from: Applicant.RESPONDENT,
                  fromIdamId: '1234',
                },
              },
            ],
          },
        },
      ];
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return notification when tribunal require response for claimant application', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
            respondCollection: [
              {
                id: '4a2e6d81-b6a7-4f6e-a4f1-dc1eb96e87c2',
                value: {
                  from: Applicant.RESPONDENT,
                  fromIdamId: '1234',
                },
              },
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
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.CLAIMANT,
            type: application.CHANGE_PERSONAL_DETAILS.claimant,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                },
              },
              {
                id: 'd8a57e44-2e9c-4e25-9853-6c2a312a3e6f',
                value: {
                  from: Applicant.RESPONDENT,
                  fromIdamId: '1234',
                },
              },
            ],
          },
        },
      ];
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return notification when other respondent submit application', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78',
            type: application.AMEND_RESPONSE.code,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
          },
        },
      ];
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(1);
      expect(result.appSubmitNotifications[0].from).toEqual('respondent');
      expect(result.appSubmitNotifications[0].fromName).toEqual('Respondent Name');
      expect(result.appSubmitNotifications[0].appName).toEqual('amend my response');
      expect(result.appSubmitNotifications[0].isTypeB).toEqual(false);
      expect(result.appSubmitNotifications[0].dueDate).toEqual(new Date('10 February 2025'));
      expect(result.appSubmitNotifications[0].appUrl).toEqual(
        '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en'
      );
    });

    it('should return notification when tribunal require response for respondent application', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: 'e19d3c2b-75de-47b5-9f79-0a4c37e57e78',
            type: application.AMEND_RESPONSE.code,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            dueDate: '10 February 2025',
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.BOTH_PARTIES,
                },
              },
            ],
          },
        },
      ];
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(1);
      expect(result.appSubmitNotifications).toHaveLength(0);
      expect(result.appRequestNotifications[0].from).toEqual("the respondent's");
      expect(result.appRequestNotifications[0].appName).toEqual('amend my response');
      expect(result.appRequestNotifications[0].appUrl).toEqual(
        '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en'
      );
    });

    it('should return notification when tribunal require response for user application', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: '1234',
            type: application.ORDER_WITNESS_ATTEND.code,
            dueDate: '10 February 2025',
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
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(1);
      expect(result.appSubmitNotifications).toHaveLength(0);
      expect(result.appRequestNotifications[0].from).toEqual('your');
      expect(result.appRequestNotifications[0].appName).toEqual('order a witness to attend');
      expect(result.appRequestNotifications[0].appUrl).toEqual(
        '/application-details/3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7?lng=en'
      );
    });

    it('should return notification when tribunal require response for type C', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '3f2b8b62-7b36-4f29-a3c3-89e2c1a4b6f7',
          value: {
            applicant: Applicant.RESPONDENT,
            type: application.ORDER_WITNESS_ATTEND.code,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
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
      const result = getAppNotifications(apps, req);
      expect(result.appRequestNotifications).toHaveLength(0);
      expect(result.appSubmitNotifications).toHaveLength(0);
    });

    it('should return empty array when no applications are provided', () => {
      const apps: GenericTseApplicationTypeItem[] = [];
      const result = getAppNotifications(apps, req);
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
