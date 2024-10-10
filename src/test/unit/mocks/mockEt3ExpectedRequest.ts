import { mockEt3RespondentType } from './mockEt3Respondent';

export const ET3ExpectedRequest = {
  CASE_ID: '1234567890123456',
  REQUEST_TYPE: 'update',
  CASE_TYPE: 'ET_EnglandWales',
  CASE_DETAILS_LINKS_SECTION_ID: 'respondentResponse',
  CASE_DETAILS_LINKS_SECTION_STATUS: 'inProgress',
  RESPONSE_HUB_LINK_SECTION_ID: 'contactDetails',
  RESPONSE_HUB_LINK_SECTION_STATUS: 'inProgress',
  RESPONDENT: mockEt3RespondentType,
};
