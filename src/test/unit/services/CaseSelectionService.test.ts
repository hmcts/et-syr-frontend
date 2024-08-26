import axios, { AxiosResponse } from 'axios';

import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseType, CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { ServiceErrors } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import {
  getRedirectUrl,
  getUserApplications,
  getUserCasesByLastModified,
} from '../../../main/services/CaseSelectionService';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockApplications } from '../mocks/mockApplications';
import { mockAxiosError } from '../mocks/mockAxios';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockEnglishClaimTypesTranslations } from '../mocks/mockTranslations';

jest.mock('axios');
const getCaseApiClientMock = jest.spyOn(caseService, 'getCaseApi');

describe('Get redirect url tests', () => {
  const userCase = mockValidCaseWithId;
  const languageParam = '?lng=en';
  it('Should return claimant application link when user case state is awaiting submission to HMCTS', async () => {
    userCase.state = CaseState.AWAITING_SUBMISSION_TO_HMCTS;
    expect(getRedirectUrl(userCase, languageParam)).toEqual('/claimant-application/1234567890123456?lng=en');
  });
  it('Should return response hub link when user case state is not awaiting submission to HMCTS', async () => {
    userCase.state = CaseState.ACCEPTED;
    expect(getRedirectUrl(userCase, languageParam)).toEqual('/response-hub/1234567890123456?lng=en');
  });
});

describe('Get user cases by last modified date tests', () => {
  const req = mockRequest({});
  const mockApiClient = {
    createCase: jest.fn(),
    getUserCases: jest.fn(),
    downloadClaimPdf: jest.fn(),
    updateDraftCase: jest.fn(),
    getUserCase: jest.fn(),
  };

  afterEach(() => {
    mockApiClient.getUserCases.mockClear();
    mockApiClient.createCase.mockClear();
    mockApiClient.downloadClaimPdf.mockClear();
    mockApiClient.updateDraftCase.mockClear();
    mockApiClient.getUserCase.mockClear();
  });

  it('Should Return user cases by last modified date', async () => {
    const response: AxiosResponse<CaseApiDataResponse[]> = {
      data: [
        {
          id: '12234',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-12T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
        {
          id: '122345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          last_modified: '2019-02-13T14:25:39.015',
          created_date: '2019-02-12T14:25:39.015',
          case_data: {
            caseType: CaseType.SINGLE,
            typesOfClaim: ['discrimination', 'payRelated'],
            claimantRepresentedQuestion: YesOrNo.YES,
            caseSource: 'ET1 Online',
          },
        },
      ],
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);
    mockApiClient.getUserCases.mockResolvedValue(response);
    const userCases = await getUserCasesByLastModified(req);
    expect(userCases).toHaveLength(2);
    expect(userCases[0].lastModified).toStrictEqual('13 February 2019');
    expect(userCases[1].lastModified).toStrictEqual('12 February 2019');
  });

  it('Should return empty array', async () => {
    const response: AxiosResponse<CaseApiDataResponse[]> = {
      data: [],
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    };
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    getCaseApiClientMock.mockReturnValue(caseApi);
    caseApi.getUserCases = jest.fn().mockResolvedValue(response);
    const result = await getUserCasesByLastModified(req);
    expect(result).toStrictEqual([]);
  });

  test('Should throw axios error', async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
    });
    const api = new CaseApi(mockedAxios);
    getCaseApiClientMock.mockReturnValue(api);
    await expect(getUserCasesByLastModified(req)).rejects.toEqual(
      new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
    );
  });
});

describe('Get User applications', () => {
  it('should retrieve user cases and return in desired format', () => {
    const userCases: CaseWithId[] = [
      {
        id: '12345',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        personalDetailsCheck: YesOrNo.YES,
        employmentAndRespondentCheck: YesOrNo.YES,
        claimDetailsCheck: YesOrNo.YES,
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        typeOfClaim: ['discrimination'],
        respondents: [
          {
            respondentName: 'Globo Corp',
          },
          {
            respondentName: 'Mega Globo Corp',
          },
        ],
      },
      {
        id: '123456',
        state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
        typeOfClaim: ['discrimination'],
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
      },
      {
        id: '1234567',
        state: CaseState.SUBMITTED,
        createdDate: 'September 1, 2022',
        lastModified: 'September 1, 2022',
        typeOfClaim: ['discrimination'],
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
      },
    ];
    const result = getUserApplications(userCases, mockEnglishClaimTypesTranslations, '?lng=en');
    expect(result).toStrictEqual(mockApplications);
  });
});
