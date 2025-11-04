// Used in API formatter
import { AxiosResponse } from 'axios';

import { CaseWithId, Document } from '../definitions/case';
import { ApiDocumentTypeItem, DocumentType, DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { DOCUMENT_CONTENT_TYPES, DefaultValues, PageUrls } from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';
import DocumentUtils from '../utils/DocumentUtils';
import ObjectUtils from '../utils/ObjectUtils';

export const combineDocuments = <T>(...arrays: T[][]): T[] =>
  [].concat(...arrays.filter(Array.isArray)).filter(doc => doc !== undefined);

export const findContentTypeByDocumentDetail = (documentDetail: DocumentDetail): string => {
  let contentType = documentDetail.mimeType;
  if (!contentType && documentDetail.originalDocumentName) {
    contentType = findContentTypeByDocumentName(documentDetail.originalDocumentName);
  }
  return contentType;
};

export const findContentTypeByDocumentName = (documentName: string): string => {
  const originalDocumentExtension = documentName.substring(documentName.indexOf('.') + 1)?.toLowerCase();
  return findDocumentMimeTypeByExtension(originalDocumentExtension);
};

export const findUploadedDocumentIdByDocumentUrl = (documentUrl: string): string => {
  if (!documentUrl) {
    return undefined;
  }
  const slashLastIndex = documentUrl.lastIndexOf('/');
  if (slashLastIndex < 0) {
    return undefined;
  }
  return documentUrl.substring(slashLastIndex + 1);
};

export const findDocumentMimeTypeByExtension = (extension: string): string | undefined => {
  const mimetype = Object.entries(DOCUMENT_CONTENT_TYPES).find(([, [ext]]) => ext === extension) || [];
  return mimetype[1] ? mimetype[1][1] : undefined;
};

export const combineUserCaseDocuments = (userCases: CaseWithId[], selectedRespondent: number): DocumentDetail[] => {
  const combinedDocuments: DocumentDetail[] = [];

  userCases?.forEach(userCase => {
    combinedDocuments.push(userCase.et1SubmittedForm);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseEt3FormDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.acknowledgementOfClaimLetterDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.rejectionOfClaimDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseAcknowledgementDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseRejectionDocumentDetail);
    pushEt3FormsToCombinedDocuments(combinedDocuments, userCase, selectedRespondent);
    if (userCase.claimSummaryFile?.document_url) {
      const document_url = userCase.claimSummaryFile.document_url;
      const documentId = document_url?.substring(document_url?.lastIndexOf('/') + 1);
      const claimSummaryFileDetail: DocumentDetail = {
        description: 'Claim Summary File Detail',
        id: documentId,
        originalDocumentName: userCase.claimSummaryFile.document_filename,
      };
      combinedDocuments.push(claimSummaryFileDetail);
    }
  });
  return combinedDocuments;
};

function pushDocumentsToCombinedDocuments(combinedDocuments: DocumentDetail[], documentDetailsList: DocumentDetail[]) {
  documentDetailsList?.forEach(documentDetail => combinedDocuments.push(documentDetail));
}

function pushEt3FormsToCombinedDocuments(
  combinedDocuments: DocumentDetail[],
  userCase: CaseWithId,
  selectedRespondent: number
) {
  if (userCase.respondents?.[selectedRespondent]?.et3Form) {
    const et3FormUrl = userCase.respondents[selectedRespondent].et3Form.document_url;
    const documentId = et3FormUrl?.substring(et3FormUrl?.lastIndexOf('/') + 1);
    const et3FormDetail: DocumentDetail = {
      description: 'ET3 Form',
      id: documentId,
      originalDocumentName: userCase.respondents[selectedRespondent].et3Form.document_filename,
    };
    combinedDocuments.push(et3FormDetail);
  }
  if (userCase.respondents?.[selectedRespondent]?.et3FormWelsh) {
    const et3FormWelshUrl = userCase.respondents[selectedRespondent].et3FormWelsh.document_url;
    const documentId = et3FormWelshUrl?.substring(et3FormWelshUrl?.lastIndexOf('/') + 1);
    const et3FormWelshDetail: DocumentDetail = {
      description: 'ET3 Form Welsh',
      id: documentId,
      originalDocumentName: userCase.respondents[selectedRespondent].et3FormWelsh.document_filename,
    };
    combinedDocuments.push(et3FormWelshDetail);
  }
}

export const findContentTypeByDocument = (document: AxiosResponse): string => {
  let contentType = document.headers['content-type'];
  if (!contentType) {
    let fileName: string = document?.headers?.originalfilename;
    if (!fileName) {
      const contentDisposition = document.headers['content-disposition'];
      fileName = contentDisposition?.substring(
        contentDisposition?.indexOf('"') + 1,
        contentDisposition?.lastIndexOf('"')
      );
    }
    const fileExtension = fileName?.substring(fileName.indexOf('.') + 1)?.toLowerCase();
    contentType = findDocumentMimeTypeByExtension(fileExtension);
  }
  return contentType;
};

export const formatDocumentDetailToApiDocumentTypeItem = (form: DocumentDetail): ApiDocumentTypeItem => {
  return {
    id: form.id,
    value: {
      dateOfCorrespondence: form.createdOn,
      shortDescription: form.description,
      uploadedDocument: {
        document_filename: form.originalDocumentName,
        document_url: DefaultValues.STRING_EMPTY,
        document_binary_url: DefaultValues.STRING_EMPTY,
        category_id: DefaultValues.STRING_EMPTY,
      },
    },
  };
};

/**
 * Get link from Document
 * @param doc Document type
 */
export const getSupportingMaterialLink = (doc: Document): string => {
  if (!doc) {
    return '';
  }
  const documentId = DocumentUtils.findDocumentIdByURL(doc.document_url);
  const documentName = doc.document_filename;
  return documentId && ObjectUtils.isNotEmpty(documentName)
    ? '<a href="' +
        PageUrls.GET_SUPPORTING_MATERIAL.replace(':docId', documentId) +
        '" target="_blank">' +
        documentName +
        '</a><br>'
    : undefined;
};

/**
 * Get document from DocumentTypeItem[]
 * @param docs DocumentTypeItem[]
 */
export const getDocumentFromDocumentTypeItems = (docs: DocumentTypeItem[]): DocumentType => {
  return docs.find(element => element)?.value;
};

/**
 * Get link from Document
 * @param doc Document type
 * */
export const getLinkFromDocument = (doc: Document): string => {
  if (!doc) {
    return '';
  }
  const documentId = DocumentUtils.findDocumentIdByURL(doc.document_url);
  const documentName = doc.document_filename;
  return (
    '<a href="' +
    PageUrls.GET_SUPPORTING_MATERIAL.replace(':docId', documentId) +
    '" target="_blank">' +
    documentName +
    '</a><br>'
  );
};
