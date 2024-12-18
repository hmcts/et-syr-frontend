import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class ContactTribunalSubmitController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_CONFIRMATION + getLanguageParam(req.url));
  }
}
