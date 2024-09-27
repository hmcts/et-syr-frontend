import { CaseWithId } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant, NotificationSubjects, PageUrls, languages } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../definitions/links';

export const userCaseContainsGeneralCorrespondence = (notifications: SendNotificationTypeItem[]): boolean => {
  return notifications?.some(it =>
    it.value.sendNotificationSubject.includes(NotificationSubjects.GENERAL_CORRESPONDENCE)
  );
};

export enum StatusesInOrderOfUrgency {
  notStartedYet = 0,
  notViewedYet = 1,
  updated = 2,
  inProgress = 3,
  viewed = 4,
  waitingForTheTribunal = 5,
  stored = 6,
}

export const shouldCaseDetailsLinkBeClickable = (status: LinkStatus): boolean => {
  return status !== LinkStatus.NOT_YET_AVAILABLE;
};

export const shouldHubLinkBeClickable = (status: HubLinkStatus, linkName: string): boolean => {
  if (status === HubLinkStatus.NOT_YET_AVAILABLE) {
    return false;
  }

  return !(
    status === HubLinkStatus.WAITING_FOR_TRIBUNAL &&
    linkName !== HubLinkNames.RespondentApplications &&
    linkName !== HubLinkNames.RequestsAndApplications
  );
};

export const getAllClaimantApplications = (userCase: CaseWithId): GenericTseApplicationTypeItem[] => {
  return userCase.genericTseApplicationCollection?.filter(item => item.value.applicant === Applicant.CLAIMANT);
};

export const getClaimantAppsAndUpdateStatusTag = (userCase: CaseWithId): void => {
  const allClaimantApplications = getAllClaimantApplications(userCase);

  if (allClaimantApplications?.length) {
    updateYourApplicationsStatusTag(allClaimantApplications, userCase);
  }
};

export const updateYourApplicationsStatusTag = (
  allClaimantApplications: GenericTseApplicationTypeItem[],
  userCase: CaseWithId
): void => {
  // Filter apps with 'waiting for tribunal' status as these may have a different citizen hub status
  const claimantAppsWaitingForTribunal = allClaimantApplications.filter(
    it => it.value.applicationState === HubLinkStatus.WAITING_FOR_TRIBUNAL
  );

  let citizenHubHighestPriorityStatus: HubLinkStatus | undefined;

  claimantAppsWaitingForTribunal.forEach(claimantApp => {
    const respondCollection = claimantApp.value?.respondCollection;
    // Only apps with 2 or more responses are eligible to have a different citizen hub status
    if (!respondCollection || respondCollection.length <= 1) {
      return;
    }

    const lastItem = respondCollection[respondCollection.length - 1];
    const secondLastItem = respondCollection[respondCollection.length - 2];
    const isAdmin = secondLastItem.value.from === Applicant.ADMIN;
    // If claimant responds to tribunal request, hub link status set to 'In progress'
    // Only set if it is not already set to 'Updated', as 'Updated' is the higher priority status
    if (
      lastItem.value.from === Applicant.CLAIMANT &&
      isAdmin &&
      citizenHubHighestPriorityStatus !== HubLinkStatus.UPDATED
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.IN_PROGRESS;
      return;
    }
    // If respondent responds to tribunal respondent request, hub link status set to 'Updated'
    if (
      lastItem.value.from === Applicant.RESPONDENT &&
      isAdmin &&
      secondLastItem.value.selectPartyRespond === Applicant.RESPONDENT
    ) {
      citizenHubHighestPriorityStatus = HubLinkStatus.UPDATED;
    }
  });
  // citizenHubHigherPriorityStatus has now been set to either 'In progress' or 'Updated'
  // and is added to the applications priority check to display the highest priority citizen hub status
  const mostUrgentStatus = Math.min(
    ...allClaimantApplications
      .map(o => {
        const applicationState = o.value.applicationState as keyof typeof StatusesInOrderOfUrgency;
        const citizenHubStatus = citizenHubHighestPriorityStatus as keyof typeof StatusesInOrderOfUrgency;

        const citizenHubStatusPriority =
          citizenHubStatus !== undefined ? StatusesInOrderOfUrgency[citizenHubStatus] : undefined;
        const applicationStatePriority = StatusesInOrderOfUrgency[applicationState];

        return [citizenHubStatusPriority, applicationStatePriority].filter(item => item !== undefined);
      })
      .flat()
  );

  userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = StatusesInOrderOfUrgency[
    mostUrgentStatus
  ] as HubLinkStatus;
};

const baseUrls = {
  [languages.ENGLISH_URL_PARAMETER]: '',
  [languages.WELSH_URL_PARAMETER]: languages.WELSH_URL_PARAMETER,
};

export const getET3HubLinksUrlMap = (languageParam: string): Map<string, string> => {
  return new Map<string, string>([
    [ET3HubLinkNames.ContactDetails, PageUrls.RESPONDENT_NAME + baseUrls[languageParam]],
    [ET3HubLinkNames.EmployerDetails, PageUrls.HEARING_PREFERENCES + baseUrls[languageParam]],
    [
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + baseUrls[languageParam],
    ],
    [ET3HubLinkNames.PayPensionBenefitDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3HubLinkNames.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM + baseUrls[languageParam]],
    [ET3HubLinkNames.CheckYorAnswers, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
  ]);
};

export const getET3CaseDetailsLinksUrlMap = (languageParam: string): Map<string, string> => {
  return new Map<string, string>([
    [ET3CaseDetailsLinkNames.PersonalDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.ET1ClaimForm, PageUrls.CLAIMANT_ET1_FORM + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.HearingDetails, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.RespondentRequestsAndApplications, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [
      ET3CaseDetailsLinkNames.ContactTribunal,
      PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER + baseUrls[languageParam],
    ],
    [ET3CaseDetailsLinkNames.TribunalJudgements, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
    [ET3CaseDetailsLinkNames.Documents, PageUrls.NOT_IMPLEMENTED + baseUrls[languageParam]],
  ]);
};
