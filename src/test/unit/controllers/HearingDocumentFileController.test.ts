import HearingDocumentFileController from '../../../main/controllers/HearingDocumentFileController';
import { ErrorPages, PageUrls, languages } from '../../../main/definitions/constants';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document File controller', () => {
  it('should remove the uploaded hearing document and redirect back to upload page', () => {
    const controller = new HearingDocumentFileController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.hearingDocument = {
      document_url: 'http://test',
      document_filename: 'Hearing Doc1.pdf',
      document_binary_url: 'http://test/binary',
    };
    request.params.hearingId = '12345-abc-12345';
    request.url = PageUrls.HEARING_DOCUMENT_REMOVE + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(request.session.userCase.hearingDocument).toBeUndefined();
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', '12345-abc-12345') + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to not found when hearing id is invalid', () => {
    const controller = new HearingDocumentFileController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.params.hearingId = 'missing-hearing';
    request.url = PageUrls.HEARING_DOCUMENT_REMOVE + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
  });
});
