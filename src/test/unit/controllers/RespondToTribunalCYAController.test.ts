import RespondToTribunalCYAController from '../../../main/controllers/RespondToTribunalCYAController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Tribunal CYA Controller', () => {
  let controller: RespondToTribunalCYAController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToTribunalCYAController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_TRIBUNAL_CYA', () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.selectedGenericTseApplication = mockGenericTseCollection[0];
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_TRIBUNAL_CYA, expect.anything());
    });
  });
});
