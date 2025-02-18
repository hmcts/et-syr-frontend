import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import { getApplicationRequestFromAdmin } from '../../../main/helpers/AdminNotificationHelper';
import applicationTypeJson from '../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsJson from '../../../main/resources/locales/en/translation/case-details.json';
import { mockRequestWithTranslation } from '../mocks/mockRequest';

describe('getApplicationRequestFromAdmin', () => {
  const translations = {
    ...applicationTypeJson,
    ...caseDetailsJson,
  };
  const req = mockRequestWithTranslation({}, translations);

  it('should return notification banner when input valid', () => {
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
                selectPartyRespond: Parties.RESPONDENT_ONLY,
              },
            },
          ],
          respondentResponseRequired: YesOrNo.YES,
        },
      },
    ];
    const result = getApplicationRequestFromAdmin(apps, req);
    expect(result).toHaveLength(1);
    expect(result[0].appName).toEqual('change personal details');
    expect(result[0].from).toEqual('your');
    expect(result[0].appUrl).toEqual('/application-details/fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c?lng=en');
  });

  it('should return multiple notifications for multiple responses', () => {
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
                selectPartyRespond: Parties.RESPONDENT_ONLY,
              },
            },
          ],
          respondentResponseRequired: YesOrNo.YES,
        },
      },
      {
        id: '6b5fb921-0522-4700-b81f-d391ac9b6ec4',
        value: {
          type: application.POSTPONE_HEARING.code,
          respondCollection: [
            {
              id: '3d01849d-c586-4f43-8d2b-8c6432827dec',
              value: {
                from: Applicant.ADMIN,
                isResponseRequired: YesOrNo.YES,
                selectPartyRespond: Parties.BOTH_PARTIES,
              },
            },
          ],
          respondentResponseRequired: YesOrNo.YES,
        },
      },
    ];
    const result = getApplicationRequestFromAdmin(apps, req);
    expect(result).toHaveLength(2);
    expect(result[0].appName).toEqual('change personal details');
    expect(result[1].appName).toEqual('postpone a hearing');
  });

  it('should return empty array when applications have no respondCollection', () => {
    const apps: GenericTseApplicationTypeItem[] = [
      {
        id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
        value: {
          type: application.CHANGE_PERSONAL_DETAILS.code,
        },
      },
    ];
    const result = getApplicationRequestFromAdmin(apps, req);
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
                selectPartyRespond: Parties.CLAIMANT_ONLY,
              },
            },
          ],
          respondentResponseRequired: YesOrNo.NO,
        },
      },
    ];
    const result = getApplicationRequestFromAdmin(apps, req);
    expect(result).toHaveLength(0);
  });

  it('should return an empty array when applications is empty', () => {
    const apps: GenericTseApplicationTypeItem[] = [];
    const result = getApplicationRequestFromAdmin(apps, req);
    expect(result).toHaveLength(0);
  });

  it('should return empty array when applications is undefined', () => {
    const result = getApplicationRequestFromAdmin(undefined, req);
    expect(result).toHaveLength(0);
  });
});
