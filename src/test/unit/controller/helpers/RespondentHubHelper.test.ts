import {
  StatusesInOrderOfUrgency,
  getHubLinksUrlMap,
  shouldHubLinkBeClickable,
  updateYourApplicationsStatusTag,
} from '../../../../main/controllers/helpers/ResponseHubHelper';
import { CaseWithId } from '../../../../main/definitions/case';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../../../../main/definitions/hub';
import mockUserCaseWithoutTseApp from '../../../../main/resources/mocks/mockUserCaseWithoutTseApp';
import {
  mockTseAdminClaimantRespondNotViewed,
  mockTseAdminClaimantRespondWaitingForTrib,
  mockTseRespondentRespondsToAdminRequestNotViewed,
  mockTseRespondentRespondsToAdminRequestWaitingForTrib,
} from '../../mocks/mockGenericTseCollection';
import mockUserCase from '../../mocks/mockUserCase';
import { clone } from '../../test-helpers/clone';

describe('shouldHubLinkBeClickable', () => {
  it('should not be clickable if not yet available', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.NOT_YET_AVAILABLE, undefined)).toBe(false);
  });

  it('should not be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.Documents)).toBe(false);
  });

  it('should be clickable if awaiting tribunal and not respondent applications', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.WAITING_FOR_TRIBUNAL, HubLinkNames.RespondentApplications)).toBe(
      true
    );
  });

  it('should not be clickable otherwise', () => {
    expect(shouldHubLinkBeClickable(HubLinkStatus.IN_PROGRESS, undefined)).toBe(true);
  });
});

describe('updateYourApplicationsStatusTag', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
  });

  test.each([
    [StatusesInOrderOfUrgency[0], StatusesInOrderOfUrgency[1]],
    [StatusesInOrderOfUrgency[1], StatusesInOrderOfUrgency[2]],
    [StatusesInOrderOfUrgency[2], StatusesInOrderOfUrgency[3]],
    [StatusesInOrderOfUrgency[3], StatusesInOrderOfUrgency[4]],
    [StatusesInOrderOfUrgency[4], StatusesInOrderOfUrgency[5]],
  ])('set hub status for claimant applications based on the following application statuses ([%s, %s])', (a, b) => {
    updateYourApplicationsStatusTag([{ value: { applicationState: a } }, { value: { applicationState: b } }], userCase);
    expect(userCase?.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(a);
  });

  it('Hublink status should be not avaliable yet if no claimant applications exist', () => {
    const userCaseWithoutClaimantApp = { ...mockUserCaseWithoutTseApp };
    expect(userCaseWithoutClaimantApp?.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(
      HubLinkStatus.NOT_YET_AVAILABLE
    );
  });
});

describe('update response hub status when different to application status', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
    userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
  });

  it('should update the hublink status to in progress when claimant responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseAdminClaimantRespondWaitingForTrib;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.IN_PROGRESS);
  });

  it('should update the hublink status to updated when respondent responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseRespondentRespondsToAdminRequestWaitingForTrib;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.UPDATED);
  });
});

describe('should not update response hub status', () => {
  let userCase: CaseWithId;
  beforeEach(() => {
    userCase = clone(mockUserCase);
    userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.NOT_VIEWED;
  });

  it('should not update the hublink status to in progress when claimant responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseAdminClaimantRespondNotViewed;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.NOT_VIEWED);
  });

  it('should not update the hublink status to updated when respondent responds to tribunal request', () => {
    userCase.genericTseApplicationCollection = mockTseRespondentRespondsToAdminRequestNotViewed;
    updateYourApplicationsStatusTag(userCase.genericTseApplicationCollection, userCase);
    expect(userCase.hubLinksStatuses[HubLinkNames.RequestsAndApplications]).toBe(HubLinkStatus.NOT_VIEWED);
  });
});

describe('getHubLinksUrlMap', () => {
  it('returns correct links when respondent is system user in English', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, '#'],
      [HubLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING],
      [HubLinkNames.ContactTribunal, '#'],
      [HubLinkNames.RequestsAndApplications, '#'],
      [HubLinkNames.RespondentApplications, '#'],
      [HubLinkNames.TribunalOrders, '#'],
      [HubLinkNames.TribunalJudgements, '#'],
      [HubLinkNames.Documents, '#'],
    ]);
    expect(getHubLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is system user in Welsh', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.ContactTribunal, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RequestsAndApplications, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentApplications, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalOrders, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalJudgements, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.Documents, '#' + languages.WELSH_URL_PARAMETER],
    ]);
    expect(getHubLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is non-system user in English', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, '#'],
      [HubLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING],
      [HubLinkNames.ContactTribunal, '#'],
      [HubLinkNames.RequestsAndApplications, '#'],
      [HubLinkNames.RespondentApplications, '#'],
      [HubLinkNames.TribunalOrders, '#'],
      [HubLinkNames.TribunalJudgements, '#'],
      [HubLinkNames.Documents, '#'],
    ]);
    expect(getHubLinksUrlMap(languages.ENGLISH_URL_PARAMETER)).toEqual(linksMap);
  });

  it('returns correct links when respondent is non-system user in Welsh', () => {
    const linksMap: Map<string, string> = new Map<string, string>([
      [HubLinkNames.Et1ClaimForm, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentResponse, PageUrls.RESPONDENT_RESPONSE_LANDING + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.ContactTribunal, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RequestsAndApplications, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.RespondentApplications, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalOrders, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.TribunalJudgements, '#' + languages.WELSH_URL_PARAMETER],
      [HubLinkNames.Documents, '#' + languages.WELSH_URL_PARAMETER],
    ]);
    expect(getHubLinksUrlMap(languages.WELSH_URL_PARAMETER)).toEqual(linksMap);
  });
});
