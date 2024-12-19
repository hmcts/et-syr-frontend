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
});
