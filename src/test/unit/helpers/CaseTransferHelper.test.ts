import axios from 'axios';

import { PageUrls } from '../../../main/definitions/constants';
import {
  buildTransferredCasePageHeading,
  buildTransferredCaseRedirectUrl,
  createFallbackTransferInfo,
  getNoAccessBody,
  handleTransferredCaseRedirect,
  saveSessionAndRedirectToTransferredCase,
  shouldFallbackToTransferredCase,
} from '../../../main/helpers/CaseTransferHelper';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

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

  describe('createFallbackTransferInfo', () => {
    it('should create ECM fallback transfer info', () => {
      const request = mockRequest({});
      expect(createFallbackTransferInfo(request, '20548')).toEqual({
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '20548',
        transferComplete: false,
      });
    });

    it('should include claimant and respondent names from the matching session case', () => {
      const request = mockRequest({
        userCase: {
          id: '20548',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [{ ccdId: 'ccd-1', respondentName: "McGregor's Farm" }],
        },
      });

      expect(createFallbackTransferInfo(request, '20548', 'ccd-1')).toEqual({
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '20548',
        transferComplete: false,
        claimantFirstName: 'Peter',
        claimantLastName: 'Rabbit',
        respondentName: "McGregor's Farm",
      });
    });
  });

  describe('shouldFallbackToTransferredCase', () => {
    it('should return true for ECM transfer errors', () => {
      expect(
        shouldFallbackToTransferredCase(
          new Error('Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM')
        )
      ).toBe(true);
    });

    it('should return true for case not found errors', () => {
      expect(
        shouldFallbackToTransferredCase(
          new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
        )
      ).toBe(true);
    });

    it('should return false for unrelated errors', () => {
      expect(shouldFallbackToTransferredCase(new Error('Error getting user case: status code 500'))).toBe(false);
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

    it('should fallback redirect when transfer-info is unavailable and original error indicates ECM transfer', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('Error getting case transfer info: 404'));
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
      const originalError = new Error(
        'Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM'
      );

      const redirected = await handleTransferredCaseRedirect(request, response, '1234', 'ccd-1', originalError);

      expect(redirected).toBe(true);
      expect(response.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`);
    });

    it('should return false when transfer info is not available', async () => {
      const request = mockRequest({});
      const response = mockResponse();
      caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not transferred'));

      const redirected = await handleTransferredCaseRedirect(request, response, '1234');

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });
  });

  describe('saveSessionAndRedirectToTransferredCase', () => {
    it('should return false when session save fails', async () => {
      const request = mockRequest({});
      request.url = '/case-details/1234?lng=en';
      request.session.save = jest.fn((done?: (err?: Error) => void) => {
        done?.(new Error('session save failed'));
        return request.session;
      });
      const response = mockResponse();

      const redirected = await saveSessionAndRedirectToTransferredCase(
        request,
        response,
        '1234',
        createFallbackTransferInfo(request, '1234')
      );

      expect(redirected).toBe(false);
      expect(response.redirect).not.toHaveBeenCalled();
    });
  });

  it('should return ECM no access body', () => {
    expect(
      getNoAccessBody(
        { transferred: true, transferType: 'ECM', transferComplete: true },
        { noAccessBodyEcm: 'ECM body', noAccessBodyCrossCountry: 'Cross country body' }
      )
    ).toBe('ECM body');
  });
});
