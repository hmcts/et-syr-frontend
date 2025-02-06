import AttachmentController from '../../../main/controllers/AttachmentController';
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
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should redirect to not-found page if wrong document id  provided', () => {
    const controller = new AttachmentController();
    const response = mockResponse();
    const request = mockRequest({});
    request.params.docId = '123456';
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should call getCaseDocument if document id provided is for contact application file', () => {
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
    controller.get(request, response);
    expect(getCaseApiMock).toHaveBeenCalled();
  });
});
