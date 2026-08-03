import SubmitBundlesHearingDocsCYAController from '../../../main/controllers/SubmitBundlesHearingDocsCYAController';
import { AgreedDocuments } from '../../../main/definitions/case';
import { PageUrls, languages } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Submit bundles hearing docs CYA controller', () => {
  const submitBundlesHearingDoc = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue({
      submitBundlesHearingDoc,
    } as unknown as ReturnType<typeof CaseService.getCaseApi>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should submit bundles, clear session fields and redirect to completed page', async () => {
    const controller = new SubmitBundlesHearingDocsCYAController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.bundlesRespondentAgreedDocWith = AgreedDocuments.YES;
    request.session.userCase.hearingDocumentsAreFor = 'hearing-1';
    request.session.userCase.hearingDocument = {
      document_url: 'http://dm/documents/doc-1',
      document_filename: 'Hearing Doc1.pdf',
      document_binary_url: 'http://dm/documents/doc-1/binary',
    };
    request.url = InterceptPathsSubmitUrl();

    await controller.get(request, response);

    expect(submitBundlesHearingDoc).toHaveBeenCalled();
    expect(request.session.userCase.hearingDocument).toBeUndefined();
    expect(request.session.userCase.bundlesRespondentAgreedDocWith).toBeUndefined();
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.BUNDLES_COMPLETED + languages.ENGLISH_URL_PARAMETER);
  });
});

function InterceptPathsSubmitUrl(): string {
  return '/submitBundlesHearingDocsCya' + languages.ENGLISH_URL_PARAMETER;
}
