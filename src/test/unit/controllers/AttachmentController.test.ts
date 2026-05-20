import AttachmentController from '../../../main/controllers/AttachmentController';
import { ErrorPages } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Attachment Controller', () => {
  const getCaseApiMock = jest.spyOn(CaseService, 'getCaseApi');
  (getCaseApiMock as jest.Mock).mockReturnValue(expect.anything());

  it('should redirect to not-found page if document id not provided', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not-found page if wrong document id  provided', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.params.docId = '123456';
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should call getCaseDocument if document id provided is for contact application file', async () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };
    await controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });

  it('should set Content-Type and Content-Length headers and pipe document data to response', async () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };

    const mockPipe = jest.fn();
    const mockDocument = {
      headers: { 'content-type': 'application/pdf', 'content-length': '2048' },
      data: { pipe: mockPipe },
    };
    getCaseApiMock.mockReturnValue({
      getCaseDocument: jest.fn().mockResolvedValue(mockDocument),
    } as unknown as CaseApi);

    await controller.get(request, response);

    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.setHeader).toHaveBeenCalledWith('Content-Length', '2048');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(mockPipe).toHaveBeenCalledWith(response);
  });

  it('should not set Content-Length header when absent from document response', async () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const userCase = {};
    const request = mockRequest({ userCase });
    request.params.docId = '12345';
    request.session.userCase.contactApplicationFile = {
      document_url: 'http.site/12345',
      document_binary_url: 'bdf',
      document_filename: 'dfgdf',
    };

    const mockPipe = jest.fn();
    const mockDocument = {
      headers: { 'content-type': 'application/pdf' },
      data: { pipe: mockPipe },
    };
    getCaseApiMock.mockReturnValue({
      getCaseDocument: jest.fn().mockResolvedValue(mockDocument),
    } as unknown as CaseApi);

    await controller.get(request, response);

    expect(response.setHeader).not.toHaveBeenCalledWith('Content-Length', expect.anything());
    expect(mockPipe).toHaveBeenCalledWith(response);
  });
});
