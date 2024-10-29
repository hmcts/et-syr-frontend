import axios from 'axios';

import GetCaseDocumentController from '../../../main/controllers/GetCaseDocumentController';
import { PageUrls, ServiceErrors } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { mockAxiosError } from '../mocks/mockAxios';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
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
  it('Should forward to not found page when docId parameter not sent', async () => {
    const request = mockRequest({});
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
    const et1Form = mockedET1FormWelsh;
    et1Form.value.uploadedDocument.document_filename = 'dummy_document_file_name';
    requestWithDocIdUserCase.session.userCase.documentCollection = [et1Form];
    getCaseApiMock.mockReturnValue(api);
    api.getCaseDocument = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedET1FormDocument));
    await getCaseDocumentController.get(requestWithDocIdUserCase, response);
    expect(response.status(200).send).toHaveBeenCalled();
  });
});
