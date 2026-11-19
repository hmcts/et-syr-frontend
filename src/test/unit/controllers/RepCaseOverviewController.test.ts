import RepCaseOverviewController from '../../../main/controllers/RepCaseOverviewController';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

describe('RepCaseOverviewController', () => {
  let controller: RepCaseOverviewController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;

  beforeEach(() => {
    controller = new RepCaseOverviewController();
    response = mockResponse();
    request = mockRequest({ userCase: mockUserCase });
    request.session.selectedRespondentIndex = 0;
    request.session.userCase.respondents = [{ respondentName: 'Jane Doe' }];
  });

  describe('GET method', () => {
    it('should render the Rep case overview page', async () => {
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.REP_CASE_OVERVIEW,
        expect.objectContaining({
          userCase: request.session.userCase,
          respondentName: 'Jane Doe',
          progressBarItems: expect.any(Array),
          sections: expect.any(Array),
          hideContactUs: true,
        })
      );
    });
  });
});
