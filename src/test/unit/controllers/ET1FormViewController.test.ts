import ET1FormViewController from '../../../main/controllers/ET1FormViewController';
import { PageUrls, languages } from '../../../main/definitions/constants';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const et1FormViewController = new ET1FormViewController();
const updateET3DataMock = jest.spyOn(ET3Util, 'updateCaseDetailsLinkStatuses');
describe('ET1 form view controller', () => {
  it('should call response.redirect with welsh et1form url', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.et1FormWelsh = mockedET1FormEnglish;
    request.session.et1FormEnglish = mockedET1FormWelsh;
    request.url = PageUrls.ET1_FORM_VIEW + languages.WELSH_URL_PARAMETER;
    updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
    await et1FormViewController.get(request, response);
    expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
    expect(response.redirect).toHaveBeenCalledWith(mockedET1FormWelsh.value.uploadedDocument.document_binary_url);
  });
  it('should call response.redirect with english et1form url', async () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.et1FormWelsh = mockedET1FormEnglish;
    request.session.et1FormEnglish = mockedET1FormWelsh;
    request.url = PageUrls.ET1_FORM_VIEW;
    updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
    await et1FormViewController.get(request, response);
    expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
    expect(response.redirect).toHaveBeenCalledWith(mockedET1FormEnglish.value.uploadedDocument.document_binary_url);
  });
});
