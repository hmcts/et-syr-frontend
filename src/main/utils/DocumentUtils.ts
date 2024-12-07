import { EnglishOrWelsh } from '../definitions/case';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, DefaultValues, languages } from '../definitions/constants';

import CollectionUtils from './CollectionUtils';
import NumberUtils from './NumberUtils';
import StringUtils from './StringUtils';

export default class DocumentUtils {
  public static findET1DocumentByLanguage(
    documentCollection: ApiDocumentTypeItem[],
    language: string
  ): ApiDocumentTypeItem {
    if (!documentCollection) {
      return undefined;
    }
    for (const tmpDocument of documentCollection) {
      if (
        (tmpDocument.value?.documentType === AllDocumentTypes.ET1 ||
          tmpDocument.value?.typeOfDocument === AllDocumentTypes.ET1) &&
        ((language === languages.WELSH_URL_PARAMETER &&
          tmpDocument.value?.uploadedDocument?.document_filename?.includes(EnglishOrWelsh.WELSH)) ||
          ((language === languages.ENGLISH_URL_PARAMETER ||
            language === DefaultValues.STRING_EMPTY ||
            language === undefined) &&
            !tmpDocument.value?.uploadedDocument?.document_filename?.includes(EnglishOrWelsh.WELSH)))
      ) {
        return tmpDocument;
      }
    }
    return undefined;
  }

  public static findAcasCertificateByAcasNumber(
    documentCollection: ApiDocumentTypeItem[],
    acasNumber: string
  ): ApiDocumentTypeItem {
    if (!documentCollection) {
      return undefined;
    }
    for (const tmpDocument of documentCollection) {
      if (
        (tmpDocument.value?.documentType === AllDocumentTypes.ACAS_CERT ||
          tmpDocument.value?.typeOfDocument === AllDocumentTypes.ACAS_CERT) &&
        (tmpDocument.value?.uploadedDocument?.document_filename?.includes(
          NumberUtils.formatAcasNumberDashToUnderscore(acasNumber)
        ) ||
          tmpDocument.value?.uploadedDocument?.document_filename?.includes(
            NumberUtils.formatAcasNumberDashToEmptyString(acasNumber)
          ))
      ) {
        return tmpDocument;
      }
    }
    return undefined;
  }

  public static findDocumentIdByURL(url: string): string {
    if (StringUtils.isBlank(url) || !url.includes(DefaultValues.STRING_SLASH)) {
      return undefined;
    }
    return url?.substring(url?.lastIndexOf('/') + 1);
  }

  public static getDocumentsWithTheirLinksByDocumentTypes(
    documents: DocumentTypeItem[],
    documentTypes: string[]
  ): string {
    if (CollectionUtils.isEmpty(documents) || CollectionUtils.isEmpty(documentTypes)) {
      return DefaultValues.STRING_EMPTY;
    }
    let attachmentsIncluded = '';
    for (const documentTypeItem of documents) {
      if (
        StringUtils.isNotBlank(documentTypeItem.value?.typeOfDocument) &&
        documentTypes.includes(documentTypeItem.value.typeOfDocument) &&
        StringUtils.isNotBlank(documentTypeItem.id) &&
        StringUtils.isNotBlank(documentTypeItem.value.uploadedDocument?.document_filename)
      ) {
        attachmentsIncluded =
          attachmentsIncluded +
          '<a href="getCaseDocument/' +
          documentTypeItem.id +
          '" target="_blank">' +
          documentTypeItem.value.uploadedDocument.document_filename +
          '</a><br>';
      }
    }
    return attachmentsIncluded;
  }

  public static sanitizeDocumentName(documentName: string): string {
    if (StringUtils.isBlank(documentName)) {
      return DefaultValues.STRING_EMPTY;
    }
    let sanitizedDocumentName = documentName;
    for (const charToRemove of DefaultValues.DOCUMENT_CHARS_TO_REPLACE) {
      sanitizedDocumentName = sanitizedDocumentName.replace(charToRemove, DefaultValues.STRING_EMPTY);
    }
    return sanitizedDocumentName.trim();
  }

  public static removeFileFromDocumentCollectionByFileName(
    documentCollection: ApiDocumentTypeItem[],
    fileName: string
  ): void {
    if (StringUtils.isBlank(fileName)) {
      return;
    }
    if (CollectionUtils.isEmpty(documentCollection)) {
      documentCollection = [];
    }
    const uploadedDocumentIndex: number = documentCollection
      .map(document => document?.value?.uploadedDocument?.document_filename)
      .indexOf(fileName);
    CollectionUtils.removeItemFromCollectionByIndex(documentCollection, uploadedDocumentIndex);
  }
}
