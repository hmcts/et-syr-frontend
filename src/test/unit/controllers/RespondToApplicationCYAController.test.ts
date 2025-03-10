import RespondToApplicationCYAController from '../../../main/controllers/RespondToApplicationCYAController';
import { YesOrNo } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import respondToApplicationCheckYourAnswersJson from '../../../main/resources/locales/en/translation/respond-to-application-check-your-answers.json';
import { mockGenericTseCollection } from '../mocks/mockGenericTseCollection';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('Respond to Application CYA Controller', () => {
  const translationJsons = { ...commonJson, ...respondToApplicationCheckYourAnswersJson };
  let controller: RespondToApplicationCYAController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondToApplicationCYAController();
    request = mockRequestWithTranslation({}, translationJsons);
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page RESPOND_TO_APPLICATION_CYA', () => {
      request.session.userCase = mockUserCase;
      request.session.userCase.selectedGenericTseApplication = mockGenericTseCollection[0];
      request.session.userCase.hasSupportingMaterial = YesOrNo.NO;
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPOND_TO_APPLICATION_CYA, expect.anything());
    });
  });
});
