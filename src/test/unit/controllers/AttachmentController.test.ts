import AttachmentController from '../../../main/controllers/AttachmentController';
import { ErrorPages } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Attachment Controller', () => {
  const getCaseApiMock = jest.spyOn(CaseService, 'getCaseApi');

  const setupValidRequest = () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http://site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    return { request, response };
  };

  it('should redirect to not-found page if document id not provided', () => {
    (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not-found page if wrong document id provided', () => {
    (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.params.docId = '123456';
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not-found page when getCaseDocument throws an error', async () => {
    (getCaseApiMock as jest.Mock).mockReturnValue({
      getCaseDocument: jest.fn().mockRejectedValue(new Error('Service unavailable')),
    });
    const controller = new AttachmentController();
    const { request, response } = setupValidRequest();
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should set content-type header and send document binary when getCaseDocument resolves', async () => {
    const mockDocument = {
      data: 'binaryDocumentData',
      headers: { 'content-type': 'application/pdf' },
    };
    (getCaseApiMock as jest.Mock).mockReturnValue({
      getCaseDocument: jest.fn().mockResolvedValue(mockDocument),
    });
    const controller = new AttachmentController();
    const { request, response } = setupValidRequest();
    await controller.get(request, response);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(Buffer.from('binaryDocumentData', 'binary'));
  });

  it('should redirect to not-found page when getCaseDocument resolves with no document', async () => {
    (getCaseApiMock as jest.Mock).mockReturnValue({
      getCaseDocument: jest.fn().mockResolvedValue(undefined),
    });
    const controller = new AttachmentController();
    const { request, response } = setupValidRequest();
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should call getCaseApi with undefined token when user is not in session', async () => {
    const mockGetCaseDocument = jest.fn().mockResolvedValue({
      data: 'binaryDocumentData',
      headers: { 'content-type': 'application/pdf' },
    });
    (getCaseApiMock as jest.Mock).mockReturnValue({ getCaseDocument: mockGetCaseDocument });
    const controller = new AttachmentController();
    const { request, response } = setupValidRequest();
    request.session.user = undefined;
    await controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalledWith(undefined);
  });
});
