import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FormFieldNames, PageUrls, ValidationErrors } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import CollectionUtils from '../utils/CollectionUtils';
import ErrorUtils from '../utils/ErrorUtils';
import FileUtils from '../utils/FileUtils';
import StringUtils from '../utils/StringUtils';

export default class RemoveFileController {
  public get(req: AppRequest, res: Response): void {
    req.session.errors = [];
    const fileId = FileUtils.getFileIdByUrl(req.url);
    if (StringUtils.isBlank(fileId)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.UNABLE_TO_REMOVE_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    }
    if (CollectionUtils.isEmpty(req?.session?.userCase?.et3ResponseContestClaimDocument)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.UNABLE_TO_REMOVE_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    }
    let itemRemoved = false;
    for (const file of req.session.userCase.et3ResponseContestClaimDocument) {
      if (file.id === fileId) {
        const index = req.session.userCase.et3ResponseContestClaimDocument.indexOf(file);
        req.session.userCase.et3ResponseContestClaimDocument.splice(index, 1);
        itemRemoved = true;
      }
    }
    if (!itemRemoved) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.UNABLE_TO_REMOVE_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
    }
    res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
  }
}
