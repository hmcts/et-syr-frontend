import { nextTick } from 'process';

import axios from 'axios';

import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
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

describe('Transferred Case Controller tests', () => {
  beforeEach(() => {
    caseApi.getCaseTransferInfo = jest.fn();
  });

  it('should render the transferred case page with transfer info from session', async () => {
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

    await controller.get(request, response);

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

    await controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
      })
    );
  });

  it('should build the page heading from transfer info api party names', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
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
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: true,
        claimantFirstName: 'Peter',
        claimantLastName: 'Rabbit',
        respondentName: "McGregor's Farm",
      } as CaseTransferInfoResponse,
    });

    await controller.get(request, response);
    await new Promise(nextTick);

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

  it('should render fallback page when transfer info cannot be loaded but case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
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
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should redirect to not found when transfer info cannot be loaded and no case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    await controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });
});
