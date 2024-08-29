import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';

export default class NewSelfAssignmentRequestController {
  /**
   * Removes request's case data values to assign a new case.
   * @param req request object that has case data
   * @param res response object to redirect to self assignment form page
   */
  public async get(req: AppRequest, res: Response): Promise<void> {
    req.session.userCase = <CaseWithId>{
      createdDate: DefaultValues.STRING_EMPTY,
      lastModified: DefaultValues.STRING_EMPTY,
      state: undefined,
      id: DefaultValues.STRING_EMPTY,
      respondentName: DefaultValues.STRING_EMPTY,
      firstName: DefaultValues.STRING_EMPTY,
      lastName: DefaultValues.STRING_EMPTY,
    };
    res.redirect(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_FORM));
  }
}
