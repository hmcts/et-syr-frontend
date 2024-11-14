import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { TranslationKeys, languages } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DateUtils from '../utils/DateUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export default class ApplicationSubmittedController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = UrlUtils.getCaseDetailsUrlByRequest(req);
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const selectedRespondent: RespondentET3Model = userCase.respondents[req.session.selectedRespondentIndex];
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
    const attachedDocuments = new Map<string, string>();

    if (userCase.et3ResponseContestClaimDocument) {
      for (const document of userCase.et3ResponseContestClaimDocument) {
        // Find documentId and documentName
        const documentId = DocumentUtils.findDocumentIdByURL(document.value.uploadedDocument.document_url);
        const documentName = document.value.uploadedDocument.document_filename;

        // Add to the attachedDocuments map
        attachedDocuments.set(documentId, documentName);
      }
    }

    if (userCase.et3ResponseEmployerClaimDocument) {
      // Find documentId and documentName
      const documentId = DocumentUtils.findDocumentIdByURL(userCase.et3ResponseEmployerClaimDocument.document_url);
      const documentName = userCase.et3ResponseEmployerClaimDocument.document_filename;

      // Add to the attachedDocuments map
      attachedDocuments.set(documentId, documentName);
    }

    res.render(TranslationKeys.APPLICATION_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_SUBMITTED, { returnObjects: true }),
      et3ResponseSubmitted: DateUtils.formatDateStringToDDMMYYYY(userCase.responseReceivedDate),
      userCase,
      attachedDocuments: Array.from(attachedDocuments, ([id, name]) => ({ id, name })),
      redirectUrl,
      welshEnabled,
      languageParam,
      selectedRespondent,
      et3FormId,
      et3FormName,
    });
  };
}
