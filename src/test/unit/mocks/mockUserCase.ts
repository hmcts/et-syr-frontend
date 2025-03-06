import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { CaseState } from '../../../main/definitions/definition';

export default {
  id: '1',
  state: CaseState.SUBMITTED,
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  respondents: undefined,
  et1OnlineSubmission: 'Yes',
  hubLinksStatuses: {},
  caseSource: undefined,
  claimantRepresentedQuestion: 'No',
  contactApplicationType: 'Change personal details',
  copyToOtherPartyYesOrNo: YesOrNo.YES,
  ruleCopyState: undefined,
  representativeClaimantType: {
    myHmctsOrganisation: {
      organisationID: undefined,
      organisationName: undefined,
    },
  },
} as CaseWithId;
