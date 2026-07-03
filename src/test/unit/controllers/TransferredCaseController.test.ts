import { nextTick } from 'process';

import axios from 'axios';

import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

const transferredCaseTranslations = {
  title: 'Case overview',
  header: 'Case overview - ',
  noAccessBodyEcm: 'ECM body',
  noAccessBodyCrossCountry: 'Cross country body',
};

const mockTransferredCaseTranslations = (request: AppRequest): void => {
  (request.t as unknown as jest.Mock).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
    if (options?.returnObjects) {
      if (key === TranslationKeys.TRANSFERRED_CASE) {
        return transferredCaseTranslations;
      }
      if (key === TranslationKeys.SIDEBAR_CONTACT_US) {
        return {
          callEmployer: 'Call the tribunal',
          hours: { line1: 'Mon-Thu', line2: 'Fri', line3: 'Bank holidays' },
        };
      }
      return {};
    }
    return key;
  });
};

describe('TransferredCaseController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
  });

  it('should render the transferred case page with complete transfer info from session without calling the api', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      newEthosCaseReference: '18850001/2020',
      transferComplete: true,
    };
    mockTransferredCaseTranslations(request);

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: 'Case overview',
        caseNumber: '60000001/2022',
        replacementCaseNumber: '18850001/2020',
        showNewCaseNumber: true,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should store party names on case transfer info and build the page heading from them', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({
      userCase: {
        id: '1234',
        firstName: 'Peter',
        lastName: 'Rabbit',
        respondents: [{ ccdId: 'ccd-1', respondentName: "McGregor's Farm" }],
      },
    });
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '6010106/2024',
      transferComplete: true,
    };
    request.query = { ccdId: 'ccd-1' };
    mockTransferredCaseTranslations(request);

    await controller.get(request, response);

    expect(request.session.caseTransferInfo).toEqual(
      expect.objectContaining({
        claimantFirstName: 'Peter',
        claimantLastName: 'Rabbit',
        respondentName: "McGregor's Farm",
      })
    );
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
      })
    );
  });

  it('should build the page heading from stored transfer info when user case is no longer available', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '6010106/2024',
      transferComplete: true,
      claimantFirstName: 'Peter',
      claimantLastName: 'Rabbit',
      respondentName: "McGregor's Farm",
    };
    mockTransferredCaseTranslations(request);

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
      })
    );
  });

  it('should fetch transfer info when case id is provided in query', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    mockTransferredCaseTranslations(request);
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'CROSS_COUNTRY',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: false,
        claimantFirstName: 'Peter',
        claimantLastName: 'Rabbit',
        respondentName: "McGregor's Farm",
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).toHaveBeenCalledWith('1234');
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'Cross country body',
      })
    );
  });

  it('should refetch transfer info when session transfer is incomplete', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      transferComplete: false,
    };
    mockTransferredCaseTranslations(request);
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        newEthosCaseReference: '18850001/2020',
        transferComplete: true,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).toHaveBeenCalledWith('1234');
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        replacementCaseNumber: '18850001/2020',
        showNewCaseNumber: true,
      })
    );
  });

  it('should clear stale session transfer info when query case id differs', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '5678' };
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      transferComplete: true,
    };
    mockTransferredCaseTranslations(request);
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '5678',
        originalEthosCaseReference: '70000001/2022',
        transferComplete: true,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(request.session.caseTransferInfo).toEqual(
      expect.objectContaining({
        originalCaseId: '5678',
        originalEthosCaseReference: '70000001/2022',
      })
    );
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        caseNumber: '70000001/2022',
      })
    );
  });

  it('should redirect to not found when no case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to not found when query case id is an array even if session has transfer info', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: ['1234', '5678'] };
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      transferComplete: true,
    };

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
  });

  it('should redirect to not found when transfer info api fails', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest
      .fn()
      .mockRejectedValue(new Error('Error getting case transfer info: status code 404, CaseNotFoundException'));

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to not found when transfer info originalCaseId does not match requested case', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '99999',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should redirect to not found when transfer info says case is not transferred', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND + '?lng=en');
    expect(response.render).not.toHaveBeenCalled();
  });

  it('should use ECM copy when transfer type is missing from transfer info', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    mockTransferredCaseTranslations(request);
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        noAccessBody: 'ECM body',
      })
    );
  });
});
