import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { ApplicationTableRecord, CaseState } from '../../../main/definitions/definition';

export const mockApplications: ApplicationTableRecord[] = [
  {
    userCase: {
      id: '12345',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      personalDetailsCheck: YesOrNo.YES,
      employmentAndRespondentCheck: YesOrNo.YES,
      claimDetailsCheck: YesOrNo.YES,
      ethosCaseReference: '1000000/2024',
      firstName: 'Test',
      lastName: 'Tester',
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      responseReceivedDate: '01/01/2024',
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
        {
          respondentName: 'Mega Globo Corp',
        },
      ],
      typeOfClaimString: 'discrimination',
    },
    respondents: 'Globo Corp<br />Mega Globo Corp',
    completionStatus: undefined,
    url: '/case-details/12345?lng=en',
  },
  {
    userCase: {
      id: '123456',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      typeOfClaimString: 'discrimination',
    },
    respondents: 'undefined',
    completionStatus: undefined,
    url: '/case-details/123456?lng=en',
  },
  {
    userCase: {
      id: '1234567',
      state: CaseState.SUBMITTED,
      typeOfClaim: ['discrimination'],
      createdDate: 'September 1, 2022',
      lastModified: 'September 1, 2022',
      ethosCaseReference: '654321/2022',
      respondents: [
        {
          respondentName: 'Globo Corp',
        },
      ],
      et1SubmittedForm: {
        id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673',
        description: 'Test',
        type: 'ET1',
      },
      typeOfClaimString: 'discrimination',
    },
    respondents: 'Globo Corp',
    completionStatus: undefined,
    url: PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + '/1234567?lng=en',
  },
];
