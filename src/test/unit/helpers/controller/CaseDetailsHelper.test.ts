import AxiosInstance from 'axios';

import { AppRequest } from '../../../../main/definitions/appRequest';
import { YesOrNo } from '../../../../main/definitions/case';
import { Applicant, PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../../../../main/definitions/links';
import { isResponseToTribunalRequired } from '../../../../main/helpers/GenericTseApplicationHelper';
import { getET3CaseDetailsLinkNames } from '../../../../main/helpers/controller/CaseDetailsHelper';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { mockUserDetails } from '../../mocks/mockUser';
import mockUserCase from '../../mocks/mockUserCase';

describe('Case Details Helper', () => {
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
      req = mockRequest({});
      req.session.user = mockUserDetails;
      req.session.userCase = mockUserCase;
    });

    it('returns NOT_YET_AVAILABLE when no applications exist', async () => {
      req.session.userCase.genericTseApplicationCollection = [];
      const statuses = {};
      const result = await getET3CaseDetailsLinkNames(statuses, req);
      expect(result[ET3CaseDetailsLinkNames.ClaimantApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
      expect(result[ET3CaseDetailsLinkNames.OtherRespondentApplications]).toBe(LinkStatus.NOT_YET_AVAILABLE);
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
  });
});
