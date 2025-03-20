enum HubLinkNames {
  AboutYou = 'aboutYou',
  RespondentResponse = 'respondentResponse',
  Et1ClaimForm = 'et1ClaimForm',
  HearingDetails = 'hearingDetails',
  RequestsAndApplications = 'requestsAndApplications',
  RespondentApplications = 'respondentApplications',
  ContactTribunal = 'contactTribunal',
  TribunalOrders = 'tribunalOrders',
  TribunalJudgements = 'tribunalJudgements',
  Documents = 'documents',
}

export class HubLinksStatuses {
  [linkName: string]: HubLinkStatus;

  constructor() {
    Object.values(HubLinkNames).forEach(name => {
      if (name === HubLinkNames.Et1ClaimForm) {
        this[name] = HubLinkStatus.NOT_VIEWED;
      } else if (name === HubLinkNames.RespondentResponse) {
        this[name] = HubLinkStatus.NOT_STARTED_YET;
      } else if (name === HubLinkNames.ContactTribunal) {
        this[name] = HubLinkStatus.OPTIONAL;
      } else if (name === HubLinkNames.Documents) {
        this[name] = HubLinkStatus.READY_TO_VIEW;
      } else if (name === HubLinkNames.AboutYou) {
        this[name] = HubLinkStatus.NOT_STARTED_YET;
      } else {
        this[name] = HubLinkStatus.NOT_YET_AVAILABLE;
      }
    });
  }
}

export const enum HubLinkStatus {
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
}
