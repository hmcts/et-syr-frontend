import ContactTribunalSubmitController from '../../../main/controllers/ContactTribunalSubmitController';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { getCaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact Tribunal Controller', () => {
  let controller: ContactTribunalSubmitController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalSubmitController();
    req = mockRequest({});
    res = mockResponse();
  });

  it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE with language param', async () => {
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.url = '/some-url';
    await controller.get(req, res);
    expect(req.session.userCase.ruleCopystate).toBe(true);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + '?lng=en');
  });

  it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE with language param when copyToOtherPartyYesOrNo is YES', async () => {
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.url = '/some-url';
    await controller.get(req, res);
    expect(req.session.userCase.ruleCopystate).toBe(true);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + '?lng=en');
  });

  it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE with language param when copyToOtherPartyYesOrNo is NO', async () => {
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
    req.url = '/some-url';
    await controller.get(req, res);
    expect(req.session.userCase.ruleCopystate).toBe(false);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + '?lng=en');
  });

  it('should redirect to NOT_FOUND on error', async () => {
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.url = '/some-url';
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'submitRespondentTse').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
