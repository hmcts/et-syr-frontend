import { CaseWithId } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';

export default {
  id: '1',
  state: CaseState.SUBMITTED,
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  respondents: undefined,
  et1OnlineSubmission: 'submitted Et1 Form',
  hubLinksStatuses: {},
  caseSource: undefined,
  claimantRepresentedQuestion: 'No',
  representativeClaimantType: {
    myHmctsOrganisation: {
      organisationID: undefined,
      organisationName: undefined,
    },
  },
} as CaseWithId;
