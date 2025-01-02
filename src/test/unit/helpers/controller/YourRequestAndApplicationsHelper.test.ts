import { Applicant } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../../../main/definitions/links';
import { getApplicationCollection } from '../../../../main/helpers/controller/YourRequestAndApplicationsHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import mockUserCase from '../../mocks/mockUserCase';

describe('getApplicationCollection', () => {
  const userCase = mockUserCase;
  const reqUrl = '/url';
  const translations = {
    ...applicationTypeJson,
    ...caseDetailsStatusJson,
  };

  it('should return filtered and formatted claimant items', () => {
    userCase.genericTseApplicationCollection = [
      {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          type: application.CHANGE_PERSONAL_DETAILS.code,
          status: LinkStatus.IN_PROGRESS,
        },
      },
      {
        id: '2',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.AMEND_RESPONSE.code,
          status: LinkStatus.WAITING_FOR_TRIBUNAL,
        },
      },
    ];

    const expectedOutput = [
      {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          type: application.CHANGE_PERSONAL_DETAILS.code,
          status: 'inProgress',
        },
        linkValue: 'Change my personal details',
        redirectUrl: '/application-details/1?lng=en',
        statusColor: linkStatusColorMap.get(LinkStatus.IN_PROGRESS),
        displayStatus: 'In progress',
      },
    ];

    const result = getApplicationCollection(userCase, reqUrl, translations);

    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array if no Respondent application exist', () => {
    userCase.genericTseApplicationCollection = [
      {
        id: '1',
        value: {
          applicant: Applicant.CLAIMANT,
          type: application.AMEND_RESPONSE.code,
          status: LinkStatus.IN_PROGRESS,
        },
      },
    ];

    const result = getApplicationCollection(userCase, reqUrl, translations);

    expect(result).toEqual([]);
  });
});
