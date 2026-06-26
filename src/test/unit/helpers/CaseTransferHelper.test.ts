import axios from 'axios';

import { PageUrls } from '../../../main/definitions/constants';
import {
  buildTransferredCaseRedirectUrl,
  getNoAccessBody,
  handleTransferredCaseRedirect,
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
    caseApi.getCaseTransferInfo = jest.fn();
  });

  it('should build transferred case redirect url with case and ccd ids', () => {
    const request = mockRequest({});
    request.url = '/case-details/1234/ccd-1?lng=en';

    expect(buildTransferredCaseRedirectUrl(request, '1234', 'ccd-1')).toBe(
      `${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=1234&ccdId=ccd-1`
    );
  });

  it('should redirect when transfer info is available', async () => {
    const request = mockRequest({});
    request.url = '/case-details/1234/ccd-1?lng=en';
    const response = mockResponse();
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        transferComplete: true,
      },
    });

    const redirected = await handleTransferredCaseRedirect(request, response, '1234', 'ccd-1');

    expect(redirected).toBe(true);
    expect(request.session.caseTransferInfo?.originalCaseId).toBe('1234');
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

  it('should return ECM no access body', () => {
    expect(
      getNoAccessBody(
        { transferred: true, transferType: 'ECM', transferComplete: true },
        { noAccessBodyEcm: 'ECM body', noAccessBodyCrossCountry: 'Cross country body' }
      )
    ).toBe('ECM body');
  });
});
