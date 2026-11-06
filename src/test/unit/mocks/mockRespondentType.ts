import { RespondentType } from '../../../main/definitions/complexTypes/respondent';
import { ET3CaseDetailsLinksStatuses } from '../../../main/definitions/links';

import mockRespondentType from './mockRespondentType.json';
import mockRespondentTypeWithoutCheckedFields from './mockRespondentTypeWithoutCheckedFields.json';

const withCurrentLinkStatuses = (respondentType: RespondentType): RespondentType => ({
  ...respondentType,
  et3CaseDetailsLinksStatuses: new ET3CaseDetailsLinksStatuses(),
  et3HubLinksStatuses: undefined,
});

export const mockedRespondentType: RespondentType = withCurrentLinkStatuses(
  mockRespondentType as unknown as RespondentType
);
export const mockedRespondentTypeWithoutCheckedFields: RespondentType = {
  ...withCurrentLinkStatuses(mockRespondentTypeWithoutCheckedFields as unknown as RespondentType),
  et3ResponseEmploymentStartDate: undefined,
  et3ResponseEmploymentEndDate: undefined,
};
