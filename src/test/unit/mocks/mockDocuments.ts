import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { DocumentDetail } from '../../../main/definitions/definition';

import mockDocument from './documentDetail.json';

export const mockedET1FormDocument = mockDocument;

export const mockedET1FormEnglish: ApiDocumentTypeItem = {
  id: '916d3bc2-006a-40ee-a95e-b59eeb14e865',
  value: {
    docNumber: '1',
    documentType: 'ET1',
    typeOfDocument: 'ET1',
    shortDescription: 'ET1 - null null',
    uploadedDocument: {
      document_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015',
      category_id: 'C11',
      document_filename: 'ET1 - A User.pdf',
      document_binary_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015/binary',
    },
    topLevelDocuments: 'Starting a Claim',
    dateOfCorrespondence: '2024-10-21',
    startingClaimDocuments: 'ET1',
  },
};

export const mockET1SubmittedForm: DocumentDetail = {
  id: '916d3bc2-006a-40ee-a95e-b59eeb14e865',
  size: '32564',
  mimeType: 'application/pdf',
  createdOn: '2024-10-21',
  type: 'ET1',
  description: 'ET1 submitted form',
  originalDocumentName: 'test_document.pdf',
};

export const mockedET1FormWelsh: ApiDocumentTypeItem = {
  id: '916d3bc2-006a-40ee-a95e-b59eeb14e865',
  value: {
    docNumber: '2',
    documentType: 'ET1',
    typeOfDocument: 'ET1',
    shortDescription: 'ET1 - null null',
    uploadedDocument: {
      document_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015',
      category_id: 'C11',
      document_filename: 'ET1 - A User Welsh.pdf',
      document_binary_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015/binary',
    },
    topLevelDocuments: 'Starting a Claim',
    dateOfCorrespondence: '2024-10-21',
    startingClaimDocuments: 'ET1',
  },
};

export const mockedAcasForm: ApiDocumentTypeItem = {
  id: '1b8d3315-cc8a-4197-9bc0-376744693499',
  value: {
    docNumber: '4',
    documentType: 'ACAS Certificate',
    uploadedDocument: {
      category_id: 'C13',
      document_url: 'http://localhost:5005/documents/3f48b0fd-a52a-4118-8b07-c98ebb019689',
      document_filename: 'TEST_ACAS_CERTIFICATE_R123456_78_90.docx',
      document_binary_url: 'http://localhost:5005/documents/3f48b0fd-a52a-4118-8b07-c98ebb019689/binary',
    },
    topLevelDocuments: 'Starting a Claim',
    startingClaimDocuments: 'ACAS Certificate',
  },
};
