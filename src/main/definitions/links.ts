//**************** ET3 CASE DETAILS LINKS CONSTANTS ****************//
//******************************************************************//
export enum ET3CaseDetailsLinkNames {
  PersonalDetails = 'personalDetails',
  ET1ClaimForm = 'et1ClaimForm',
  ClaimantContactDetails = 'claimantContactDetails',
  RespondentResponse = 'respondentResponse',
  HearingDetails = 'hearingDetails',
  YourRequestsAndApplications = 'respondentRequestsAndApplications',
  ClaimantApplications = 'claimantApplications',
  OtherRespondentApplications = 'otherRespondentApplications',
  ContactTribunal = 'contactTribunal',
  TribunalNotification = 'tribunalOrders',
  TribunalJudgements = 'tribunalJudgements',
  Documents = 'documents',
}

export class ET3CaseDetailsLinksStatuses {
  [linkName: string]: LinkStatus;

  constructor() {
    Object.values(ET3CaseDetailsLinkNames).forEach(name => {
      if (name === ET3CaseDetailsLinkNames.PersonalDetails) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.ET1ClaimForm) {
        this[name] = LinkStatus.NOT_VIEWED;
      } else if (name === ET3CaseDetailsLinkNames.ClaimantContactDetails) {
        this[name] = LinkStatus.READY_TO_VIEW;
      } else if (name === ET3CaseDetailsLinkNames.RespondentResponse) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3CaseDetailsLinkNames.HearingDetails) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.YourRequestsAndApplications) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.ClaimantApplications) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.OtherRespondentApplications) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.ContactTribunal) {
        this[name] = LinkStatus.OPTIONAL;
      } else if (name === ET3CaseDetailsLinkNames.TribunalNotification) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.TribunalJudgements) {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      } else if (name === ET3CaseDetailsLinkNames.Documents) {
        this[name] = LinkStatus.OPTIONAL;
      } else {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      }
    });
  }
}

export const SectionIndexToEt3CaseDetailsLinkNames: ET3CaseDetailsLinkNames[][] = [
  [ET3CaseDetailsLinkNames.PersonalDetails],
  [ET3CaseDetailsLinkNames.ET1ClaimForm, ET3CaseDetailsLinkNames.ClaimantContactDetails],
  [ET3CaseDetailsLinkNames.RespondentResponse],
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
//*************************************************************************//
//**************** END OF ET3 CASE DETAILS LINKS CONSTANTS ****************//
//*************************************************************************//

//*************************************************************************//
//************************ ET3 HUB LINKS CONSTANTS ************************//
//*************************************************************************//

export enum ET3HubLinkNames {
  ContactDetails = 'contactDetails',
  EmployerDetails = 'employerDetails',
  ConciliationAndEmployeeDetails = 'conciliationAndEmployeeDetails',
  PayPensionBenefitDetails = 'payPensionBenefitDetails',
  ContestClaim = 'contestClaim',
  EmployersContractClaim = 'employersContractClaim',
  CheckYorAnswers = 'checkYorAnswers',
}

export class ET3HubLinksStatuses {
  [linkName: string]: LinkStatus;

  constructor() {
    Object.values(ET3HubLinkNames).forEach(name => {
      if (name === ET3HubLinkNames.ContactDetails) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.EmployerDetails) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.ConciliationAndEmployeeDetails) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.PayPensionBenefitDetails) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.ContestClaim) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.EmployersContractClaim) {
        this[name] = LinkStatus.NOT_STARTED_YET;
      } else if (name === ET3HubLinkNames.CheckYorAnswers) {
        this[name] = LinkStatus.CANNOT_START_YET;
      } else {
        this[name] = LinkStatus.NOT_YET_AVAILABLE;
      }
    });
  }
}

export const SectionIndexToEt3HubLinkNamesWithEmployersContractClaim: ET3HubLinkNames[][] = [
  [ET3HubLinkNames.ContactDetails, ET3HubLinkNames.EmployerDetails],
  [ET3HubLinkNames.ConciliationAndEmployeeDetails, ET3HubLinkNames.PayPensionBenefitDetails],
  [ET3HubLinkNames.ContestClaim, ET3HubLinkNames.EmployersContractClaim],
  [ET3HubLinkNames.CheckYorAnswers],
];

//*************************************************************************//
//********************* END OF ET3 HUB LINKS CONSTANTS ********************//
//*************************************************************************//

export const LinkColors = {
  TURQUOISE: '--turquoise',
  GREEN: '--green',
  BLUE: '--blue',
  RED: '--red',
  GREY: '--grey',
  YELLOW: '--yellow',
};

export const enum LinkStatus {
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  OPTIONAL = 'optional',
  VIEWED = 'viewed',
  NOT_VIEWED = 'notViewedYet',
  NOT_YET_AVAILABLE = 'notAvailableYet',
  WAITING_FOR_TRIBUNAL = 'waitingForTheTribunal',
  SUBMITTED_AND_VIEWED = 'submittedAndViewed',
  IN_PROGRESS = 'inProgress',
  STORED = 'stored',
  NOT_STARTED_YET = 'notStartedYet',
  UPDATED = 'updated',
  READY_TO_VIEW = 'readyToView',
  CANNOT_START_YET = 'cannotStartYet',
  // This status is implemented as a fake status. Normally
  // if any section status is completed we don't change it is status
  // But if on CYA(Check Your Answers) page if it is selected as No,
  // to section completed question, we update to inProgress again.
  // To have that discrimination, we use this option.
  IN_PROGRESS_CYA = 'inProgressCya',
}

export const linkStatusColorMap = new Map<LinkStatus, string>([
  [LinkStatus.COMPLETED, LinkColors.GREEN],
  [LinkStatus.SUBMITTED, LinkColors.TURQUOISE],
  [LinkStatus.OPTIONAL, LinkColors.BLUE],
  [LinkStatus.VIEWED, LinkColors.TURQUOISE],
  [LinkStatus.NOT_VIEWED, LinkColors.RED],
  [LinkStatus.NOT_YET_AVAILABLE, LinkColors.GREY],
  [LinkStatus.WAITING_FOR_TRIBUNAL, LinkColors.GREY],
  [LinkStatus.SUBMITTED_AND_VIEWED, LinkColors.TURQUOISE],
  [LinkStatus.IN_PROGRESS, LinkColors.YELLOW],
  [LinkStatus.STORED, LinkColors.YELLOW],
  [LinkStatus.NOT_STARTED_YET, LinkColors.RED],
  [LinkStatus.UPDATED, LinkColors.BLUE],
  [LinkStatus.READY_TO_VIEW, LinkColors.BLUE],
  [LinkStatus.CANNOT_START_YET, LinkColors.GREY],
]);

export const getResponseCaseDetailsLinkStatusesByRespondentCaseDetailsLinkStatuses = (
  respondentCaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses
): ET3CaseDetailsLinksStatuses => {
  if (!respondentCaseDetailsLinksStatuses) {
    respondentCaseDetailsLinksStatuses = new ET3CaseDetailsLinksStatuses();
  }
  for (const caseDetailsLinkKey of Object.values(ET3CaseDetailsLinkNames)) {
    if (!respondentCaseDetailsLinksStatuses[caseDetailsLinkKey]) {
      respondentCaseDetailsLinksStatuses[caseDetailsLinkKey] = new ET3CaseDetailsLinksStatuses()[caseDetailsLinkKey];
    }
  }
  return respondentCaseDetailsLinksStatuses;
};

export const getResponseHubLinkStatusesByRespondentHubLinkStatuses = (
  respondentHubLinksStatuses: ET3HubLinksStatuses
): ET3HubLinksStatuses => {
  if (!respondentHubLinksStatuses) {
    respondentHubLinksStatuses = new ET3HubLinksStatuses();
  }
  for (const hubLinkKey of Object.values(ET3HubLinkNames)) {
    if (!respondentHubLinksStatuses[hubLinkKey]) {
      if (ET3HubLinkNames.CheckYorAnswers === hubLinkKey) {
        respondentHubLinksStatuses[hubLinkKey] = getCheckYourAnswersStatus(respondentHubLinksStatuses);
      } else {
        respondentHubLinksStatuses[hubLinkKey] = LinkStatus.NOT_STARTED_YET;
      }
    }
  }
  return respondentHubLinksStatuses;
};

export const getCheckYourAnswersStatus = (et3HubLinkStatuses: ET3HubLinksStatuses): LinkStatus => {
  if (!et3HubLinkStatuses) {
    return LinkStatus.CANNOT_START_YET;
  }
  for (const hubLinkKey of Object.values(ET3HubLinkNames)) {
    if (
      hubLinkKey !== ET3HubLinkNames.CheckYorAnswers &&
      (!et3HubLinkStatuses[hubLinkKey] || et3HubLinkStatuses[hubLinkKey] !== LinkStatus.COMPLETED)
    ) {
      return LinkStatus.CANNOT_START_YET;
    }
  }
  return LinkStatus.NOT_STARTED_YET;
};
