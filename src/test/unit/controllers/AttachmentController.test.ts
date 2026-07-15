import AttachmentController from '../../../main/controllers/AttachmentController';
import { ErrorPages } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Attachment Controller', () => {
  const getCaseApiMock = jest.spyOn(CaseService, 'getCaseApi');
  const getCaseDocumentMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (getCaseApiMock as jest.Mock).mockReturnValue({ getCaseDocument: getCaseDocumentMock });
  });

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
    getCaseDocumentMock.mockResolvedValue({ headers: {}, data: 'test-data' });
    await controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
    expect(getCaseDocumentMock).toHaveBeenCalledWith('12345');
  });

  it('should set document content type when the document response includes one', async () => {
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
    getCaseDocumentMock.mockResolvedValue({ headers: { 'content-type': 'application/pdf' }, data: 'test-data' });
    await controller.get(request, response);
    expect(response.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith(Buffer.from('test-data', 'binary'));
  });
});
