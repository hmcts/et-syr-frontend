import { AppRequest } from '../definitions/appRequest';
import { EnglishOrWelsh, RespondentET3Model } from '../definitions/case';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, DefaultValues, languages } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';

import CollectionUtils from './CollectionUtils';
import DateUtils from './DateUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';
import RespondentUtils from './RespondentUtils';
import StringUtils from './StringUtils';

export default class DocumentUtils {
  /**
   * Tries to find ET1 form by the given language and document collection. First checks if document collection is empty
   * or not. If empty returns undefined. If not empty tries to find ET1 form by given language. To discriminate ET1 form
   * checks if document type is ET1 or not. If it finds any document with type ET1 according to selected language
   * returns document. If selected language is Welsh and not able to find any ET1 form in Welsh but finds in English
   * returns ET1 form in english.
   * @param documentCollection is the all case documents that should have ET1 form.
   * @param language is the parameter that we check for the document language.
   * @return ET1 form by the given language in ApiDocumentTypeItemFormat.
   */
  public static findET1FormByLanguageAsApiDocumentTypeItem(
    documentCollection: ApiDocumentTypeItem[],
    language: string
  ): ApiDocumentTypeItem {
    if (CollectionUtils.isEmpty(documentCollection)) {
      return undefined;
    }
    for (const tmpDocument of documentCollection) {
      if (
        (tmpDocument.value?.documentType === AllDocumentTypes.ET1 ||
          tmpDocument.value?.typeOfDocument === AllDocumentTypes.ET1) &&
        (((language === languages.WELSH_URL_PARAMETER || language === languages.WELSH_URL_POSTFIX) &&
          tmpDocument.value?.uploadedDocument?.document_filename?.includes(EnglishOrWelsh.WELSH)) ||
          ((language === languages.ENGLISH_URL_PARAMETER ||
            language === languages.ENGLISH_URL_POSTFIX ||
            language === DefaultValues.STRING_EMPTY ||
            language === undefined) &&
            !tmpDocument.value?.uploadedDocument?.document_filename?.includes(EnglishOrWelsh.WELSH)))
      ) {
        return tmpDocument;
      }
    }
    return undefined;
  }

  /**
   * Finds acas certificate by the given session request. First checks if session request's user case document
   * collection. If it is empty returns undefined value. Then tries to find acas certificate number. If it finds acas
   * certificate number in session user case or in selected respondent sets this number to acas number variable and
   * searches acas certificate in the document collection with acas certificate number formats as R123456_78_90 or
   * R1234567890 or R123456/78/90. When finds any acas document returns this document else returns undefined.
   * @param request is the request item in the session which has acas certificate value
   * @return acas certificate according to the acas number in request object.
   */
  public static findAcasCertificateByRequest(request: AppRequest): ApiDocumentTypeItem {
    if (CollectionUtils.isEmpty(request?.session?.userCase?.documentCollection)) {
      return undefined;
    }
    let acasNumber: string = request.session.userCase.acasCertNum;
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(request);
    if (StringUtils.isBlank(acasNumber) && ObjectUtils.isNotEmpty(selectedRespondent)) {
      if (StringUtils.isNotBlank(selectedRespondent.acasCertNum)) {
        acasNumber = selectedRespondent.acasCertNum;
      }
      if (StringUtils.isBlank(acasNumber) && StringUtils.isNotBlank(selectedRespondent.respondentACAS)) {
        acasNumber = selectedRespondent.respondentACAS;
      }
    }
    if (StringUtils.isBlank(acasNumber)) {
      return undefined;
    }
    for (const tmpDocument of request.session.userCase.documentCollection as ApiDocumentTypeItem[]) {
      if (
        (tmpDocument.value?.documentType === AllDocumentTypes.ACAS_CERT ||
          tmpDocument.value?.typeOfDocument === AllDocumentTypes.ACAS_CERT) &&
        (tmpDocument.value?.uploadedDocument?.document_filename?.includes(acasNumber) ||
          tmpDocument.value?.uploadedDocument?.document_filename?.includes(
            NumberUtils.formatAcasNumberDashToUnderscore(acasNumber)
          ) ||
          tmpDocument.value?.uploadedDocument?.document_filename?.includes(
            NumberUtils.formatAcasNumberDashToEmptyString(acasNumber)
          ))
      ) {
        request.session.selectedAcasCertificate = tmpDocument;
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

  /**
   * Finds ET3 Form id with the given request. First checks if request has a selected respondent.
   * If not returns undefined value. Then gets language parameter. If language parameter is Welsh (lng=cy?)
   * then checks selected respondent has Welsh form or not. If selected respondent has Welsh form returns this form's
   * id. If not has Welsh form or selected language is not Welsh then checks if selected respondent has et3 form in
   * English. If it has English et3 form returns this form if not returns undefined.
   * @param req request object in the session.
   * @return et3 form id if found, else undefined.
   */
  public static findET3FormIdByRequest(req: AppRequest): string {
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    if (ObjectUtils.isEmpty(selectedRespondent)) {
      return undefined;
    }
    const languageParam: string = getLanguageParam(req.url);
    if (
      languages.WELSH_URL_PARAMETER === languageParam &&
      ObjectUtils.isNotEmpty(selectedRespondent.et3FormWelsh) &&
      StringUtils.isNotBlank(selectedRespondent.et3FormWelsh.document_url)
    ) {
      return DocumentUtils.findDocumentIdByURL(selectedRespondent.et3FormWelsh.document_url);
    }
    if (
      ObjectUtils.isNotEmpty(selectedRespondent.et3Form) &&
      StringUtils.isNotBlank(selectedRespondent.et3Form.document_url)
    ) {
      return DocumentUtils.findDocumentIdByURL(selectedRespondent.et3Form.document_url);
    }
    return undefined;
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

  /**
   * Removes a file in any document collection by the given file name. First checks if fileName is blank or not.
   * If file name is blank, doesn't remove any file. Then checks if document collection is empty or not. If document
   * collection is empty sets an empty document collection. Searches for file name. If file name is found in the
   * collection removes the file with the file name else does nothing.
   * @param documentCollection is the collection that file will be removed.
   * @param fileName is the name of the file to be removed from the collection.
   */
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

  /**
   * Finds et1 form by the selected language in req.url value. If req.url has any parameter as 'lng=cy' searches for
   * welsh document otherwise searches for english document. It first checks request, request session, request session
   * user case and request session user case document collection. If any of these is empty returns undefined. If not
   * empty sets session's english and welsh et1 forms and returns et1 form according to the language parameter in
   * request url.
   * @param request object in the session.
   * @return et1 form as document type item according to language parameter in request url.
   */
  public static findET1FormByRequestAndUrlLanguage(request: AppRequest): ApiDocumentTypeItem {
    if (
      ObjectUtils.isEmpty(request) ||
      ObjectUtils.isEmpty(request.session) ||
      ObjectUtils.isEmpty(request.session.userCase) ||
      CollectionUtils.isEmpty(request.session.userCase.documentCollection)
    ) {
      return undefined;
    }
    const languageParam = getLanguageParam(request.url);
    let et1FormDocument: ApiDocumentTypeItem;
    request.session.et1FormEnglish = this.findET1FormByLanguageAsApiDocumentTypeItem(
      request.session?.userCase?.documentCollection as ApiDocumentTypeItem[],
      languages.ENGLISH_URL_POSTFIX
    );
    request.session.et1FormWelsh = this.findET1FormByLanguageAsApiDocumentTypeItem(
      request.session?.userCase?.documentCollection as ApiDocumentTypeItem[],
      languages.WELSH_URL_POSTFIX
    );
    if (languages.WELSH_URL_PARAMETER === languageParam && request.session.et1FormWelsh !== undefined) {
      et1FormDocument = request.session.et1FormWelsh;
    } else {
      et1FormDocument = request.session.et1FormEnglish;
    }
    return et1FormDocument;
  }

  /**
   * Converts document list to gov uk table rows to show in Documents page or claimant et1 documents page.
   * Gets list of document. Checks if document has value, id, document file name. If document list has those values
   * adds new item to gov uk table rows in {text?: date of correspondence, html?: link to document} format.
   * @param documentList list of documents that needs to be converted.
   * @response list of items in gov uk table rows format which is
   *           {text?: date of correspondence, html?: link to document}
   */
  public static convertDocumentListToGovUkTableRows(documentList: ApiDocumentTypeItem[]): { html?: string }[] {
    if (CollectionUtils.isEmpty(documentList)) {
      return undefined;
    }
    const govUkTableRows: { html?: string }[] = [];
    for (const documentTypeItem of documentList) {
      const govUkTableRow: { html?: string }[] = this.generateGovUkTableRowByApiDocumentTypeItem(documentTypeItem);
      if (CollectionUtils.isEmpty(govUkTableRow)) {
        continue;
      }
      govUkTableRows.push(govUkTableRow[0], govUkTableRow[1]);
    }
    return CollectionUtils.isEmpty(govUkTableRows) ? undefined : govUkTableRows;
  }

  /**
   * Generates gov uk table row with the given api document type item. First checks if api document type item,
   * it's value, it's id, it's value's uploaded document and uploaded document's document file name fields.
   * If any of those fields is empty returns undefined. If not empty returns an array of { html?: string } object
   * with document date and link.
   * @param apiDocumentTypeItem is the item that gov uk table row is created by.
   * @return an array of { html?: string } object.
   */
  public static generateGovUkTableRowByApiDocumentTypeItem(
    apiDocumentTypeItem: ApiDocumentTypeItem
  ): { html?: string }[] {
    if (
      ObjectUtils.isEmpty(apiDocumentTypeItem) ||
      ObjectUtils.isEmpty(apiDocumentTypeItem.value) ||
      StringUtils.isBlank(apiDocumentTypeItem.id) ||
      ObjectUtils.isEmpty(apiDocumentTypeItem.value.uploadedDocument) ||
      StringUtils.isBlank(apiDocumentTypeItem.value.uploadedDocument.document_filename)
    ) {
      return undefined;
    }
    return [
      {
        html: this.findDocumentDateByApiDocumentTypeItem(apiDocumentTypeItem),
      },
      {
        html:
          '<a href="getCaseDocument/' +
          apiDocumentTypeItem.id +
          '" target="_blank">' +
          apiDocumentTypeItem.value.uploadedDocument.document_filename +
          '</a>',
      },
    ];
  }

  /**
   * Tries to find document date by the given ApiDocumentTypeItem. First checks if document value is empty or not.
   * If it is empty returns - and 22 spaces (to show date field formatted in the frontend). If document value is not
   * empty checks dateOfCorrespondence field. If dateOfCorrespondence is not empty returns this value in date format
   * like 05 Aug 1979. If dateOfCorrespondence is empty checks creationDate and uploaded document's createdOn fields.
   * @param document
   */
  public static findDocumentDateByApiDocumentTypeItem(document: ApiDocumentTypeItem): string {
    if (ObjectUtils.isEmpty(document?.value)) {
      return '-' + DefaultValues.HTML_SPACE.repeat(25);
    }
    if (
      StringUtils.isNotBlank(document.value.dateOfCorrespondence) &&
      DateUtils.isDateStringValid(document.value.dateOfCorrespondence)
    ) {
      return DateUtils.formatDateStringToDDMMMYYYY(document.value.dateOfCorrespondence);
    }
    if (
      StringUtils.isNotBlank(document.value.creationDate) &&
      DateUtils.isDateStringValid(document.value.creationDate)
    ) {
      return DateUtils.formatDateStringToDDMMMYYYY(document.value.creationDate);
    }
    if (
      StringUtils.isNotBlank(document.value.uploadedDocument.createdOn) &&
      DateUtils.isDateStringValid(document.value.uploadedDocument.createdOn)
    ) {
      return DateUtils.formatDateStringToDDMMMYYYY(document.value.uploadedDocument.createdOn);
    }
    return DefaultValues.STRING_DASH + DefaultValues.HTML_SPACE.repeat(25);
  }

  /**
   * Finds et1 attachments in document collection. It discriminates et1 attachments by document type or type of
   * document by comparing their values with "ET1 Attachment" string.
   * @param documentCollection is the collection in which ET1 Attachment documents searched.
   * @return documentCollection which has only ET1 Attached documents.
   */
  public static findET1AttachmentsInDocumentCollection(
    documentCollection: ApiDocumentTypeItem[]
  ): ApiDocumentTypeItem[] {
    if (CollectionUtils.isEmpty(documentCollection)) {
      return undefined;
    }
    const et1AttachedDocuments: ApiDocumentTypeItem[] = [];
    for (const documentTypeItem of documentCollection) {
      if (
        StringUtils.isNotBlank(documentTypeItem?.value?.documentType) &&
        AllDocumentTypes.ET1_ATTACHMENT === documentTypeItem.value.documentType
      ) {
        et1AttachedDocuments.push(documentTypeItem);
      }
    }
    return CollectionUtils.isEmpty(et1AttachedDocuments) ? undefined : et1AttachedDocuments;
  }
}
