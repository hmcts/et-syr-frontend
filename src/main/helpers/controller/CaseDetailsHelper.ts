import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../definitions/links';

export const addNewET3CaseDetailsLinkNames = (
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses
): ET3CaseDetailsLinksStatuses => {
  if (!(ET3CaseDetailsLinkNames.OtherRespondentApplications in et3CaseDetailsLinksStatuses)) {
    et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.OtherRespondentApplications] = LinkStatus.NOT_YET_AVAILABLE;
  }
  return et3CaseDetailsLinksStatuses;
};
