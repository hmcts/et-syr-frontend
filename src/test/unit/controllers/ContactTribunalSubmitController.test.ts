import ContactTribunalSubmitController from '../../../main/controllers/ContactTribunalSubmitController';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
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
});
