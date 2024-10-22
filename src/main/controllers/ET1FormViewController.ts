import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { languages } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { getLanguageParam } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';

export default class ET1FormViewController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    await ET3Util.updateCaseDetailsLinkStatuses(req, ET3CaseDetailsLinkNames.ET1ClaimForm, LinkStatus.VIEWED);
    const languageParam = getLanguageParam(req.url);
    if (languageParam === languages.WELSH_URL_PARAMETER) {
      res.redirect(req.session.et1FormWelsh.value.uploadedDocument.document_binary_url);
    } else {
      res.redirect(req.session.et1FormEnglish.value.uploadedDocument.document_binary_url);
    }
  }
}
