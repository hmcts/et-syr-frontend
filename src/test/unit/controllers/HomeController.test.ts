import HomeController from '../../../main/controllers/HomeController';
import { PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const homeController = new HomeController();

describe('Introduction controller', () => {
  const t = {
    home: {},
  };

  it('should render the introduction (home) page', () => {
    const response = mockResponse();
    const request = mockRequest({ t });
    const redirectUrl = setUrlLanguage(request, PageUrls.CHECKLIST);
    homeController.get(request, response);

    expect(response.render).toHaveBeenCalledWith('home', {
      ...(<AnyRecord>request.t('home', { returnObjects: true })),
      PageUrls,
      redirectUrl,
      languageParam: '?lng=en',
    });
  });
});
