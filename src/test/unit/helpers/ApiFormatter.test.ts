import _ from 'lodash';

import {
  CaseApiDataResponse,
  DocumentApiModel,
  HearingBundleType,
} from '../../../main/definitions/api/caseApiResponse';
import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { UserDetails } from '../../../main/definitions/appRequest';
import { CaseDataCacheKey, CaseWithId, EmailOrPost, EnglishOrWelsh, YesOrNo } from '../../../main/definitions/case';
import { acceptanceDocTypes } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { TypeItem } from '../../../main/definitions/util-types';
import {
  formatApiCaseDataToCaseWithId,
  formatDate,
  fromApiFormatDocument,
  getDocId,
  getDueDate,
  getFileExtension,
  isOtherTitle,
  isValidPreferredTitle,
  mapBundlesDocs,
  parseDateFromString,
  returnPreferredTitle,
  setDocumentValues,
  toApiFormat,
  toApiFormatCreate,
} from '../../../main/helpers/ApiFormatter';
import * as ApiFormatter from '../../../main/helpers/ApiFormatter';
import {
  caseItem,
  mockEt1DataModel,
  mockEt1DataModelUpdate,
  mockEt1DataModelUpdateResponseTriageQuestions,
  mockEt1DataModelUpdateWithTriageQuestions,
} from '../mocks/mockEt1DataModel';
import mockUserCaseComplete from '../mocks/mockUserCaseComplete';
import { mockedApiData } from '../mocks/mockedApiData';

describe('Should return data in api format', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should transform triage and Idam credentials to api format', () => {
    const userDataMap: Map<CaseDataCacheKey, string> = new Map<CaseDataCacheKey, string>([
      [CaseDataCacheKey.POSTCODE, 'SW1A 1AA'],
      [CaseDataCacheKey.CLAIMANT_REPRESENTED, 'Yes'],
      [CaseDataCacheKey.CASE_TYPE, 'Single'],
      [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify(['discrimination', 'payRelated'])],
      [CaseDataCacheKey.OTHER_CLAIM_TYPE, 'other claim description'],
      [CaseDataCacheKey.ACAS_MULTIPLE, 'Yes'],
      [CaseDataCacheKey.VALID_NO_ACAS_REASON, 'Reason'],
    ]);

    const mockUserDetails: UserDetails = {
      id: '1234',
      givenName: 'Bobby',
      familyName: 'Ryan',
      email: 'bobby@gmail.com',
      accessToken: 'xxxx',
      isCitizen: true,
    };
    const apiData = toApiFormatCreate(userDataMap, mockUserDetails);
    expect(apiData).toEqual(mockEt1DataModel);
  });

  it('should transform case data to api format', () => {
    const apiData = toApiFormat(caseItem);
    expect(apiData).toEqual(mockEt1DataModelUpdate);
  });
  it('should transform case data to api format with triage questions', () => {
    const mockET1DataModelWithTriageQuestions = _.cloneDeep(mockEt1DataModelUpdateWithTriageQuestions);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line import/namespace
    ApiFormatter.getUpdateCaseBody = jest.fn().mockReturnValueOnce(mockET1DataModelWithTriageQuestions);
    const apiData = ApiFormatter.toApiFormat(caseItem);
    expect(apiData).toEqual(mockEt1DataModelUpdateResponseTriageQuestions);
    jest.clearAllMocks();
  });
});

describe('Format document model', () => {
  it('should format DocumentApiResponse', () => {
    const mockDocData: DocumentUploadResponse = {
      originalDocumentName: 'testname',
      uri: 'test.com',
      _links: {
        self: {
          href: 'test.com',
        },
        binary: {
          href: 'test.com',
        },
      },
      classification: '',
      size: '16000000',
      mimeType: 'test',
      hashToken: '',
      createdOn: '',
      createdBy: '',
      lastModifiedBy: '',
      modifiedOn: '',
      ttl: '',
      metadata: {
        case_type_id: '',
        jurisdiction: '',
      },
    };
    const result = fromApiFormatDocument(mockDocData);
    expect(result).toStrictEqual({
      document_filename: 'testname',
      document_url: 'test.com',
      document_binary_url: 'test.com',
      document_mime_type: 'testname',
      document_size: 16000000,
    });
  });
});

describe('Format Case Data to Frontend Model', () => {
  it('should format Case Api Response`', () => {
    const result = formatApiCaseDataToCaseWithId(mockedApiData);
    expect(result).toEqual(mockUserCaseComplete);
  });

  it('should format Case Api Response with no applications`', () => {
    const mock = mockedApiData;
    mock.case_data.genericTseApplicationCollection = [];
    const complete = mockUserCaseComplete;
    complete.genericTseApplicationCollection = [];

    const result = formatApiCaseDataToCaseWithId(mock);

    expect(complete).toEqual(result);
  });

  it('should return undefined for empty field`', () => {
    const mockedApiDataEmpty: CaseApiDataResponse = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      created_date: '2022-08-19T09:19:25.817549',
      last_modified: '2022-08-19T09:19:25.817549',
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
      },
    };
    const result = formatApiCaseDataToCaseWithId(mockedApiDataEmpty);
    expect(result).toStrictEqual({
      id: '1234',
      ccdId: '1234',
      feeGroupReference: undefined,
      ethosCaseReference: undefined,
      createdDate: '19 August 2022',
      lastModified: '19 August 2022',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: undefined,
      typeOfClaim: undefined,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      ClaimantPcqId: undefined,
      dobDate: undefined,
      claimantSex: undefined,
      preferredTitle: undefined,
      email: undefined,
      address1: undefined,
      address2: undefined,
      addressEnterPostcode: undefined,
      addressPostcode: undefined,
      addressCountry: undefined,
      addressTown: undefined,
      telNumber: undefined,
      firstName: undefined,
      genericTseApplicationCollection: undefined,
      tseApplicationStoredCollection: undefined,
      lastName: undefined,
      claimantPensionContribution: undefined,
      claimantPensionWeeklyContribution: undefined,
      employeeBenefits: undefined,
      endDate: undefined,
      newJob: undefined,
      newJobPay: undefined,
      newJobPayInterval: undefined,
      newJobStartDate: undefined,
      avgWeeklyHrs: undefined,
      jobTitle: undefined,
      noticePeriod: undefined,
      noticePeriodLength: undefined,
      noticePeriodUnit: undefined,
      payAfterTax: undefined,
      payBeforeTax: undefined,
      payInterval: undefined,
      startDate: undefined,
      benefitsCharCount: undefined,
      isStillWorking: undefined,
      pastEmployer: undefined,
      personalDetailsCheck: undefined,
      reasonableAdjustments: undefined,
      reasonableAdjustmentsDetail: undefined,
      noticeEnds: undefined,
      hearingPreferences: undefined,
      hearingAssistance: undefined,
      claimantContactPreference: undefined,
      claimantContactLanguagePreference: undefined,
      claimantHearingLanguagePreference: undefined,
      employmentAndRespondentCheck: undefined,
      claimDetailsCheck: undefined,
      claimSummaryText: undefined,
      claimTypeDiscrimination: undefined,
      claimTypePay: undefined,
      tellUsWhatYouWant: undefined,
      tribunalRecommendationRequest: undefined,
      compensationAmount: undefined,
      compensationOutcome: undefined,
      whistleblowingClaim: undefined,
      whistleblowingEntityName: undefined,
      linkedCases: undefined,
      linkedCasesDetail: undefined,
      respondents: undefined,
      claimantWorkAddressQuestion: undefined,
      workAddress1: undefined,
      workAddress2: undefined,
      workAddressTown: undefined,
      workAddressCountry: undefined,
      workEnterPostcode: undefined,
      workAddressPostcode: undefined,
      et3ResponseReceived: false,
      claimSummaryFile: undefined,
      submittedDate: undefined,
      hubLinksStatuses: undefined,
      managingOffice: undefined,
      et1SubmittedForm: undefined,
      tribunalCorrespondenceEmail: undefined,
      tribunalCorrespondenceTelephone: undefined,
      acknowledgementOfClaimLetterDetail: undefined,
      respondentResponseDeadline: undefined,
      rejectionOfClaimDocumentDetail: undefined,
      responseAcknowledgementDocumentDetail: undefined,
      responseRejectionDocumentDetail: undefined,
      responseEt3FormDocumentDetail: [],
      otherClaim: undefined,
      sendNotificationCollection: undefined,
      hearingCollection: undefined,
      documentCollection: undefined,
      representatives: undefined,
      bundleDocuments: [],
      multipleFlag: undefined,
      leadClaimant: undefined,
      caseStayed: undefined,
      preAcceptCase: undefined,
    });
  });

  it('should return document collection for welsh`', () => {
    const mockedApiDataWelsh: CaseApiDataResponse = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      created_date: '2022-08-19T09:19:25.817549',
      last_modified: '2022-08-19T09:19:25.817549',
      case_data: {
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantType: {
          claimant_email_address: 'janedoe@exmaple.com',
          claimant_contact_preference: EmailOrPost.EMAIL,
        },
        claimantHearingPreference: {
          contact_language: EnglishOrWelsh.WELSH,
          hearing_language: EnglishOrWelsh.WELSH,
        },
        documentCollection: [
          {
            id: 'f78aa088-c223-4ca5-8e0a-42e7c33dffa5',
            value: {
              typeOfDocument: 'ET1',
              uploadedDocument: {
                document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
                document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
                document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
              },
              shortDescription: 'Case Details - Sunday Ayeni',
            },
          },
          {
            id: '3db71007-d42c-43d5-a51b-57957f78ced3',
            value: {
              typeOfDocument: 'ET1',
              uploadedDocument: {
                document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
                document_filename: 'ET1_WELSH_Sunday_Ayeni_R600227_21_75.pdf',
                document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
              },
              shortDescription: 'ET1 WELSH - R600227/21/75',
            },
          },
        ],
      },
    };
    const result = formatApiCaseDataToCaseWithId(mockedApiDataWelsh);
    expect(result).toEqual({
      ccdId: '1234',
      feeGroupReference: undefined,
      ethosCaseReference: undefined,
      createdDate: '19 August 2022',
      lastModified: '19 August 2022',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      caseType: undefined,
      typeOfClaim: undefined,
      caseTypeId: undefined,
      claimantRepresentedQuestion: YesOrNo.YES,
      ClaimantPcqId: undefined,
      dobDate: undefined,
      claimantSex: undefined,
      preferredTitle: undefined,
      email: 'janedoe@exmaple.com',
      et1SubmittedForm: {
        description: 'ET1 WELSH - R600227/21/75',
        id: '10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
        type: 'ET1',
      },
      address1: undefined,
      address2: undefined,
      addressPostcode: undefined,
      addressCountry: undefined,
      addressTown: undefined,
      telNumber: undefined,
      firstName: undefined,
      lastName: undefined,
      claimantPensionContribution: undefined,
      claimantPensionWeeklyContribution: undefined,
      employeeBenefits: undefined,
      endDate: undefined,
      newJob: undefined,
      newJobPay: undefined,
      newJobPayInterval: undefined,
      newJobStartDate: undefined,
      avgWeeklyHrs: undefined,
      jobTitle: undefined,
      noticePeriod: undefined,
      noticePeriodLength: undefined,
      noticePeriodUnit: undefined,
      payAfterTax: undefined,
      payBeforeTax: undefined,
      payInterval: undefined,
      startDate: undefined,
      benefitsCharCount: undefined,
      isStillWorking: undefined,
      pastEmployer: undefined,
      personalDetailsCheck: undefined,
      reasonableAdjustments: undefined,
      reasonableAdjustmentsDetail: undefined,
      noticeEnds: undefined,
      hearingPreferences: undefined,
      hearingAssistance: undefined,
      claimantContactPreference: 'Email',
      claimantContactLanguagePreference: 'Welsh',
      claimantHearingLanguagePreference: 'Welsh',
      employmentAndRespondentCheck: undefined,
      claimDetailsCheck: undefined,
      claimSummaryText: undefined,
      claimTypeDiscrimination: undefined,
      claimTypePay: undefined,
      tellUsWhatYouWant: undefined,
      tribunalRecommendationRequest: undefined,
      compensationAmount: undefined,
      compensationOutcome: undefined,
      whistleblowingClaim: undefined,
      whistleblowingEntityName: undefined,
      linkedCases: undefined,
      linkedCasesDetail: undefined,
      respondents: undefined,
      claimantWorkAddressQuestion: undefined,
      workAddress1: undefined,
      workAddress2: undefined,
      workAddressTown: undefined,
      workAddressCountry: undefined,
      workAddressPostcode: undefined,
      et3ResponseReceived: false,
      claimSummaryFile: undefined,
      submittedDate: undefined,
      hubLinksStatuses: undefined,
      managingOffice: undefined,
      tribunalCorrespondenceEmail: undefined,
      tribunalCorrespondenceTelephone: undefined,
      acknowledgementOfClaimLetterDetail: undefined,
      respondentResponseDeadline: undefined,
      rejectionOfClaimDocumentDetail: undefined,
      responseAcknowledgementDocumentDetail: undefined,
      responseRejectionDocumentDetail: undefined,
      responseEt3FormDocumentDetail: [],
      otherClaim: undefined,
      sendNotificationCollection: undefined,
      genericTseApplicationCollection: undefined,
      tseApplicationStoredCollection: undefined,
      bundleDocuments: [],
      documentCollection: [
        {
          id: 'f78aa088-c223-4ca5-8e0a-42e7c33dffa5',
          value: {
            typeOfDocument: 'ET1',
            uploadedDocument: {
              document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
              document_filename: 'ET1_CASE_DOCUMENT_Sunday_Ayeni.pdf',
              document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
            },
            shortDescription: 'Case Details - Sunday Ayeni',
          },
        },
        {
          id: '3db71007-d42c-43d5-a51b-57957f78ced3',
          value: {
            typeOfDocument: 'ET1',

            uploadedDocument: {
              document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
              document_filename: 'ET1_WELSH_Sunday_Ayeni_R600227_21_75.pdf',
              document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
            },
            shortDescription: 'ET1 WELSH - R600227/21/75',
          },
        },
      ],
      id: '1234',
    });
  });

  it('date formatter should return null when date is empty', () => {
    const caseItemTest: CaseWithId = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: { day: '', month: '', year: '' },
      startDate: { day: '', month: '', year: '' },
      noticeEnds: { day: '', month: '', year: '' },
      createdDate: '19 August 2022',
      lastModified: '19 August 2022',
    };
    const returnedET1DataModel = _.cloneDeep(mockEt1DataModel);
    returnedET1DataModel.case_data.claimantIndType = {
      claimant_first_names: '',
      claimant_last_name: '',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line import/namespace
    ApiFormatter.getUpdateCaseBody = jest.fn().mockReturnValueOnce(returnedET1DataModel);
    const apiData = ApiFormatter.toApiFormat(caseItemTest);
    expect(apiData?.case_data?.claimantIndType?.claimant_date_of_birth).toEqual(undefined);
    expect(apiData?.case_data?.claimantOtherType?.claimant_employed_from).toEqual(undefined);
    expect(apiData?.case_data?.claimantOtherType?.claimant_employed_notice_period).toEqual(undefined);
  });
});

describe('formatDate()', () => {
  it.each([
    { date: { day: '30', month: '10', year: '2000' }, expected: '2000-10-30' },
    { date: { day: '5', month: '10', year: '2000' }, expected: '2000-10-05' },
    { date: { day: '30', month: '4', year: '2000' }, expected: '2000-04-30' },
    { date: { day: '5', month: '4', year: '2000' }, expected: '2000-04-05' },
    { date: { day: '05', month: '04', year: '2000' }, expected: '2000-04-05' },
    { date: { day: '', month: '', year: '' }, expected: null },
    { date: undefined, expected: null },
  ])('Correct formatting of date to string: %o', ({ date, expected }) => {
    expect(formatDate(date)).toBe(expected);
  });
});

describe('isValidPreferredTitle()', () => {
  it.each([
    { title: 'Mr', expected: 'Mr' },
    { title: 'mr', expected: 'Mr' },
    { title: 'mR', expected: 'Mr' },
    { title: 'Ms', expected: 'Ms' },
    { title: 'Miss', expected: 'Miss' },
    { title: 'Mrs', expected: 'Mrs' },
    { title: 'Missus', expected: 'Other' },
    { title: 'Captain', expected: 'Other' },
    { title: '', expected: undefined },
    { title: undefined, expected: undefined },
  ])('Correctly retuns valid preferred title: %o', ({ title, expected }) => {
    expect(isValidPreferredTitle(title)).toBe(expected);
  });
});

describe('isOtherTitle()', () => {
  it.each([
    { title: 'Mr', expected: undefined },
    { title: 'mr', expected: undefined },
    { title: 'mR', expected: undefined },
    { title: 'Ms', expected: undefined },
    { title: 'Miss', expected: undefined },
    { title: 'Mrs', expected: undefined },
    { title: 'Missus', expected: 'Missus' },
    { title: 'Captain', expected: 'Captain' },
    { title: '', expected: undefined },
    { title: undefined, expected: undefined },
  ])('Correctly retuns valid other title: %o', ({ title, expected }) => {
    expect(isOtherTitle(title)).toBe(expected);
  });
});

describe('returnPreferredTitle()', () => {
  it.each([
    { preferredTitle: 'Mr', otherTitle: undefined, expected: 'Mr' },
    { preferredTitle: 'Ms', otherTitle: undefined, expected: 'Ms' },
    { preferredTitle: 'Other', otherTitle: 'Sir', expected: 'Sir' },
    { preferredTitle: undefined, otherTitle: 'Doctor', expected: 'Doctor' },
    { preferredTitle: undefined, otherTitle: undefined, expected: undefined },
  ])('Returns the correct title: %o', ({ preferredTitle, otherTitle, expected }) => {
    expect(returnPreferredTitle(preferredTitle, otherTitle)).toBe(expected);
  });
});

describe('parseDateFromString()', () => {
  it.each([
    { date: '2000-10-30', expected: { day: '30', month: '10', year: '2000' } },
    { date: '2000-10-05', expected: { day: '05', month: '10', year: '2000' } },
    { date: '2000-04-30', expected: { day: '30', month: '04', year: '2000' } },
    { date: '2000-04-05', expected: { day: '05', month: '04', year: '2000' } },
    { date: null, expected: undefined },
  ])('Correct parsing of date from string: %o', ({ date, expected }) => {
    expect(parseDateFromString(date)).toStrictEqual(expected);
  });
});

const servingDocCollection = [
  {
    id: '10',
    value: {
      typeOfDocument: '1.1',
      shortDescription: 'text',
      uploadedDocument: {
        document_url: 'http://address/documents/abc123',
        document_filename: 'sample.pdf',
        document_binary_url: 'http://address/documents/abc123/binary',
      },
    },
  },
  {
    id: '11',
    value: {
      typeOfDocument: '1.1',
      shortDescription: 'a sentence',
      uploadedDocument: {
        document_url: 'http://address/documents/xyz123',
        document_filename: 'letter.png',
        document_binary_url: 'http://address/documents/xyz123/binary',
      },
    },
  },
];

describe('set Serving Document Values()', () => {
  it('should retrieve serving Document id, type and description from ccd response', () => {
    const servingDocumentCollection = servingDocCollection;

    const expected = [
      { id: 'abc123', description: 'text', type: '1.1' },
      { id: 'xyz123', description: 'a sentence', type: '1.1' },
    ];

    const result = setDocumentValues(servingDocumentCollection, acceptanceDocTypes);
    expect(result).toEqual(expected);
  });

  it('should retrieve serving Document id, type and description for ET3 and no description', () => {
    const servingDocumentCollection = servingDocCollection;

    const expected = [
      { id: 'abc123', description: '', type: 'et3Supporting' },
      { id: 'xyz123', description: '', type: 'et3Supporting' },
    ];

    const result = setDocumentValues(servingDocumentCollection, undefined, true);
    expect(result).toEqual(expected);
  });

  it('should return undefined when there are no serving documents', () => {
    const servingDocumentCollection: DocumentApiModel[] = [];

    const result = setDocumentValues(servingDocumentCollection, acceptanceDocTypes);
    expect(result).toEqual(undefined);
  });

  it('should get the document id correctly from the url', () => {
    expect(getDocId('http://address/documents/abc123')).toBe('abc123');
  });

  it('should get the file extension from file name', () => {
    expect(getFileExtension('test1.doc')).toBe('doc');
    expect(getFileExtension('test1.doc.doc.pdf')).toBe('pdf');
    expect(getFileExtension(undefined)).toBe('');
  });
});

describe('testDeadlineCalculatingAndFormatting', () => {
  it.each([
    { mockRef: '', expected: undefined },
    { mockRef: 'aa', expected: undefined },
    { mockRef: '2022-09-15T08:48:58.613343', expected: '13 October 2022' },
  ])('convert claim served date to respondent deadline', ({ mockRef, expected }) => {
    expect(getDueDate(mockRef, 28)).toEqual(expected);
  });
});

const mockBundlesClaimantCollection: TypeItem<HearingBundleType>[] = [
  {
    id: '123',
    value: {
      hearing: '1',
      uploadFile: {
        document_url: 'http://documenturl',
        document_filename: 'AdditionalInfo.pdf',
        document_binary_url: 'http://documenturl/binary',
      },
      agreedDocWith: 'We have agreed but there are some disputed documents',
      whatDocuments: 'Supplementary or other documents',
      uploadDateTime: '21 November 2023 at 10:24',
      whoseDocuments: 'Both parties’ hearing documents combined',
      agreedDocWithBut: 'We did not agree on some things',
      formattedSelectedHearing: 'Hearing - Barnstaple - 16 May 2069',
    },
  },
];
describe('mapBundlesDocs', () => {
  it('should map bundles documents', () => {
    const bundlesClaimantCollection = mockBundlesClaimantCollection;
    const expected = [
      {
        id: '',
        value: {
          shortDescription: 'Hearing - Barnstaple - 16 May 2069',
          uploadedDocument: {
            document_url: 'http://documenturl',
            document_filename: 'AdditionalInfo.pdf',
            document_binary_url: 'http://documenturl/binary',
          },
          typeOfDocument: 'Claimant Hearing Document',
          creationDate: '',
        },
      },
    ];

    const result = mapBundlesDocs(bundlesClaimantCollection, 'Claimant Hearing Document');
    expect(result).toEqual(expected);
  });

  it('should return undefined when no bundles', () => {
    const bundlesClaimantCollection: TypeItem<HearingBundleType>[] = undefined;

    const result = mapBundlesDocs(bundlesClaimantCollection, 'Claimant Hearing Document');
    expect(result).toEqual(undefined);
  });
});
