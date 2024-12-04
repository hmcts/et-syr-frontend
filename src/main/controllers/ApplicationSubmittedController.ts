import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys, et3AttachmentDocTypes, languages } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtils from '../utils/DateUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ObjectUtils from '../utils/ObjectUtils';
import RespondentUtils from '../utils/RespondentUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export default class ApplicationSubmittedController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = UrlUtils.getCaseDetailsUrlByRequest(req);
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    let et3FormId = '';
    let et3FormName = '';
    if (
      ObjectUtils.isNotEmpty(selectedRespondent) &&
      languages.WELSH_URL_PARAMETER === languageParam &&
      ObjectUtils.isNotEmpty(selectedRespondent.et3FormWelsh) &&
      StringUtils.isNotBlank(selectedRespondent.et3FormWelsh.document_url)
    ) {
      et3FormId = DocumentUtils.findDocumentIdByURL(selectedRespondent.et3FormWelsh.document_url);
      et3FormName = selectedRespondent.et3FormWelsh.document_filename;
    } else if (
      ObjectUtils.isNotEmpty(selectedRespondent) &&
      languages.ENGLISH_URL_PARAMETER === languageParam &&
      ObjectUtils.isNotEmpty(selectedRespondent.et3Form) &&
      StringUtils.isNotBlank(selectedRespondent.et3Form.document_url)
    ) {
      et3FormId = DocumentUtils.findDocumentIdByURL(selectedRespondent.et3Form.document_url);
      et3FormName = selectedRespondent.et3Form.document_filename;
    }

    // Initialize attachedDocuments as a Map
    let attachedDocuments = DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(
      selectedRespondent.et3ResponseContestClaimDocument,
      et3AttachmentDocTypes
    );

    if (selectedRespondent.et3ResponseEmployerClaimDocument) {
      // Find documentId and documentName
      const documentId = DocumentUtils.findDocumentIdByURL(
        selectedRespondent.et3ResponseEmployerClaimDocument.document_url
      );
      const documentName = selectedRespondent.et3ResponseEmployerClaimDocument.document_filename;

      attachedDocuments =
        attachedDocuments + '<a href="getCaseDocument/' + documentId + '" target="_blank">' + documentName + '</a><br>';
    }

    res.render(TranslationKeys.APPLICATION_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_SUBMITTED, { returnObjects: true }),
      et3ResponseSubmitted: DateUtils.formatDateStringToDDMMYYYY(userCase.responseReceivedDate),
      userCase,
      attachedDocuments,
      redirectUrl,
      welshEnabled,
      languageParam,
      selectedRespondent,
      et3FormId,
      et3FormName,
    });
  };
}
