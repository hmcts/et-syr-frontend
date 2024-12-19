import { Document } from '../case';

export interface DocumentTypeItem {
  id?: string;
  value?: DocumentType;
  //Custom field for visualization only
  downloadLink?: string;
}

export interface DocumentType {
  shortDescription?: string;
  uploadedDocument?: Document;
  typeOfDocument?: string;
  creationDate?: string;
}

export interface ApiDocumentTypeItem {
  id?: string;
  value?: {
    docNumber?: string;
    documentType?: string;
    typeOfDocument?: string;
    shortDescription?: string;
    creationDate?: string;
    uploadedDocument?: {
      category_id?: string;
      document_url: string;
      document_filename: string;
      document_binary_url: string;
      createdOn?: string;
    };
    topLevelDocuments?: string;
    dateOfCorrespondence?: string;
    startingClaimDocuments?: string;
  };
  downloadLink?: string;
}
