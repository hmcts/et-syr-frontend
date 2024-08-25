import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { getUserCasesByLastModified } from '../services/CaseSelectionService';
import CollectionUtils from '../utils/CollectionUtils';
import LanguageUtils from '../utils/LanguageUtils';

export default class RespondentCaseListCheckController {
  /**
   * Tries to get the list of user cases ordered by last modification date.
   * If unable to find any case forwards to self assignment form else forwards to respondent replies list page
   * according to the selected language in the url field of the request object.
   * @param req request object
   * @param res response object
   */
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCases = await getUserCasesByLastModified(req);
    if (CollectionUtils.isNotEmpty<CaseWithId>(userCases)) {
      return res.redirect(PageUrls.RESPONDENT_REPLIES + LanguageUtils.findLanguageUrlParameterInGivenUrl(req.url));
    } else {
      return res.redirect(PageUrls.SELF_ASSIGNMENT_FORM + LanguageUtils.findLanguageUrlParameterInGivenUrl(req.url));
    }
  }
}
