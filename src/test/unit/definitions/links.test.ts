import {
  LinkStatus,
  getCheckYourAnswersStatus,
  getResponseHubLinkStatusesByRespondentHubLinkStatuses,
} from '../../../main/definitions/links';
import { mockHubLinkStatuses } from '../mocks/mockET3HubLinkStatuses';

describe('getResponseHubLinkStatusesByRespondentHubLinkStatuses', () => {
  it('should set initial ET3HubLinkStatuses when et3HubLinkStatuses is empty', async () => {
    expect(getResponseHubLinkStatusesByRespondentHubLinkStatuses(undefined)).toEqual(
      mockHubLinkStatuses.mockedInitialHubLinksStatuses
    );
  });
  it('should set completed ET3HubLinkStatuses when et3HubLinkStatuses is completed', async () => {
    expect(
      getResponseHubLinkStatusesByRespondentHubLinkStatuses(mockHubLinkStatuses.mockedCompletedHubLinksStatuses)
    ).toEqual(mockHubLinkStatuses.mockedCompletedHubLinksStatuses);
  });
  it('should set completed ET3HubLinkStatuses when et3HubLinkStatuses is completed and check your answers is undefined', async () => {
    expect(
      getResponseHubLinkStatusesByRespondentHubLinkStatuses(
        mockHubLinkStatuses.mockedCompletedHubLinkStatusesWithoutCheckYourAnswers
      )
    ).toEqual(mockHubLinkStatuses.mockedCompletedHubLinksStatuses);
  });
  it('should set initial ET3HubLinkStatuses when et3HubLinkStatuses is all undefined', async () => {
    expect(
      getResponseHubLinkStatusesByRespondentHubLinkStatuses(mockHubLinkStatuses.mockedAllUndefinedET3HubLinksStatuses)
    ).toEqual(mockHubLinkStatuses.mockedInitialHubLinksStatuses);
  });
});

describe('getCheckYourAnswersStatus', () => {
  it('should return LinkStatus.CANNOT_START_YET when any of the hub links statuses is undefined', async () => {
    expect(getCheckYourAnswersStatus(undefined)).toEqual(LinkStatus.CANNOT_START_YET);
  });
  it('should return LinkStatus.CANNOT_START_YET when any of the hub link status is not completed', async () => {
    expect(getCheckYourAnswersStatus(mockHubLinkStatuses.mockedInitialHubLinksStatuses)).toEqual(
      LinkStatus.CANNOT_START_YET
    );
  });
  it('should return LinkStatus.NOT_STARTED_YET when all of the hub link status is completed', async () => {
    expect(
      getCheckYourAnswersStatus(mockHubLinkStatuses.mockedCompletedHubLinkStatusesWithoutCheckYourAnswers)
    ).toEqual(LinkStatus.NOT_STARTED_YET);
  });
});
