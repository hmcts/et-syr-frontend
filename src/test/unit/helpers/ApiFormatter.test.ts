import _ from 'lodash';

import { CreateCaseBody, UpdateCaseBody } from '../../../main/definitions/api/caseApiBody';
import {
  CaseApiDataResponse,
  DocumentApiModel,
  HearingBundleType,
} from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, Document, EmailOrPost, EnglishOrWelsh, YesOrNo } from '../../../main/definitions/case';
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
import {
  ApiFormatterFormatApiCaseDataToCaseWithId_ExpectedEmptyCaseWithIdMock,
  ApiFormatterFromApiFormatDocument_DocumentUploadResponseMock,
  ApiFormatterFromApiFormatDocument_ExpectedDocumentMock,
  ApiFormatterToApiFormatCreate_CreateCaseBodyMock,
  ApiFormatterToApiFormatCreate_UserDataMapMock,
  ApiFormatterToApiFormatCreate_UserDetailsMock,
  ApiFormatter_CaseApiDataResponseMock,
  ApiFormatter_GenericCaseItemMock,
  ApiFormatter_UpdateCaseBodyMock,
} from '../mocks/mockApiFormatterTestModels';

describe('toApiFormatCreate', () => {
  it('should transform triage and Idam credentials to api format', () => {
    const apiData: CreateCaseBody = toApiFormatCreate(
      ApiFormatterToApiFormatCreate_UserDataMapMock,
      ApiFormatterToApiFormatCreate_UserDetailsMock
    );
    expect(apiData).toEqual(ApiFormatterToApiFormatCreate_CreateCaseBodyMock);
  });
});

describe('formatApiCaseDataToCaseWithId', () => {
  it('should return undefined when from api case data is undefined`', () => {
    const result: CaseWithId = formatApiCaseDataToCaseWithId(undefined);
    expect(result).toEqual(undefined);
  });
  it('should format Case Api Response`', () => {
    const caseApiDataResponse: CaseApiDataResponse = _.cloneDeep(ApiFormatter_CaseApiDataResponseMock);
    const result: CaseWithId = formatApiCaseDataToCaseWithId(caseApiDataResponse);
    expect(result).toEqual(ApiFormatter_GenericCaseItemMock);
  });
  it('should format Case Api Response`when case data is empty', () => {
    const caseApiDataResponse: CaseApiDataResponse = _.cloneDeep(ApiFormatter_CaseApiDataResponseMock);
    caseApiDataResponse.case_data = undefined;
    const result: CaseWithId = formatApiCaseDataToCaseWithId(caseApiDataResponse);
    expect(result).toEqual(ApiFormatterFormatApiCaseDataToCaseWithId_ExpectedEmptyCaseWithIdMock);
  });
});

describe('toApiFormat', () => {
  it('should transform case data to api format', () => {
    const apiData: UpdateCaseBody = toApiFormat(ApiFormatter_GenericCaseItemMock);
    const expectedResponse: UpdateCaseBody = _.cloneDeep(ApiFormatter_UpdateCaseBodyMock);
    expectedResponse.case_data.claimantIndType.claimant_date_of_birth = '2022-10-05';
    expectedResponse.case_data.claimantIndType.claimant_first_names = 'Jane';
    expectedResponse.case_data.claimantRequests.other_claim = 'other type of claims';
    expectedResponse.case_data.claimantType.claimant_email_address = 'janedoe@exmaple.com';
    expectedResponse.case_data.newEmploymentType.newly_employed_from = '2010-05-12';
    expect(apiData).toEqual(expectedResponse);
  });
  it('should format Case Api Response with no applications`', () => {
    const mock: CaseApiDataResponse = ApiFormatter_CaseApiDataResponseMock;
    mock.case_data.genericTseApplicationCollection = [];
    const complete = ApiFormatter_GenericCaseItemMock;
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
    const caseItem: CaseWithId = {
      id: '1234',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      dobDate: { day: '', month: '', year: '' },
      startDate: { day: '', month: '', year: '' },
      noticeEnds: { day: '', month: '', year: '' },
      createdDate: '19 August 2022',
      lastModified: '19 August 2022',
    };
    const apiData = toApiFormat(caseItem);
    expect(apiData.case_data.claimantIndType.claimant_date_of_birth).toEqual(null);
    expect(apiData.case_data.claimantOtherType.claimant_employed_from).toEqual(null);
    expect(apiData.case_data.claimantOtherType.claimant_employed_notice_period).toEqual(null);
  });
});

describe('fromApiFormatDocument', () => {
  it('should format DocumentApiResponse', () => {
    const result: Document = fromApiFormatDocument(ApiFormatterFromApiFormatDocument_DocumentUploadResponseMock);
    expect(result).toStrictEqual(ApiFormatterFromApiFormatDocument_ExpectedDocumentMock);
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
