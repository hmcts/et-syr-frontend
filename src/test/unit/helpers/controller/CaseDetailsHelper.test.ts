import AxiosInstance from 'axios';

import { AppRequest } from '../../../../main/definitions/appRequest';
import { CaseTypeId, YesOrNo } from '../../../../main/definitions/case';
import { Applicant, PageUrls, PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../../../../main/definitions/links';
import { isResponseToTribunalRequired } from '../../../../main/helpers/GenericTseApplicationHelper';
import {
  getET3CaseDetailsLinkNames,
  getSectionIndexToEt3CaseDetailsLinkNames,
  getSections,
  getYourSupportLinkStatus,
  isEt3ResponseSubmitted,
} from '../../../../main/helpers/controller/CaseDetailsHelper';
import { CuiYourSupportFeature } from '../../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CaseService from '../../../../main/services/CaseService';
import { CaseApi } from '../../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockUserDetails } from '../../mocks/mockUser';
import mockUserCase from '../../mocks/mockUserCase';

describe('Case Details Helper', () => {
  beforeEach(() => {
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  describe('getET3CaseDetailsLinkNames', () => {
    let req: AppRequest;

    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
      submitRespondentResponseToApplication: jest.fn(),
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
    caseApi.changeApplicationStatus = jest.fn().mockResolvedValue(Promise.resolve(mockUserCase));

    beforeEach(() => {
      req = mockRequest({
        userCase: mockUserCase,
      });
      req.session.user = mockUserDetails;
      req.session.userCase = {
        ...mockUserCase,
        respondentExternalFlags: undefined,
      };
    });

    it('returns NOT_YET_AVAILABLE when no applications exist', async () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
      expect(result[ET3CaseDetailsLinkNames.OtherRespondentApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
    });

    it('returns initialized statuses when statuses is null', async () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const statuses: ET3CaseDetailsLinksStatuses = null;
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.PersonalDetails]).toBe(LinkStatus.NOT_YET_AVAILABLE);
      expect(result[ET3CaseDetailsLinkNames.YourSupport]).toBeUndefined();
      expect(result[ET3CaseDetailsLinkNames.ET1ClaimForm]).toBe(LinkStatus.NOT_VIEWED);
      expect(result[ET3CaseDetailsLinkNames.ClaimantContactDetails]).toBe(LinkStatus.READY_TO_VIEW);
      expect(result[ET3CaseDetailsLinkNames.RespondentResponse]).toBe(LinkStatus.NOT_STARTED_YET);
      expect(result[ET3CaseDetailsLinkNames.ContactTribunal]).toBe(LinkStatus.OPTIONAL);
      expect(result[ET3CaseDetailsLinkNames.Documents]).toBe(LinkStatus.OPTIONAL);
    });

    it('returns initialized statuses when statuses is undefined', async () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const statuses: ET3CaseDetailsLinksStatuses = undefined;
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.PersonalDetails]).toBe(LinkStatus.NOT_YET_AVAILABLE);
      expect(result[ET3CaseDetailsLinkNames.YourSupport]).toBeUndefined();
      expect(result[ET3CaseDetailsLinkNames.ET1ClaimForm]).toBe(LinkStatus.NOT_VIEWED);
      expect(result[ET3CaseDetailsLinkNames.ClaimantContactDetails]).toBe(LinkStatus.READY_TO_VIEW);
      expect(result[ET3CaseDetailsLinkNames.RespondentResponse]).toBe(LinkStatus.NOT_STARTED_YET);
      expect(result[ET3CaseDetailsLinkNames.ContactTribunal]).toBe(LinkStatus.OPTIONAL);
      expect(result[ET3CaseDetailsLinkNames.Documents]).toBe(LinkStatus.OPTIONAL);
    });

    it('returns SUBMITTED for Your Support when respondent external flags have details and Scotland is enabled', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      req.session.userCase.genericTseApplicationCollection = [];
      req.session.userCase.caseTypeId = CaseTypeId.SCOTLAND;
      req.session.userCase.responseReceived = YesOrNo.YES;
      req.session.userCase.respondentExternalFlags = {
        details: [
          {
            id: 'flag-1',
            value: {
              name: 'Support request',
            },
          },
        ],
      };
      const statuses = {};

      const result = await getET3CaseDetailsLinkNames(statuses, req);

      expect(result[ET3CaseDetailsLinkNames.YourSupport]).toBe(LinkStatus.SUBMITTED);
    });

    it('returns OPTIONAL for Your Support when respondent external flags have no details and Scotland is enabled', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      req.session.userCase.genericTseApplicationCollection = [];
      req.session.userCase.caseTypeId = CaseTypeId.SCOTLAND;
      req.session.userCase.responseReceived = YesOrNo.YES;
      req.session.userCase.respondentExternalFlags = {
        details: [],
      };
      const statuses = {};

      const result = await getET3CaseDetailsLinkNames(statuses, req);

      expect(result[ET3CaseDetailsLinkNames.YourSupport]).toBe(LinkStatus.OPTIONAL);
    });

    it('returns NOT_YET_AVAILABLE for Your Support before the ET3 response is submitted when Scotland is enabled', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      req.session.userCase.genericTseApplicationCollection = [];
      req.session.userCase.caseTypeId = CaseTypeId.SCOTLAND;
      req.session.userCase.responseReceived = YesOrNo.NO;
      req.session.userCase.respondentExternalFlags = {
        details: [],
      };
      const statuses = {};

      const result = await getET3CaseDetailsLinkNames(statuses, req);

      expect(result[ET3CaseDetailsLinkNames.YourSupport]).toBe(LinkStatus.NOT_YET_AVAILABLE);
    });

    it('returns NOT_YET_AVAILABLE when application collection is undefined', async () => {
      req.session.userCase.genericTseApplicationCollection = undefined;
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
      expect(result[ET3CaseDetailsLinkNames.OtherRespondentApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
    });

    it('returns NOT_STARTED_YET when response to tribunal is required', async () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.NO,
            respondCollection: [
              {
                id: '0c28f1f0-0c2f-43bb-ae2c-e335c92a7e5c',
                value: {
                  from: Applicant.ADMIN,
                  isResponseRequired: YesOrNo.YES,
                  selectPartyRespond: PartiesRespond.RESPONDENT,
                  selectPartyNotify: PartiesNotify.BOTH_PARTIES,
                },
              },
            ],
          },
        },
      ];

      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(
        isResponseToTribunalRequired(req.session.userCase.genericTseApplicationCollection[0].value, req.session.user)
      ).toBe(true);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.NOT_STARTED_YET);
    });

    it('returns NOT_STARTED_YET when user has no application states', async () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
          },
        },
      ];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.NOT_STARTED_YET);
    });

    it('returns highest priority status found in user applications', async () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.CLAIMANT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            respondentState: [
              {
                id: '1',
                value: {
                  userIdamId: req.session.user.id,
                  applicationState: LinkStatus.UPDATED,
                },
              },
            ],
          },
        },
      ];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.UPDATED);
    });

    it('returns NOT_YET_AVAILABLE for Other Respondent Applications when none exist', async () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.OtherRespondentApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
    });

    it('returns correct priority order status for Other Respondent Applications', async () => {
      req.session.userCase.genericTseApplicationCollection = [
        {
          id: 'fef3d0ac-fb9d-4bf9-8d6e-497cee4c103c',
          value: {
            applicant: Applicant.RESPONDENT,
            copyToOtherPartyYesOrNo: YesOrNo.YES,
            respondentState: [
              {
                id: '1',
                value: {
                  userIdamId: req.session.user.id,
                  applicationState: LinkStatus.VIEWED,
                },
              },
            ],
          },
        },
      ];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.OtherRespondentApplications]).toBe(LinkStatus.VIEWED);
    });

    it('returns SUBMITTED when responseReceived is Yes', async () => {
      req.session.userCase.responseReceived = YesOrNo.YES;
      const statuses: ET3CaseDetailsLinksStatuses = {
        [ET3CaseDetailsLinkNames.RespondentResponse]: LinkStatus.IN_PROGRESS,
      };
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.RespondentResponse]).toBe(LinkStatus.SUBMITTED);
    });

    it('returns existing status when ET3 form not exist', async () => {
      req.session.userCase.responseReceived = YesOrNo.NO;
      const statuses: ET3CaseDetailsLinksStatuses = {
        [ET3CaseDetailsLinkNames.RespondentResponse]: LinkStatus.CANNOT_START_YET,
      };
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.RespondentResponse]).toBe(LinkStatus.CANNOT_START_YET);
    });
  });

  describe('getSections', () => {
    it('does not add Your Support under personal details when CUI Your Support is disabled', () => {
      const req = mockRequestWithTranslation(
        {},
        {
          section1: 'About you',
          personalDetails: 'View and edit your personal details',
          yourSupport: 'Your Support',
          notAvailableYet: 'Not available yet',
          optional: 'Optional',
        }
      );
      const selectedRespondent = { et3Status: '' };
      const statuses = new ET3CaseDetailsLinksStatuses();

      const sections = getSections(statuses, selectedRespondent, req);

      expect(sections[0].links.map(link => link.linkTxt)).toEqual(['View and edit your personal details']);
    });

    it('adds Your Support under personal details when Scotland is enabled', () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      const req = mockRequestWithTranslation(
        {
          userCase: {
            caseTypeId: CaseTypeId.SCOTLAND,
          },
        },
        {
          section1: 'About you',
          personalDetails: 'View and edit your personal details',
          yourSupport: 'Your Support',
          notAvailableYet: 'Not available yet',
          optional: 'Optional',
        }
      );
      const selectedRespondent = { et3Status: '' };
      const statuses = new ET3CaseDetailsLinksStatuses();

      const sections = getSections(statuses, selectedRespondent, req);

      expect(sections[0].links.map(link => link.linkTxt)).toEqual([
        'View and edit your personal details',
        'Your Support',
      ]);
      expect(sections[0].links[1]).toEqual(
        expect.objectContaining({
          linkTxt: 'Your Support',
          shouldShow: true,
          status: 'Optional',
          url: PageUrls.YOUR_SUPPORT,
        })
      );
    });

    it('only adds Your Support to section link names when Scotland is enabled', () => {
      expect(
        getSectionIndexToEt3CaseDetailsLinkNames(CaseTypeId.ENGLAND_WALES)
          .flat()
          .filter(linkName => linkName === ET3CaseDetailsLinkNames.YourSupport)
      ).toHaveLength(0);

      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));

      expect(
        getSectionIndexToEt3CaseDetailsLinkNames(CaseTypeId.SCOTLAND)
          .flat()
          .filter(linkName => linkName === ET3CaseDetailsLinkNames.YourSupport)
      ).toHaveLength(1);
    });
  });

  describe('your support status helpers', () => {
    it('returns submitted when selected respondent has submitted an ET3 response', () => {
      const req = mockRequest({
        userCase: {
          responseReceived: YesOrNo.NO,
          respondents: [
            {
              ccdId: 'respondent-1',
              responseReceived: YesOrNo.YES,
            },
          ],
        },
        session: {
          selectedRespondentIndex: 0,
        },
      });

      expect(isEt3ResponseSubmitted(req)).toBe(true);
    });

    it('returns false when no case or selected respondent has submitted an ET3 response', () => {
      const req = mockRequest({
        userCase: {
          responseReceived: YesOrNo.NO,
          respondents: [
            {
              ccdId: 'respondent-1',
              responseReceived: YesOrNo.NO,
            },
          ],
        },
        session: {
          selectedRespondentIndex: undefined,
        },
      });

      expect(isEt3ResponseSubmitted(req)).toBe(false);
    });

    it('returns optional when respondent external flags are missing', () => {
      const req = mockRequest({
        userCase: {
          respondentExternalFlags: undefined,
        },
      });

      expect(getYourSupportLinkStatus(req)).toBe(LinkStatus.OPTIONAL);
    });
  });
});
