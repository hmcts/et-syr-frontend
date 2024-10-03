import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls } from '../definitions/constants';
import { setChangeAnswersUrlLanguage, setCheckAnswersLanguage } from '../helpers/LanguageHelper';

export default class ChangeDetailsController {
  public get = (req: AppRequest, res: Response): void => {
    const languageParam = setChangeAnswersUrlLanguage(req);
    if (req.query.redirect === 'answers') {
      req.session.returnUrl = setCheckAnswersLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_ET3);
      return res.redirect(req.url.replace(InterceptPaths.ANSWERS_CHANGE, languageParam));
    } else {
      return res.redirect(ErrorPages.NOT_FOUND);
    }
  };
}
