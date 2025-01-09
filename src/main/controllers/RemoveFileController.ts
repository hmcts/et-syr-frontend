import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FormFieldNames, PageUrls, ValidationErrors } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { returnValidUrl } from '../helpers/RouterHelpers';
import CollectionUtils from '../utils/CollectionUtils';
import ErrorUtils from '../utils/ErrorUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export default class RemoveFileController {
  public get(req: AppRequest, res: Response): void {
    req.session.errors = [];
    const fileId = req.params.fileId;
    req.url = UrlUtils.removeParameterFromUrl(
      req.url,
      UrlUtils.findParameterWithValueByParameterName(req.url, 'fileId')
    );
    if (StringUtils.isBlank(fileId)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.UNABLE_TO_REMOVE_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
    }
    if (CollectionUtils.isEmpty(req?.session?.userCase?.et3ResponseContestClaimDocument)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.UNABLE_TO_REMOVE_FILE,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
    }
    if (req.params.contestClaimDetails !== 'undefined' && StringUtils.isNotBlank(req.params.contestClaimDetails)) {
      req.session.userCase.et3ResponseContestClaimDetails = req.params.contestClaimDetails;
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
    res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
  }
}
