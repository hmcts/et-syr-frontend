import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { ErrorPages, InterceptPaths, PageUrls, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Change Details Controller', () => {
  it('should redirect to the correct respondent page and should set request.session.returnUrl to PageUrls.CheckAnswers', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.ANSWERS_CHANGE;
    request.query = {
      redirect: 'answers',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.CHECK_YOUR_ANSWERS_ET3 + languages.ENGLISH_URL_PARAMETER);
    expect(response.redirect).toHaveBeenCalledWith(
      '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect to the not found page if req.query.redirect is not "answers"', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.ANSWERS_CHANGE;
    request.query = {
      redirect: 'invalid', // This triggers the else block
    };

    controller.get(request, response);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
