import axios from 'axios';

import GetCaseDocumentController from '../../../main/controllers/GetCaseDocumentController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { PageUrls, ServiceErrors } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { mockAxiosError } from '../mocks/mockAxios';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockET1SubmittedForm, mockedET1FormDocument, mockedET1FormWelsh } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

const getCaseDocumentController = new GetCaseDocumentController();
const updateCaseDetailsLinkStatuses = jest.spyOn(ET3Util, 'updateCaseDetailsLinkStatuses');

const testDocumentId = '916d3bc2-006a-40ee-a95e-b59eeb14e865';
const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
jest.mock('axios');
const api = new CaseApi(axios);

describe('Get case document controller', () => {
  const response = mockResponse();
  const requestWithDocId = mockRequest({});
  const requestWithDocIdUserCase = mockRequest({});
  updateCaseDetailsLinkStatuses.mockResolvedValueOnce(Promise.resolve(mockCaseWithIdWithRespondents));
  requestWithDocId.params.docId = testDocumentId;
  requestWithDocIdUserCase.params.docId = testDocumentId;
  it('Should forward to not found page when there is no parameter in request', async () => {
    const request = mockRequest({});
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when docId parameter not sent', async () => {
    const request = mockRequest({});
    request.params = { test: 'test' };
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when request session is undefined', async () => {
    const request = mockRequest({});
    request.params = { docId: 'test' };
    request.session = undefined;
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when there is no user case in session', async () => {
    requestWithDocId.session.userCase = undefined;
    await getCaseDocumentController.get(requestWithDocId, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should find document details when user case has et1submitted form and call response.send', async () => {
    requestWithDocIdUserCase.session.userCase.et1SubmittedForm = mockET1SubmittedForm;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(requestWithDocIdUserCase, response);
    expect(response.status(200).send).toHaveBeenCalled();
    expect(requestWithDocIdUserCase.session.userCase).toEqual(mockCaseWithIdWithRespondents);
  });
  it('Should find document details when user case has no et1submitted but has et1 form in document collection', async () => {
    requestWithDocIdUserCase.session.userCase.documentCollection = [mockedET1FormWelsh];
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(requestWithDocIdUserCase, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });
  it('Should forward to not found page when getCaseDocument method throws exception', async () => {
    requestWithDocIdUserCase.session.userCase = mockUserCase;
    requestWithDocIdUserCase.session.userCase.documentCollection = [mockedET1FormWelsh];
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockImplementationOnce(() => {
      throw mockAxiosError('TEST', ServiceErrors.ERROR_DUMMY_DATA, 404);
    });
    await getCaseDocumentController.get(requestWithDocIdUserCase, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when getCaseDocument method not founds any document', async () => {
    requestWithDocIdUserCase.session.userCase.documentCollection = [mockedET1FormWelsh];
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await getCaseDocumentController.get(requestWithDocIdUserCase, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should get content type from document data when there is no content type in documents', async () => {
    const et1Form: ApiDocumentTypeItem = mockedET1FormWelsh;
    et1Form.value.uploadedDocument.document_filename = 'dummy_document_file_name';
    const requestWithUserCase: AppRequest = mockRequest({});
    requestWithUserCase.session.userCase = mockValidCaseWithId;
    requestWithUserCase.session.userCase.documentCollection = [et1Form];
    requestWithUserCase.params.docId = '916d3bc2-006a-40ee-a95e-b59eeb14e865';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(requestWithUserCase, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });
  it('Should find document in selected respondent et3ResponseContestClaimDocument list when not found in document collection', async () => {
    const et1Form = mockedET1FormWelsh;
    et1Form.value.uploadedDocument.document_filename = 'dummy_document_file_name';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[0].et3ResponseContestClaimDocument = [et1Form];
    request.params.docId = '916d3bc2-006a-40ee-a95e-b59eeb14e865';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });
  it('Should forward to not found when selected respondent not found in usercase respondents', async () => {
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 30;

    request.params.docId = '916d3bc2-006a-40ee-a95e-b59eeb14e86';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found when selected respondent index is undefined', async () => {
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = undefined;
    request.params.docId = '916d3bc2-006a-40ee-a95e-b59e';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when respondent collection is empty', async () => {
    const request = mockRequest({});
    request.session.userCase = mockValidCaseWithId;
    request.params.docId = '916d3bc2-006a-40ee-a95e-b59eeb14e86';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
  it('Should forward to not found page when there is no respondent in userCase', async () => {
    const request = mockRequest({});
    request.params.docId = '916d3bc2-006a-40ee-a95e-b59eeb14e8';
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = mockValidCaseWithId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });

  it('Should find document in et3ResponseEmployerClaimDocument when not found in et3ResponseContestClaimDocument', async () => {
    const employerClaimDocId = 'employer-claim-doc-123';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[0].et3ResponseContestClaimDocument = [];
    request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = {
      document_url: `http://dm-store:8080/documents/${employerClaimDocId}`,
      document_filename: 'employer_claim.pdf',
      document_binary_url: `http://dm-store:8080/documents/${employerClaimDocId}/binary`,
      category_id: 'ET3_EMPLOYER_CLAIM',
      upload_timestamp: '2022-10-03T10:00:00',
    };
    request.params.docId = employerClaimDocId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });

  it('Should forward to not found when et3ResponseEmployerClaimDocument docId does not match', async () => {
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[0].et3ResponseContestClaimDocument = [];
    request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = {
      document_url: 'http://dm-store:8080/documents/different-doc-id',
      document_filename: 'employer_claim.pdf',
      document_binary_url: 'http://dm-store:8080/documents/different-doc-id/binary',
      category_id: 'ET3_EMPLOYER_CLAIM',
      upload_timestamp: '2022-10-03T10:00:00',
    };
    request.params.docId = 'requested-doc-id-not-matching';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });

  it('Should skip et3ResponseEmployerClaimDocument when it is empty', async () => {
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[0].et3ResponseContestClaimDocument = [];
    request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
    request.params.docId = 'some-doc-id';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(undefined));
    await getCaseDocumentController.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });

  it('Should check et3ResponseEmployerClaimDocument only when et3ResponseContestClaimDocument is empty', async () => {
    const contestClaimDocId = 'contest-claim-doc-456';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[0].et3ResponseContestClaimDocument = [
      {
        id: contestClaimDocId,
        value: {
          uploadedDocument: {
            document_url: `http://dm-store:8080/documents/${contestClaimDocId}`,
            document_filename: 'contest_claim.pdf',
            document_binary_url: `http://dm-store:8080/documents/${contestClaimDocId}/binary`,
          },
          typeOfDocument: 'ET3 Attachment',
          shortDescription: 'Contest claim document',
        },
      },
    ];
    request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = {
      document_url: 'http://dm-store:8080/documents/employer-claim-789',
      document_filename: 'employer_claim.pdf',
      document_binary_url: 'http://dm-store:8080/documents/employer-claim-789/binary',
      category_id: 'ET3_EMPLOYER_CLAIM',
      upload_timestamp: '2022-10-03T10:00:00',
    };
    request.params.docId = contestClaimDocId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });

  it('Should find another respondent contest claim document by its document store id', async () => {
    const collectionItemId = 'ccd-collection-item-id';
    const documentStoreId = 'dm-store-contest-claim-id';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.documentCollection = [];
    request.session.userCase.respondents[1] = {
      et3ResponseContestClaimDocument: [
        {
          id: collectionItemId,
          value: {
            uploadedDocument: {
              document_url: `http://dm-store:8080/documents/${documentStoreId}`,
              document_filename: 'contest_claim.pdf',
              document_binary_url: `http://dm-store:8080/documents/${documentStoreId}/binary`,
            },
            typeOfDocument: 'ET3 Attachment',
            shortDescription: 'Contest claim document',
          },
        },
      ],
    };
    request.params.docId = documentStoreId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(api.getCaseDocument).toHaveBeenCalledWith(documentStoreId);
    expect(response.status(200).send).toHaveBeenCalled();
  });

  it('Should find another respondent ET3 form when it is not in the document collection', async () => {
    const otherEt3Id = 'other-respondent-et3';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.documentCollection = [];
    request.session.userCase.respondents[1] = {
      et3Form: {
        document_url: `http://dm-store:8080/documents/${otherEt3Id}`,
        document_filename: 'ET3 - Ermintrude Cow.pdf',
        document_binary_url: `http://dm-store:8080/documents/${otherEt3Id}/binary`,
        category_id: 'ET3',
        upload_timestamp: '2026-02-25T10:00:00.000Z',
      },
    };
    request.params.docId = otherEt3Id;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });

  it('Should forward to not found when the document is a respondent support document', async () => {
    const supportDocumentId = 'respondent-support-doc';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.documentCollection = [];
    request.session.userCase.respondents[1] = {
      et3ResponseRespondentSupportDocument: {
        document_url: `http://dm-store:8080/documents/${supportDocumentId}`,
        document_filename: 'Reasonable adjustment.pdf',
        document_binary_url: `http://dm-store:8080/documents/${supportDocumentId}/binary`,
        category_id: 'ET3 Attachment',
        upload_timestamp: '2026-02-24T12:00:00.000Z',
      },
    };
    request.params.docId = supportDocumentId;
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(api.getCaseDocument).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });

  it('Should forward to not found when a support document is copied into the case document list', async () => {
    const supportDocumentId = 'respondent-support-doc-in-collection';
    const request = mockRequest({});
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents[1] = {
      et3ResponseRespondentSupportDocument: {
        document_url: `http://dm-store:8080/documents/${supportDocumentId}`,
        document_filename: 'Reasonable adjustment.pdf',
        document_binary_url: `http://dm-store:8080/documents/${supportDocumentId}/binary`,
        category_id: 'ET3 Attachment',
        upload_timestamp: '2026-02-24T12:00:00.000Z',
      },
    };
    request.session.userCase.documentCollection = [
      {
        id: 'collection-support-doc',
        value: {
          typeOfDocument: 'ET3 Attachment',
          uploadedDocument: {
            document_url: `http://dm-store:8080/documents/${supportDocumentId}`,
            document_filename: 'Reasonable adjustment.pdf',
            document_binary_url: `http://dm-store:8080/documents/${supportDocumentId}/binary`,
          },
        },
      },
    ];
    request.params.docId = 'collection-support-doc';
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(request, response);
    expect(api.getCaseDocument).not.toHaveBeenCalled();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.NOT_FOUND);
  });
});
