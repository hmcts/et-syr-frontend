import axios from 'axios';

import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { PageUrls } from '../../../main/definitions/constants';
import {
  applyCaseTransferInfoToSession,
  buildTransferredCasePageHeading,
  buildTransferredCaseRedirectUrl,
  clearCaseTransferInfoIfStale,
  enrichTransferInfoWithCaseParties,
  getRequestedCaseId,
  getRequestedCcdId,
  getSafeApiErrorSummary,
  getTransferredCaseNoAccessBody,
  getTransferredCaseWhatHappensNextPointTwo,
  handleTransferredCaseRedirect,
  isTransferInfoForCase,
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
  originalCaseId: '1234',
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

  describe('getSafeApiErrorSummary', () => {
    it('should return HTTP status code when present in the error message', () => {
      expect(getSafeApiErrorSummary(new Error('Error getting user case: status code 404'))).toBe('HTTP 404');
    });

    it('should return known API error codes without the full message body', () => {
      expect(getSafeApiErrorSummary(new Error('Request failed with status code 404, CaseNotFoundException'))).toBe(
        'HTTP 404'
      );
      expect(getSafeApiErrorSummary(new Error('CASE_TRANSFERRED_TO_ECM'))).toBe('CASE_TRANSFERRED');
    });

    it('should return a generic summary for unknown errors', () => {
      expect(getSafeApiErrorSummary(new Error('{"claimantFirstName":"Jane","ethosCaseReference":"600/2024"}'))).toBe(
        'unexpected error'
      );
    });
  });

  describe('getRequestedCaseId', () => {
    it('should return case id from query string', () => {
      const request = mockRequest({});
      request.query = { caseId: '1234' };

      expect(getRequestedCaseId(request)).toBe('1234');
    });

    it('should return session case id when query is missing', () => {
      const request = mockRequest({});
      request.session.caseTransferInfo = {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '5678',
        transferComplete: true,
      };

      expect(getRequestedCaseId(request)).toBe('5678');
    });

    it('should return undefined when query case id is an array', () => {
      const request = mockRequest({});
      request.query = { caseId: ['1234', '5678'] };

      expect(getRequestedCaseId(request)).toBeUndefined();
    });

    it('should return undefined when query case id is blank', () => {
      const request = mockRequest({});
      request.query = { caseId: '   ' };

      expect(getRequestedCaseId(request)).toBeUndefined();
    });
  });

  describe('getRequestedCcdId', () => {
    it('should return ccd id from query string', () => {
      const request = mockRequest({});
      request.query = { ccdId: 'ccd-1' };

      expect(getRequestedCcdId(request)).toBe('ccd-1');
    });

    it('should return undefined when query ccd id is an array', () => {
      const request = mockRequest({});
      request.query = { ccdId: ['ccd-1', 'ccd-2'] };

      expect(getRequestedCcdId(request)).toBeUndefined();
    });

    it('should return undefined when query ccd id is blank', () => {
      const request = mockRequest({});
      request.query = { ccdId: '   ' };

      expect(getRequestedCcdId(request)).toBeUndefined();
    });
  });

  describe('isTransferInfoForCase', () => {
    it('should return true when transfer info matches the requested case', () => {
      expect(
        isTransferInfoForCase('1234', {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: true,
        })
      ).toBe(true);
    });

    it('should return false when original case id does not match', () => {
      expect(
        isTransferInfoForCase('1234', {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '9999',
          transferComplete: true,
        })
      ).toBe(false);
    });

    it('should return false when case is not transferred', () => {
      expect(
        isTransferInfoForCase('1234', {
          transferred: false,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        })
      ).toBe(false);
    });
  });

  describe('getTransferredCaseNoAccessBody', () => {
    const translations = {
      noAccessBodyEcm: 'ECM body',
      noAccessBodyCrossCountry: 'Cross country body',
    };

    it('should return ECM copy for ECM transfer type', () => {
      expect(getTransferredCaseNoAccessBody(translations, 'ECM')).toBe('ECM body');
    });

    it('should return cross country copy for CROSS_COUNTRY transfer type', () => {
      expect(getTransferredCaseNoAccessBody(translations, 'CROSS_COUNTRY')).toBe('Cross country body');
    });

    it('should default to ECM copy when transfer type is missing', () => {
      expect(getTransferredCaseNoAccessBody(translations)).toBe('ECM body');
    });
  });

  describe('getTransferredCaseWhatHappensNextPointTwo', () => {
    const translations = {
      whatHappensNextPointTwoWithNewCaseNumber: 'quoting your new case number',
      whatHappensNextPointTwoWithOldCaseNumber: 'quoting your old case number',
    };

    it('should return new case number copy when showNewCaseNumber is true', () => {
      expect(getTransferredCaseWhatHappensNextPointTwo(translations, true)).toBe('quoting your new case number');
    });

    it('should return old case number copy when showNewCaseNumber is false', () => {
      expect(getTransferredCaseWhatHappensNextPointTwo(translations, false)).toBe('quoting your old case number');
    });
  });

  describe('enrichTransferInfoWithCaseParties', () => {
    it('should enrich transfer info with party names from the matching respondent', () => {
      const request = mockRequest({
        userCase: {
          id: '1234',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [{ ccdId: 'ccd-1', respondentName: "McGregor's Farm" }],
        },
      });

      const enriched = enrichTransferInfoWithCaseParties(
        request,
        { transferred: true, transferType: 'ECM', transferComplete: true },
        '1234',
        'ccd-1'
      );

      expect(enriched).toEqual(
        expect.objectContaining({
          claimantFirstName: 'Peter',
          claimantLastName: 'Rabbit',
          respondentName: "McGregor's Farm",
        })
      );
    });

    it('should not fall back to the first respondent when ccd id and user id do not match', () => {
      const request = mockRequest({
        userCase: {
          id: '1234',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [
            { ccdId: 'ccd-1', respondentName: "McGregor's Farm" },
            { ccdId: 'ccd-2', respondentName: 'Wrong Farm' },
          ],
        },
      });

      const enriched = enrichTransferInfoWithCaseParties(
        request,
        { transferred: true, transferType: 'ECM', transferComplete: true },
        '1234',
        'ccd-unknown'
      );

      expect(enriched.respondentName).toBeUndefined();
    });
  });

  describe('applyCaseTransferInfoToSession', () => {
    it('should store enriched transfer info on the session', () => {
      const request = mockRequest({
        userCase: {
          id: '1234',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [{ ccdId: 'ccd-1', respondentName: "McGregor's Farm" }],
        },
      });

      const transferInfo = applyCaseTransferInfoToSession(
        request,
        { transferred: true, transferType: 'ECM', transferComplete: true },
        '1234',
        'ccd-1'
      );

      expect(request.session.caseTransferInfo).toEqual(transferInfo);
      expect(transferInfo.respondentName).toBe("McGregor's Farm");
    });
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

      const redirected = await handleTransferredCaseRedirect(
        request,
        response,
        '1234',
        undefined,
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });

    it('should redirect when getUserCase failed with a 404 and transfer-info confirms transfer', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      request.url = '/case-details/1234/ccd-1?lng=en';
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        request,
        response,
        '1234',
        'ccd-1',
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );

      expect(redirected).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`);
    });

    it('should redirect when getUserCase failed with a 410 transferred case error', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      request.url = '/case-details/1234/ccd-1?lng=en';
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        request,
        response,
        '1234',
        'ccd-1',
        new Error('Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM')
      );

      expect(redirected).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`);
    });

    it('should not redirect when getUserCase fails with a non-access error', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '1234',
          transferComplete: false,
        },
      });
      const request = mockRequest({});
      const response = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        request,
        response,
        '1234',
        undefined,
        new Error('Error getting user case: Request failed with status code 500')
      );

      expect(redirected).toBe(false);
      expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
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

      const redirected = await handleTransferredCaseRedirect(
        request,
        response,
        '1234',
        undefined,
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });

    it('should not redirect when transfer-info originalCaseId does not match requested case', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '99999',
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

  describe('saveSessionAndRedirectToTransferredCase', () => {
    it('should persist transfer info when session save succeeds', async () => {
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      request.session.save = jest.fn((done?: (err?: Error) => void) => {
        done?.();
        return request.session;
      });
      const response = mockResponse();

      const redirected = await saveSessionAndRedirectToTransferredCase(request, response, '1234', transferredCaseInfo);

      expect(redirected).toBe(true);
      expect(request.session.caseTransferInfo).toEqual(expect.objectContaining({ originalCaseId: '1234' }));
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
    });

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
      expect(request.session.caseTransferInfo).toBeUndefined();
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
      expect(request.session.caseTransferInfo).toBeUndefined();
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234`);
      jest.useRealTimers();
    });
  });
});
