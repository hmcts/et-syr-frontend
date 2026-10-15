import OtherRespondentsEt3Controller from '../../../main/controllers/OtherRespondentsEt3Controller';
import { Et3ResponseStatus, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../../../main/definitions/links';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/helpers/RouterHelpers');
jest.mock('../../../main/modules/featureFlag/launchDarkly');

describe('Other respondents ET3 controller', () => {
  const controller = new OtherRespondentsEt3Controller();
  const response = mockResponse();
  const request = mockRequest({});

  beforeEach(() => {
    request.url = '/other-respondents-et3';
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents = [
      { responseStatus: 'Submitted' },
      {
        responseStatus: Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED,
        et3Form: {
          document_url: 'http://dm-store/documents/other-et3',
          document_filename: 'ET3 - Ermintrude Cow.pdf',
          document_binary_url: 'http://dm-store/documents/other-et3/binary',
          category_id: 'ET3',
          upload_timestamp: '2026-02-25T10:00:00.000Z',
        },
      },
    ];
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.OTHER_RESPONDENTS_ET3);
    (getLanguageParam as jest.Mock).mockReturnValue('');
    (getFlagValue as jest.Mock).mockResolvedValue(true);
    (request.t as unknown as jest.Mock).mockReturnValue({
      h1: "Other respondent's ET3",
      h2: 'Response related information',
      et3FormText: 'ET3 Form',
      et3AttachmentText: 'ET3 attachment',
      acceptanceLetter: 'Response accepted',
      contact: 'Contact',
    });
    jest.spyOn(ET3Util, 'refreshRequestUserCase').mockResolvedValue(undefined);
    jest.spyOn(ET3Util, 'updateCaseDetailsLinkStatuses').mockResolvedValue(request.session.userCase);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the other respondent ET3 page and marks the hub link viewed', async () => {
    await controller.get(request, response);

    expect(ET3Util.updateCaseDetailsLinkStatuses).toHaveBeenCalledWith(
      request,
      ET3CaseDetailsLinkNames.OtherRespondentEt3,
      LinkStatus.VIEWED
    );
    expect(
      request.session.userCase.respondents[0].et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.OtherRespondentEt3]
    ).toBe(LinkStatus.VIEWED);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.OTHER_RESPONDENTS_ET3,
      expect.objectContaining({
        hideContactUs: true,
        redirectUrl: PageUrls.OTHER_RESPONDENTS_ET3,
        welshEnabled: true,
        tableRows: expect.any(Array),
      })
    );
  });

  it('does not update the hub link when there is no accepted co-respondent ET3', async () => {
    request.session.userCase.respondents[1].responseStatus = 'Submitted';

    await controller.get(request, response);

    expect(ET3Util.updateCaseDetailsLinkStatuses).not.toHaveBeenCalled();
  });
});
