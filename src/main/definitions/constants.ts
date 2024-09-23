import {
  postcode_Bristol,
  postcode_Glasgow,
  postcode_Leeds,
  postcode_LondonCentral,
  postcode_LondonEast,
  postcode_LondonSouth,
  postcode_Manchester,
  postcode_MidlandsEast,
  postcode_Newcastle,
} from './postcode';

export const LegacyUrls = {
  ET1: 'https://et-pet-et1.aat.platform.hmcts.net/en/apply/application-number',
  ET1_BASE: 'https://et-pet-et1.aat.platform.hmcts.net',
  ET1_APPLY: '/apply',
  ET1_PATH: '/application-number',
  ACAS_EC_URL: 'https://www.acas.org.uk/early-conciliation',
} as const;

export const TranslationKeys = {
  COMMON: 'common',
  WELSH_ENABLED: 'welsh-language',
  HOME: 'home',
  INTERRUPTION_CARD: 'interruption-card',
  COOKIE_PREFERENCES: 'cookie-preferences',
  RESPONDENT_APPLICATION_DETAILS: 'respondent-application-details',
  CASE_DETAILS_WITH_CASE_ID_PARAMETER: 'case-details',
  RESPONDENT_RESPONSE_LANDING: 'respondent-response-landing',
  RESPONDENT_RESPONSE_TASK_LIST: 'respondent-response-task-list',
  RESPONDENT_NAME: 'respondent-name',
  TYPE_OF_ORGANISATION: 'type-of-organisation',
  RESPONDENT_ADDRESS: 'respondent-address',
  RESPONDENT_ENTER_POST_CODE: 'respondent-enter-postcode',
  RESPONDENT_SELECT_POST_CODE: 'respondent-select-postcode',
  RESPONDENT_ENTER_ADDRESS: 'respondent-enter-address',
  RESPONDENT_PREFERRED_CONTACT_NAME: 'respondent-preferred-contact-name',
  RESPONDENT_DX_ADDRESS: 'respondent-dx-address',
  RESPONDENT_CONTACT_PHONE_NUMBER: 'respondent-contact-phone-number',
  RESPONDENT_CONTACT_PREFERENCES: 'respondent-contact-preferences',
  CONTACT_DETAILS_CYA: 'contact-details-check-your-answers',
  HEARING_PREFERENCES: 'hearing-preferences',
  REASONABLE_ADJUSTMENTS: 'reasonable-adjustments',
  YOUR_APPLICATIONS: 'your-applications',
  SIDEBAR_CONTACT_US: 'sidebar-contact-us',
  SELF_ASSIGNMENT_FORM: 'self-assignment-form',
  SELF_ASSIGNMENT_CHECK: 'self-assignment-check',
  CASE_LIST: 'case-list',
} as const;

export const PageUrls = {
  NOT_IMPLEMENTED: '#',
  HOME: '/',
  INTERRUPTION_CARD: '/interruption-card',
  SELF_ASSIGNMENT_FORM: '/self-assignment-form',
  CASE_LIST_CHECK: '/case-list-check',
  SELF_ASSIGNMENT_CHECK: '/self-assignment-check',
  CASE_LIST: '/case-list',
  CASE_DETAILS_WITH_CASE_ID_PARAMETER: '/case-details/:caseId',
  CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER: '/case-details',
  COOKIE_PREFERENCES: '/cookies',
  RESPONDENT_RESPONSE_LANDING: '/respondent-response-landing',
  RESPONDENT_RESPONSE_TASK_LIST: '/respondent-response-task-list',
  RESPONDENT_NAME: '/respondent-name',
  TYPE_OF_ORGANISATION: '/type-of-organisation',
  RESPONDENT_ADDRESS: '/respondent-address',
  RESPONDENT_ENTER_POST_CODE: '/respondent-enter-postcode',
  RESPONDENT_SELECT_POST_CODE: '/respondent-select-postcode',
  RESPONDENT_ENTER_ADDRESS: '/respondent-enter-address',
  RESPONDENT_PREFERRED_CONTACT_NAME: '/respondent-preferred-contact-name',
  RESPONDENT_DX_ADDRESS: '/respondent-dx-address',
  RESPONDENT_CONTACT_PHONE_NUMBER: '/respondent-contact-phone-number',
  RESPONDENT_CONTACT_PREFERENCES: '/respondent-contact-preferences',
  CONTACT_DETAILS_CYA: '/contact-details-check-your-answers',
  HEARING_PREFERENCES: '/hearing-preferences',
  REASONABLE_ADJUSTMENTS: '/reasonable-adjustments',
  NEW_SELF_ASSIGNMENT_REQUEST: '/new-self-assignment-request',
} as const;

export const InterceptPaths = {
  CHANGE_DETAILS: '*/change',
  ANSWERS_CHANGE: '/change?redirect=answers',
  RESPONDENT_CHANGE: '/change?redirect=respondent',
  SUBMIT_CASE: '/submitDraftCase',
  REMOVE_FILE: '/remove-uploaded-file',
  SUBMIT_TRIBUNAL_CYA: '/submitTribunalCya',
  SUBMIT_RESPONDENT_CYA: '/submitRespondentCya',
  TRIBUNAL_RESPONSE_SUBMIT_CYA: '/tribunalResponseSubmitCya',
  STORE_TRIBUNAL_CYA: '/storeTribunalCya',
  TRIBUNAL_RESPONSE_STORE_CYA: '/tribunalResponseStoreCya',
  STORE_RESPONDENT_CYA: '/storeRespondentCya',
  SUBMIT_BUNDLES_HEARING_DOCS_CYA: '/submitBundlesHearingDocsCya',
} as const;

export const ErrorPages = {
  NOT_FOUND: '/not-found/:errId',
};

export const ValidationErrors = {
  REQUIRED: 'required',
  INVALID_VALUE: 'invalid',
  API: 'api',
} as const;

export const AuthUrls = {
  CALLBACK: '/oauth2/callback',
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;

export const JavaApiUrls = {
  FIND_CASE_FOR_ROLE_MODIFICATION: '/manageCaseRole/findCaseForRoleModification',
  ASSIGN_CASE_USER_ROLES: '/manageCaseRole/modifyCaseUserRoles?modificationType=Assignment',
  DOWNLOAD_CLAIM_PDF: '/generate-pdf',
  UPLOAD_FILE: '/documents/upload/',
  DOCUMENT_DOWNLOAD: '/document/download/',
  DOCUMENT_DETAILS: '/document/details/',
  GET_CASES: 'cases/user-cases',
  GET_CASE: 'cases/user-case',
  GET_CASE_BY_IDS: '/getCaseData',
  INITIATE_CASE_DRAFT: 'cases/initiate-case',
  UPDATE_CASE_DRAFT: 'cases/update-case',
  SUBMIT_CASE: 'cases/submit-case',
  UPDATE_CASE_SUBMITTED: 'cases/update-hub-links-statuses',
  RESPOND_TO_APPLICATION: 'cases/respond-to-application',
  CHANGE_APPLICATION_STATUS: 'cases/change-application-status',
  SUBMIT_CLAIMANT_APPLICATION: 'cases/submit-claimant-application',
  STORE_CLAIMANT_APPLICATION: 'store/store-claimant-application',
  STORE_RESPOND_TO_APPLICATION: 'store/store-respond-to-application',
  SUBMIT_STORED_CLAIMANT_APPLICATION: 'store/submit-stored-claimant-application',
  SUBMIT_STORED_RESPOND_TO_APPLICATION: 'store/submit-stored-respond-to-application',
  TRIBUNAL_RESPONSE_VIEWED: 'cases/tribunal-response-viewed',
  ADD_RESPONSE_TO_SEND_NOTIFICATION: '/sendNotification/add-response-send-notification',
  UPDATE_NOTIFICATION_STATE: '/sendNotification/update-notification-state',
  STORE_RESPOND_TO_TRIBUNAL: 'store/store-respond-to-tribunal',
  SUBMIT_STORED_RESPOND_TO_TRIBUNAL: 'store/submit-stored-respond-to-tribunal',
  UPDATE_ADMIN_DECISION_STATE: '/tseAdmin/update-admin-decision-state',
  SUBMIT_BUNDLES: 'bundles/submit-bundles',
  ROLE_PARAM_NAME: 'case_user_role',
} as const;

export const Roles = {
  DEFENDANT_ROLE_WITH_BRACKETS: '[DEFENDANT]',
  DEFENDANT_ROLE_WITHOUT_BRACKETS: 'DEFENDANT',
} as const;

export const Urls = {
  HOME: '/',
  INFO: '/info',
  DOWNLOAD_CLAIM: '/download-claim',
  PCQ: '/pcq',
  EXTEND_SESSION: '/extend-session',
} as const;

export const HTTPS_PROTOCOL = 'https://';

export const ALLOWED_FILE_FORMATS = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'dot',
  'jpg',
  'jpeg',
  'bmp',
  'tif',
  'tiff',
  'png',
  'pdf',
  'xls',
  'xlt',
  'xla',
  'xlsx',
  'xltx',
  'ppt',
  'pot',
  'pps',
  'ppa',
  'pptx',
  'potx',
  'ppsx',
  'rtf',
  'csv',
];

export const RedisErrors = {
  REDIS_ERROR: 'redisError',
  DISPLAY_MESSAGE: 'Please try again or return later.',
  FAILED_TO_CONNECT: 'Error when attempting to connect to Redis',
  FAILED_TO_SAVE: 'Error when attempting to save to Redis',
  FAILED_TO_RETRIEVE: 'Error when attempting to retrieve value from Redis',
  FAILED_TO_RETRIEVE_PRE_LOGIN_URL: 'Error when attempting to retrieve preLoginUrl from Redis',
  CLIENT_NOT_FOUND: 'Redis client does not exist',
} as const;

export const CaseApiErrors = {
  FAILED_TO_RETRIEVE_CASE: 'Error when attempting to retrieve draft case from sya-api',
} as const;

export const CcdDataModel = {
  CASE_SOURCE: 'ET1 Online',
} as const;

export const EXISTING_USER = 'existingUser';
export const LOCAL_REDIS_SERVER = '127.0.0.1';
export const CITIZEN_ROLE = 'citizen';
export const TYPE_OF_CLAIMANT = 'Individual';
export const FILE_SIZE_LIMIT = 83886500;

export const inScopeLocations = [].concat(
  postcode_Glasgow,
  postcode_Leeds,
  postcode_Bristol,
  postcode_MidlandsEast,
  postcode_LondonCentral,
  postcode_LondonEast,
  postcode_LondonSouth,
  postcode_Manchester,
  postcode_Newcastle
);

export const ET3_FORM = 'ET3';

export const et1DocTypes = ['ET1'];
export const acceptanceDocTypes = ['1.1', 'Acknowledgement of Claim'];
export const rejectionDocTypes = ['Rejection of claim'];
export const responseAcceptedDocTypes = ['2.11', 'Letter 14'];
export const responseRejectedDocTypes = ['2.12', '2.13', '2.14', '2.15', 'Letter 10', 'Letter 11'];
export const et3FormDocTypes = [ET3_FORM];
export const et3AttachmentDocTypes = ['ET3 Attachment'];

export const CHANGE = 'Change';

export const languages = {
  WELSH: 'cy',
  ENGLISH: 'en',
  WELSH_LOCALE: '&ui_locales=cy',
  ENGLISH_LOCALE: '&ui_locales=en',
  WELSH_URL_PARAMETER: '?lng=cy',
  ENGLISH_URL_PARAMETER: '?lng=en',
};

export const Rule92Types = {
  CONTACT: 'Contact',
  RESPOND: 'Respond',
  TRIBUNAL: 'Tribunal',
} as const;

export const Parties = {
  BOTH_PARTIES: 'Both parties',
  CLAIMANT_ONLY: 'Claimant only',
  RESPONDENT_ONLY: 'Respondent only',
} as const;

export const ResponseRequired = {
  YES: 'Yes - view document for details',
  NO: 'No',
} as const;

export const Applicant = {
  CLAIMANT: 'Claimant',
  RESPONDENT: 'Respondent',
  ADMIN: 'Admin',
} as const;

export const AllDocumentTypes = {
  CLAIMANT_CORRESPONDENCE: 'Claimant correspondence',
  ACAS_CERT: 'ACAS Certificate',
  RESPONDENT_CORRESPONDENCE: 'Respondent correspondence',
  TRIBUNAL_CORRESPONDENCE: 'Tribunal correspondence',
  CLAIMANT_HEARING_DOCUMENT: 'Claimant Hearing Document',
  RESPONDENT_HEARING_DOCUMENT: 'Respondent Hearing Document',
} as const;

export type AllDocumentTypeValue = (typeof AllDocumentTypes)[keyof typeof AllDocumentTypes];

export const NotificationSubjects = {
  GENERAL_CORRESPONDENCE: 'Other (General correspondence)',
  ORDER_OR_REQUEST: 'Case management orders / requests',
  ECC: 'Employer Contract Claim',
} as const;

export const NoticeOfECC = 'Notice of Employer Contract Claim';

export const DOCUMENT_CONTENT_TYPES = {
  DOCX: ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  XLSX: ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  PPTX: ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  DOC: ['doc', 'application/vnd.ms-word'],
  XLS: ['xls', 'application/vnd.ms-excel'],
  PPT: ['ppt', 'application/vnd.ms-powerpoint'],
  CSV: ['csv', 'text/csv'],
  GZ: ['gz', 'application/gzip'],
  GIF: ['gif', 'image/gif'],
  JPEG: ['jpeg', 'image/jpeg'],
  JPG: ['jpg', 'image/jpeg'],
  MP3: ['mp3', 'audio/mpeg'],
  MP4: ['mp4', 'video/mp4'],
  MPEG: ['mpeg', 'video/mpeg'],
  PNG: ['png', 'image/png'],
  PDF: ['pdf', 'application/pdf'],
  TAR: ['tar', 'application/x-tar'],
  TXT: ['txt', 'text/plain'],
  WAV: ['wav', 'audio/wav'],
  WEBA: ['weba', 'audio/webm'],
  WEBM: ['webm', 'video/webm'],
  WEBP: ['webp', 'image/webp'],
  ZIP: ['zip', 'application/zip'],
  _3GP: ['3gp', 'video/3gpp'],
  _3G2: ['3g2', 'video/3gpp2'],
  _7Z: ['7z', 'application/x-7z-compressed'],
  DOT: ['dot', 'application/msword'],
  BMP: ['bmp', 'image/bmp'],
  TIF: ['tif', 'image/tiff'],
  TIFF: ['tiff', 'image/tiff'],
  XLT: ['xlt', 'application/vnd.ms-excel'],
  XLA: ['xla', 'application/vnd.ms-excel'],
  XLTX: ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
  XLSB: ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
  POT: ['pot', 'application/mspowerpoint'],
  PPS: ['pps', 'application/vnd.ms-powerpoint'],
  PPA: ['ppa', 'application/vnd.ms-powerpoint'],
  POTX: ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
  PPSX: ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
  RTF: ['rtf', 'application/rtf'],
  RTX: ['rtx', 'application/rtf'],
};

export const YES = 'Yes';
export const NO = 'No';

export const TseStatus = {
  OPEN_STATE: 'Open',
  CLOSED_STATE: 'Closed',
  STORED_STATE: 'Stored',
} as const;

export const ResponseStatus = {
  STORED_STATE: 'Stored',
} as const;

export const FEATURE_FLAGS = {
  WELSH: 'welsh-language',
  BUNDLES: 'bundles',
  ECC: 'ecc',
  MUL2: 'MUL2',
} as const;

export const SessionErrors = {
  ERROR_DESTROYING_SESSION: 'Error destroying session',
  ERROR_FAILED_TO_RETRIEVE_USER_CASE_FROM_REQUEST_SESSION: 'User case not found in the request session',
  ERROR_NAME_DATA_NOT_FOUND: 'Data not found in the session',
} as const;

export const GenericTestConstants = {
  TRUE: true,
  FALSE: false,
} as const;

export const AuthorisationTestConstants = {
  AUTHORISATION_URL_CONFIGURATION_NAME: 'services.idam.authorizationURL',
  GUID: '4e3cac74-d8cf-4de9-ad20-cf6248ba99aa',
  URL_LOCALHOST: 'http://localhost',
  AXIOS_MODULE_NAME: 'axios',
  RAW_CODE: '123',
  GENERIC_USER_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwiZ2l2ZW5fbmFtZSI6IkpvaG4iLCJmYW1pbHlfbmFtZSI6IkRvcmlhbiIsInVpZCI6IjEyMyJ9.KaDIFSDdD3ZIYCl_qavvYbQ3a4abk47iBOZhB1-9mUQ',
  GENERIC_USER_EMAIL: 'test@test.com',
  GENERIC_USER_GIVEN_NAME: 'John',
  GENERIC_USER_FAMILY_NAME: 'Dorian',
  GENERIC_USER_ID: '123',
  CITIZEN_USER_TOKEN:
    'eyJ0eXAiOiJKV1QiLCJraWQiOiIxZXIwV1J3Z0lPVEFGb2pFNHJDL2ZiZUt1M0k9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiajIyZzNtZ1BEUkpIMDRDU0laTnBJZyIsInN1YiI6ImNpdGl6ZW4tdXNlckB0ZXN0LmNvLnVrIiwiYXVkaXRUcmFja2luZ0lkIjoiZjM0ZTZjOWMtZmRmYi00NDRmLWFjNjYtZWQxZmQ2NjAxZWIzLTQ2MjU0MDEwIiwicm9sZXMiOlsiY2l0aXplbiIsImNhc2V3b3JrZXItZW1wbG95bWVudC1hcGkiLCJjYXNld29ya2VyLWVtcGxveW1lbnQiLCJjYXNld29ya2VyLWVtcGxveW1lbnQtZW5nbGFuZHdhbGVzIiwiY2FzZXdvcmtlciJdLCJpc3MiOiJodHRwczovL2Zvcmdlcm9jay1hbS5zZXJ2aWNlLmNvcmUtY29tcHV0ZS1pZGFtLWFhdDIuaW50ZXJuYWw6ODQ0My9vcGVuYW0vb2F1dGgyL3JlYWxtcy9yb290L3JlYWxtcy9obWN0cyIsInRva2VuTmFtZSI6ImlkX3Rva2VuIiwiZ2l2ZW5fbmFtZSI6IkNpdGl6ZW4iLCJhdWQiOiJobWN0cyIsInVpZCI6ImE0Mzk2YjEwLTY5MjgtNDcxMS1hM2JhLTg5ZmNmNmFkYjc3OSIsImF6cCI6ImhtY3RzIiwiYXV0aF90aW1lIjoxNjUzNDkyMzkzLCJuYW1lIjoiQ2l0aXplbiBUZXN0ZXIiLCJyZWFsbSI6Ii9obWN0cyIsImV4cCI6MTY1MzQ5NTk5MywidG9rZW5UeXBlIjoiSldUVG9rZW4iLCJpYXQiOjE2NTM0OTIzOTMsImZhbWlseV9uYW1lIjoiVGVzdGVyIn0.KTfxz0oMqSqwRkcPczZISwp5hOP_RLcopqu9mOIdARg1TiZhzEnueo8_ppSrzb6YZRLmhO65K-hsqjBX1gE_oSN_975i5mfE3gBd1B_vCvEtS3YFLc_ReLiSTRW9Y0AelPzKOMqW2E0yFU_1IdCBrq3-rtQK2e1sAD8vVOIRF9ooih9mi3vUnD6kevDj099u_aE7qy_ueClt37CWhQ1achOxb11EeVYjv4K48TG1TxiBtIJx2H2b5lZayQuAPd8Jn4SEXXLCvhbt5K61L7NFZh0UiNfRjySwfIPX9MIovUPsGvnK4zJ6a4fqJU0SIl6v5wN5WMXp0u1YUzx7fzIoww',
  CITIZEN_USER_EMAIL: 'citizen-user@test.co.uk',
  CITIZEN_USER_GIVEN_NAME: 'Citizen',
  CITIZEN_USER_FAMILY_NAME: 'Tester',
  CITIZEN_USER_ID: 'a4396b10-6928-4711-a3ba-89fcf6adb779',
} as const;

export const CallbackTestConstants = {
  REDIS_ERROR: 'redisError',
} as const;

export const DefaultValues = {
  STRING_EMPTY: '',
  STRING_DASH: '-',
  STRING_QUESTION_MARK: '?',
  STRING_EQUALS: '=',
  STRING_SPACE: ' ',
} as const;

export const FormFieldNames = {
  GENERIC_FORM_FIELDS: {
    HIDDEN_ERROR_FIELD: 'hiddenErrorField',
  },
  SELF_ASSIGNMENT_FORM_FIELDS: {
    CASE_REFERENCE_ID: 'caseReferenceId',
    RESPONDENT_NAME: 'respondentName',
    CLAIMANT_FIRST_NAME: 'claimantFirstName',
    CLAIMANT_LAST_NAME: 'claimantLastName',
  },
  SELF_ASSIGNMENT_CHECK_FIELDS: {
    SELF_ASSIGNMENT_CHECK: 'selfAssignmentCheck',
  },
} as const;

export const ServiceErrors = {
  ERROR_UPDATING_DRAFT_CASE: 'Error updating draft case: ',
  ERROR_CASE_NOT_FOUND: 'Case Not Found',
  ERROR_UPDATING_HUB_LINKS_STATUSES: 'Error updating hub links statuses: ',
  ERROR_GETTING_USER_CASE: 'Error getting user case: ',
  ERROR_GETTING_USER_CASES: 'Error getting user cases: ',
  ERROR_ASSIGNING_USER_ROLE: 'Error assigning user role: ',
  ERROR_DUMMY_DATA: 'Dummy data error',
} as const;

export const CacheErrors = {
  ERROR_HOST_NOT_FOUND_FOR_PRE_LOGIN_URL: 'Host not found for pre login url',
  ERROR_PORT_NOT_FOUND_FOR_PRE_LOGIN_URL: 'Port not found for pre login url',
  ERROR_URL_NOT_FOUND_FOR_PRE_LOGIN_URL: 'Url not found for pre login url',
} as const;

export const LoggingConstants = {
  INFO_LOG_RETRIEVING_CASES: 'Retrieving cases for',
  INFO_LOG_USER_ID_NOT_EXISTS: 'undefined user id',
} as const;
