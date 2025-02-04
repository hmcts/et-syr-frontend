import { Applicant } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../../../main/definitions/links';
import { getApplicationCollection } from '../../../../main/helpers/controller/YourRequestAndApplicationsHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

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
