import { EnglishOrWelsh } from '../definitions/case';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, DefaultValues, languages } from '../definitions/constants';

import NumberUtils from './NumberUtils';

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
        tmpDocument.value?.documentType === AllDocumentTypes.ET1 &&
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
          tmpDocument.value?.documentType === AllDocumentTypes.ACAS_CERT) &&
        tmpDocument.value?.uploadedDocument?.document_filename?.includes(
          NumberUtils.formatAcasNumberDashToUnderscore(acasNumber)
        )
      ) {
        return tmpDocument;
      }
    }
    return undefined;
  }
}
