import ContactTribunalCYAController from '../../../main/controllers/ContactTribunalCYAController';
import { InterceptPaths, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Contact Tribunal CYA Controller', () => {
  let controller: ContactTribunalCYAController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ContactTribunalCYAController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page CONTACT_TRIBUNAL_CYA', () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.contactApplicationType = 'Change personal details';
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CONTACT_TRIBUNAL_CYA, expect.anything());
    });
  });

  it('should include ethosCaseReference in the response', () => {
    request.session.userCase = mockUserCase;
    request.session.userCase.ethosCaseReference = '12345';
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_TRIBUNAL_CYA,
      expect.objectContaining({
        ethosCaseReference: '12345',
      })
    );
  });

  it('should include cancelLink in the response', () => {
    request.session.userCase = mockUserCase;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_TRIBUNAL_CYA,
      expect.objectContaining({
        cancelLink: expect.any(String),
      })
    );
  });

  it('should include cyaContent in the response', () => {
    request.session.userCase = mockUserCase;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_TRIBUNAL_CYA,
      expect.objectContaining({
        cyaContent: expect.any(Object),
      })
    );
  });

  it('should include submitLink in the response', () => {
    request.session.userCase = mockUserCase;
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CONTACT_TRIBUNAL_CYA,
      expect.objectContaining({
        submitLink: expect.stringContaining(InterceptPaths.CONTACT_TRIBUNAL_SUBMIT),
      })
    );
  });
});
