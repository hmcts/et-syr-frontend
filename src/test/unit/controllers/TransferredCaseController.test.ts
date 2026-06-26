import { nextTick } from 'process';

import axios from 'axios';

import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('Transferred Case Controller tests', () => {
  beforeEach(() => {
    caseApi.getCaseTransferInfo = jest.fn();
    caseApi.getUserCases = jest.fn().mockResolvedValue({ data: [] });
  });

  it('should render the transferred case page with transfer info from session', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.user = mockUserDetails;
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      newEthosCaseReference: '18850001/2020',
      transferComplete: true,
    };
    request.session.userCase = {
      id: '1234',
      firstName: 'Peter',
      lastName: 'Rabbit',
      respondents: [
        {
          ccdId: 'ccd-1',
          idamId: request.session.user.id,
          respondentName: "McGregor's Farm",
        },
      ],
    } as never;
    request.query = { ccdId: 'ccd-1' };
    request.t = jest.fn().mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        if (key === TranslationKeys.TRANSFERRED_CASE) {
          return {
            caseOverviewFallback: 'Case overview',
            noAccessBodyEcm: 'ECM body',
            noAccessBodyCrossCountry: 'Cross country body',
          };
        }
        if (key === TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER) {
          return { header: 'Case overview - ' };
        }
        if (key === TranslationKeys.SIDEBAR_CONTACT_US) {
          return { hours: { line1: 'Mon-Thu', line2: 'Fri', line3: 'Bank holidays' } };
        }
        return {};
      }
      return key;
    });

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        caseOverviewTitle: "Case overview - Peter Rabbit vs McGregor's Farm",
        caseNumber: '60000001/2022',
        replacementCaseNumber: '18850001/2020',
        showNewCaseNumber: true,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should fetch transfer info when case id is provided in query', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    request.t = jest.fn().mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        if (key === TranslationKeys.TRANSFERRED_CASE) {
          return {
            caseOverviewFallback: 'Case overview',
            noAccessBodyEcm: 'ECM body',
            noAccessBodyCrossCountry: 'Cross country body',
          };
        }
        if (key === TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER) {
          return { header: 'Case overview - ' };
        }
        if (key === TranslationKeys.SIDEBAR_CONTACT_US) {
          return { hours: { line1: 'Mon-Thu', line2: 'Fri', line3: 'Bank holidays' } };
        }
        return {};
      }
      return key;
    });
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'CROSS_COUNTRY',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).toHaveBeenCalledWith('1234');
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'Cross country body',
      })
    );
  });

  it('should redirect to not found when transfer info cannot be loaded', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
