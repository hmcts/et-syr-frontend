import axios from 'axios';

import { CaseTypeId } from '../../../main/definitions/case';
import { DefaultValues, ET3ModificationTypes, ServiceErrors } from '../../../main/definitions/constants';
import { HubLinkStatus } from '../../../main/definitions/hub';
import { ET3CaseDetailsLinkNames, ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import { mockAxiosError, mockAxiosErrorWithDataError } from '../mocks/mockAxios';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseApiDataResponse } from '../mocks/mockCaseApiDataResponse';
import {
  mockCaseWithIdWithHubLinkStatuses,
  mockCaseWithIdWithRespondents,
  mockValidCaseWithId,
} from '../mocks/mockCaseWithId';
import { mockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockedET1FormDocument } from '../mocks/mockDocuments';
import { mockValidMulterFile } from '../mocks/mockExpressMulterFile';
import { mockRequest } from '../mocks/mockRequest';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('config');
jest.mock('axios');

describe('Case Service Tests', () => {
  const token = 'testToken';
  const hubLinkStatusesReadyToView = {
    documents: HubLinkStatus.READY_TO_VIEW,
    et1ClaimForm: HubLinkStatus.READY_TO_VIEW,
    hearingDetails: HubLinkStatus.READY_TO_VIEW,
    tribunalOrders: HubLinkStatus.READY_TO_VIEW,
    contactTribunal: HubLinkStatus.READY_TO_VIEW,
    respondentResponse: HubLinkStatus.READY_TO_VIEW,
    tribunalJudgements: HubLinkStatus.READY_TO_VIEW,
    respondentApplications: HubLinkStatus.READY_TO_VIEW,
    requestsAndApplications: HubLinkStatus.READY_TO_VIEW,
  };

  describe('Update draft case', () => {
    it('should update draft case data and return the updated data', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.updateDraftCase(mockCaseWithIdWithHubLinkStatuses);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while updating the draft case', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const axiosError = mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      mockedAxios.put.mockImplementation(() => {
        throw axiosError;
      });
      await expect(() => api.updateDraftCase(mockCaseWithIdWithHubLinkStatuses)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_UPDATING_DRAFT_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Update hub link statuses', () => {
    it('should update all hub link statuses to ready to view', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.updateHubLinksStatuses(mockCaseWithIdWithHubLinkStatuses);
      expect(value.data.case_data.hubLinksStatuses).toEqual(hubLinkStatusesReadyToView);
    });
    it('should throw exception when there is a problem while updating hub link statuses', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockImplementation(() => {
        throw mockAxiosErrorWithDataError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.updateHubLinksStatuses(mockCaseWithIdWithHubLinkStatuses)).rejects.toEqual(
        new Error(
          ServiceErrors.ERROR_UPDATING_HUB_LINKS_STATUSES +
            ServiceErrors.ERROR_CASE_NOT_FOUND +
            ', ' +
            ServiceErrors.ERROR_CASE_NOT_FOUND
        )
      );
    });
  });

  describe('Get case by application request', () => {
    const request = mockRequest({ body: mockValidCaseWithId });
    it('should get case by application request', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.getCaseByApplicationRequest(request);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while getting case data by application request', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getCaseByApplicationRequest(request)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Assign case user role', () => {
    const expectedResponse = 'User roles successfully updated';
    it('should assign case user role', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(expectedResponse);
      const request = mockRequest({
        body: mockValidCaseWithId,
        session: { userCase: mockUserCase, user: mockUserDetails },
      });
      const value = await api.assignCaseUserRole(request);
      expect(value).toEqual(expectedResponse);
    });
    it('should throw exception when there is a problem while updating user role', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      const request = mockRequest({
        body: mockValidCaseWithId,
        session: { userCase: mockUserCase, user: mockUserDetails },
      });
      await expect(() => api.assignCaseUserRole(request)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Get user case', () => {
    const caseId: string = '1234567890123456';
    it('should get user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.getUserCase(caseId);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });
    it('should throw exception when there is a problem while getting user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getUserCase(caseId)).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Get user cases', () => {
    it('should get user cases', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      const value = await api.getUserCases();
      expect(value.data).toEqual([mockCaseApiDataResponse]);
    });
    it('should throw exception when there is a problem while getting user case by case id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.getUserCases()).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Modify ET3 Data', () => {
    it('should modify et3 data', async () => {
      const request = mockRequest({});
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      request.session.user = mockUserDetails;
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      const value = await api.modifyEt3Data(
        request,
        ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
        ET3CaseDetailsLinkNames.RespondentResponse,
        LinkStatus.IN_PROGRESS,
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS
      );
      expect(value.data).toEqual([mockCaseApiDataResponse]);
    });

    it('should throw exception when idamId not exists', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const request = mockRequest({});
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      request.session.user = mockUserDetails;
      request.session.user.id = DefaultValues.STRING_EMPTY;
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      await expect(() =>
        api.modifyEt3Data(
          request,
          ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
          ET3CaseDetailsLinkNames.RespondentResponse,
          LinkStatus.IN_PROGRESS,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS
        )
      ).rejects.toEqual(
        new Error(
          ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE + ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_IDAM_ID_NOT_FOUND
        )
      );
    });

    it('should throw exception when request type not exists', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const request = mockRequest({});
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      request.session.user = mockUserDetails;
      request.session.user.id = '1234';
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      await expect(() =>
        api.modifyEt3Data(
          request,
          DefaultValues.STRING_SPACE,
          ET3CaseDetailsLinkNames.RespondentResponse,
          LinkStatus.IN_PROGRESS,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS
        )
      ).rejects.toEqual(
        new Error(
          ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE +
            ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_REQUEST_TYPE_NOT_FOUND
        )
      );
    });

    it('should throw exception when respondent not found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const request = mockRequest({});
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = undefined;
      request.session.user = mockUserDetails;
      request.session.user.id = '123';
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponseList);
      await expect(() =>
        api.modifyEt3Data(
          request,
          ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
          ET3CaseDetailsLinkNames.RespondentResponse,
          LinkStatus.IN_PROGRESS,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS
        )
      ).rejects.toEqual(
        new Error(
          ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE +
            ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE_RESPONDENT_NOT_FOUND
        )
      );
    });
    it('should throw exception when there is a problem while updating case details on axios', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const request = mockRequest({});
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      request.session.user = mockUserDetails;
      mockedAxios.post.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() =>
        api.modifyEt3Data(
          request,
          ET3ModificationTypes.MODIFICATION_TYPE_UPDATE,
          ET3CaseDetailsLinkNames.RespondentResponse,
          LinkStatus.IN_PROGRESS,
          ET3HubLinkNames.ContactDetails,
          LinkStatus.IN_PROGRESS
        )
      ).rejects.toEqual(new Error(ServiceErrors.ERROR_MODIFYING_SUBMITTED_CASE + ServiceErrors.ERROR_CASE_NOT_FOUND));
    });
  });

  describe('Check ethos case reference', () => {
    it('should return true when case details found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithStringTrueResponse);
      const value = await api.checkEthosCaseReference('6000032/2024');
      expect(value.data).toEqual('true');
    });
    it('should return false when case details not found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithStringFalseResponse);
      const value = await api.checkEthosCaseReference('6000032/2024');
      expect(value.data).toEqual('false');
    });
    it('should throw exception when there is a problem while checking ethos case reference', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.checkEthosCaseReference('6000032/2024')).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Check id', () => {
    it('should return true when case details found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithStringTrueResponse);
      const value = await api.checkIdAndState('1234567891234567');
      expect(value.data).toEqual('true');
    });
    it('should return false when case details not found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithStringFalseResponse);
      const value = await api.checkIdAndState('1234567891234567');
      expect(value.data).toEqual('false');
    });
    it('should throw exception when there is a problem while checking id', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.checkIdAndState('1234567891234567')).rejects.toEqual(
        new Error(ServiceErrors.ERROR_GETTING_USER_CASES + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });

  describe('Axios get to download case document', () => {
    it('should send get request to the correct api endpoint with the document id passed in the param', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.get.mockResolvedValue(mockedET1FormDocument);
      const document = await api.getCaseDocument('docId');
      expect(mockedAxios.get).toHaveBeenCalled();
      expect(document).toEqual(mockedET1FormDocument);
    });
  });

  describe('uploadFile', () => {
    test('Should upload file when file is valid', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithDocumentUploadResponse);
      const uploadedDocument = await api.uploadDocument(mockValidMulterFile, CaseTypeId.ENGLAND_WALES);
      expect(uploadedDocument.data).toEqual(mockDocumentUploadResponse);
    });
    test('Should throw error when can not upload file', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.post.mockImplementationOnce(() => {
        throw new Error('Error uploading document');
      });
      await expect(() => api.uploadDocument(mockValidMulterFile, CaseTypeId.ENGLAND_WALES)).rejects.toEqual(
        new Error('Error uploading document: Error uploading document')
      );
    });
  });

  describe('getCaseApi', () => {
    test('should create a CaseApi', () => {
      expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
    });
  });

  describe('Submit respondent tse', () => {
    const request = mockRequest({
      session: { userCase: mockUserCase, user: mockUserDetails },
    });

    it('should submit respondent tse application successfully', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockResolvedValue(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      const value = await api.submitRespondentTse(request);
      expect(value.data).toEqual(mockCaseApiDataResponse);
    });

    it('should throw exception when there is a problem while submitting respondent tse application', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      mockedAxios.put.mockImplementation(() => {
        throw mockAxiosError('TEST', ServiceErrors.ERROR_CASE_NOT_FOUND, 404);
      });
      await expect(() => api.submitRespondentTse(request)).rejects.toEqual(
        new Error('Error submitting respondent tse application: ' + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });

    it('should throw exception when application type is not found', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      request.session.userCase.contactApplicationType = 'InvalidType';
      await expect(() => api.submitRespondentTse(request)).rejects.toEqual(
        new Error('Error submitting respondent tse application: ' + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });

    it('should throw exception when userCase is not found in session', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      const invalidRequest = mockRequest({
        session: { user: mockUserDetails },
      });
      await expect(() => api.submitRespondentTse(invalidRequest)).rejects.toEqual(
        new Error('Error submitting respondent tse application: ' + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });

    it('should throw exception when contactApplicationType is not found in userCase', async () => {
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      const api = new CaseApi(mockedAxios);
      request.session.userCase.contactApplicationType = undefined;
      await expect(() => api.submitRespondentTse(request)).rejects.toEqual(
        new Error('Error submitting respondent tse application: ' + ServiceErrors.ERROR_CASE_NOT_FOUND)
      );
    });
  });
});
