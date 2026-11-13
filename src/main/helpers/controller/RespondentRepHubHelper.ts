import { ET3CaseDetailsLinkNames } from '../../definitions/links';

export const CaseOverviewSectionIndexForRep: ET3CaseDetailsLinkNames[][] = [
  [ET3CaseDetailsLinkNames.PersonalDetails],
  [ET3CaseDetailsLinkNames.ET1ClaimForm, ET3CaseDetailsLinkNames.ClaimantContactDetails],
  [ET3CaseDetailsLinkNames.RespondentResponse, ET3CaseDetailsLinkNames.RespondentContactDetails],
  [ET3CaseDetailsLinkNames.HearingDetails],
  [
    ET3CaseDetailsLinkNames.YourRequestsAndApplications,
    ET3CaseDetailsLinkNames.ClaimantApplications,
    ET3CaseDetailsLinkNames.OtherRespondentApplications,
    ET3CaseDetailsLinkNames.ContactTribunal,
  ],
  [ET3CaseDetailsLinkNames.TribunalNotification],
  [ET3CaseDetailsLinkNames.TribunalJudgements],
  [ET3CaseDetailsLinkNames.Documents],
];
