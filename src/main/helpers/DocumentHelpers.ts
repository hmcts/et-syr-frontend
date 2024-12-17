// Used in API formatter
import { AxiosResponse } from 'axios';

import { CaseWithId } from '../definitions/case';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { DOCUMENT_CONTENT_TYPES, DefaultValues } from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';

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

export const combineUserCaseDocuments = (userCases: CaseWithId[]): DocumentDetail[] => {
  const combinedDocuments: DocumentDetail[] = [];
  userCases?.forEach(userCase => {
    combinedDocuments.push(userCase.et1SubmittedForm);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseEt3FormDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.acknowledgementOfClaimLetterDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.rejectionOfClaimDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseAcknowledgementDocumentDetail);
    pushDocumentsToCombinedDocuments(combinedDocuments, userCase.responseRejectionDocumentDetail);
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

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`;
}
