import { ET3HubLinkNames, ET3HubLinksStatuses, LinkStatus } from '../../../main/definitions/links';

const mockCompletedHubLinkStatuses = (): ET3HubLinksStatuses => {
  const et3HubLinkStatuses = new ET3HubLinksStatuses();
  for (const hubLinkKey of Object.values(ET3HubLinkNames)) {
    if (hubLinkKey === ET3HubLinkNames.CheckYorAnswers) {
      et3HubLinkStatuses[hubLinkKey] = LinkStatus.NOT_STARTED_YET;
    } else {
      et3HubLinkStatuses[hubLinkKey] = LinkStatus.COMPLETED;
    }
  }
  return et3HubLinkStatuses;
};

const mockCompletedHubLinkStatusesWithoutCheckYourAnswers = (): ET3HubLinksStatuses => {
  const et3HubLinkStatuses = new ET3HubLinksStatuses();
  for (const hubLinkKey of Object.values(ET3HubLinkNames)) {
    if (hubLinkKey === ET3HubLinkNames.CheckYorAnswers) {
      et3HubLinkStatuses[hubLinkKey] = undefined;
    } else {
      et3HubLinkStatuses[hubLinkKey] = LinkStatus.COMPLETED;
    }
  }
  return et3HubLinkStatuses;
};

const mockAllUndefinedET3HubLinksStatuses = (): ET3HubLinksStatuses => {
  const et3HubLinkStatuses = new ET3HubLinksStatuses();
  for (const hubLinkKey of Object.values(ET3HubLinkNames)) {
    et3HubLinkStatuses[hubLinkKey] = undefined;
  }
  return et3HubLinkStatuses;
};

export const mockHubLinkStatuses = {
  mockedInitialHubLinksStatuses: new ET3HubLinksStatuses(),
  mockedCompletedHubLinksStatuses: mockCompletedHubLinkStatuses(),
  mockedAllUndefinedET3HubLinksStatuses: mockAllUndefinedET3HubLinksStatuses(),
  mockedCompletedHubLinkStatusesWithoutCheckYourAnswers: mockCompletedHubLinkStatusesWithoutCheckYourAnswers(),
};
