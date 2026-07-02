import axios from 'axios';

import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { PageUrls } from '../../../main/definitions/constants';
import {
  buildTransferredCasePageHeading,
  buildTransferredCaseRedirectUrl,
  clearCaseTransferInfoIfStale,
  handleCaseAccessFailure,
  handleTransferredCaseRedirect,
  saveSessionAndRedirectToTransferredCase,
} from '../../../main/helpers/CaseTransferHelper';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

const transferredCaseInfo: CaseTransferInfoResponse = {
  transferred: true,
  transferType: 'ECM',
  originalCaseId: '20548',
  transferComplete: false,
};

describe('CaseTransferHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
  });

  it('should build transferred case redirect url with case and ccd ids', () => {
    const request = mockRequest({});
    request.url = '/case-details/1234/ccd-1?lng=en';

    expect(buildTransferredCaseRedirectUrl(request, '1234', 'ccd-1')).toBe(
      `${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`
    );
  });

  it('should build page heading from transfer info party names', () => {
    expect(
      buildTransferredCasePageHeading(
        { title: 'Case overview', header: 'Case overview - ' },
        {
          transferred: true,
          transferType: 'ECM',
          transferComplete: true,
          claimantFirstName: 'Peter',
          claimantLastName: 'Rabbit',
          respondentName: "McGregor's Farm",
        }
      )
    ).toBe("Case overview - Peter Rabbit vs McGregor's Farm");
  });

  it('should fall back to title when party names are unavailable', () => {
    expect(
      buildTransferredCasePageHeading(
        { title: 'Case overview', header: 'Case overview - ' },
        { transferred: true, transferType: 'ECM', transferComplete: false }
      )
    ).toBe('Case overview');
  });

  describe('clearCaseTransferInfoIfStale', () => {
    it('should clear transfer info when case id does not match', () => {
      const request = mockRequest({});
      request.session.caseTransferInfo = {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '9999',
        transferComplete: false,
      };

      clearCaseTransferInfoIfStale(request, '1234');

      expect(request.session.caseTransferInfo).toBeUndefined();
    });

    it('should keep transfer info when case id matches', () => {
      const request = mockRequest({});
      const transferInfo = {
        transferred: true,
        transferType: 'ECM' as const,
        originalCaseId: '1234',
        transferComplete: false,
      };
      request.session.caseTransferInfo = transferInfo;

      clearCaseTransferInfoIfStale(request, '1234');

      expect(request.session.caseTransferInfo).toEqual(transferInfo);
    });
  });

  describe('handleTransferredCaseRedirect', () => {
    it('should redirect with transfer info when case is transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: true,
        },
      });
      const request = mockRequest({
        userCase: {
          id: '1234',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [{ ccdId: 'ccd-1', respondentName: "McGregor's Farm" }],
        },
      });
      request.url = '/case-details/1234/ccd-1?lng=en';
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(request, response, '1234', 'ccd-1');

      expect(redirected).toBe(true);
      expect(request.session.caseTransferInfo).toEqual(
        expect.objectContaining({
          originalCaseId: '1234',
          claimantFirstName: 'Peter',
          claimantLastName: 'Rabbit',
          respondentName: "McGregor's Farm",
        })
      );
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`);
    });

    it('should not redirect when transfer-info is unavailable', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('Error getting case transfer info: 404'));
      const request = mockRequest({});
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(request, response, '1234');

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });

    it('should not redirect when transfer-info says case is not transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: false,
          transferType: 'ECM',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(request, response, '1234');

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });
  });

  describe('handleCaseAccessFailure', () => {
    it('should redirect only when transfer-info confirms the case is transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      const response = mockResponse();

      const redirected = await handleCaseAccessFailure(request, response, '1234', 'ccd-1');

      expect(redirected).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`);
    });

    it('should not redirect when transfer-info says case is not transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: false,
          transferType: 'ECM',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      const response = mockResponse();

      const redirected = await handleCaseAccessFailure(request, response, '1234');

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });
  });

  describe('saveSessionAndRedirectToTransferredCase', () => {
    it('should still redirect when session save fails', async () => {
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      request.session.save = jest.fn((done?: (err?: Error) => void) => {
        done?.(new Error('session save failed'));
        return request.session;
      });
      const response = mockResponse();

      const redirected = await saveSessionAndRedirectToTransferredCase(request, response, '1234', transferredCaseInfo);

      expect(redirected).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
    });

    it('should still redirect when session save times out', async () => {
      jest.useFakeTimers();
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      request.session.save = jest.fn();
      const response = mockResponse();

      const redirectPromise = saveSessionAndRedirectToTransferredCase(request, response, '1234', transferredCaseInfo);
      jest.advanceTimersByTime(10000);

      await expect(redirectPromise).resolves.toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
      jest.useRealTimers();
    });
  });
});
