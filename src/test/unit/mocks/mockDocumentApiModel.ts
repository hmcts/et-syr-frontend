import { DocumentApiModel } from '../../../main/definitions/api/caseApiResponse';

export const mockedET1FormEnglishDocumentApiModel: DocumentApiModel = {
  id: '916d3bc2-006a-40ee-a95e-b59eeb14e865',
  value: {
    typeOfDocument: 'ET1',
    shortDescription: 'ET1 - null null',
    uploadedDocument: {
      document_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015',
      document_filename: 'ET1 - A User.pdf',
      document_binary_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015/binary',
    },
  },
};

export const mockedET1FormWelshDocumentApiModel: DocumentApiModel = {
  id: '916d3bc2-006a-40ee-a95e-b59eeb14e865',
  value: {
    typeOfDocument: 'ET1',
    shortDescription: 'ET1 - null null',
    uploadedDocument: {
      document_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015',
      document_filename: 'ET1 - A User Welsh.pdf',
      document_binary_url: 'http://localhost:5005/documents/06ff57b7-5448-482c-858c-e9e0f745f015/binary',
    },
  },
};

export const mockedAcasFormDocumentApiModel: DocumentApiModel = {
  id: '1b8d3315-cc8a-4197-9bc0-376744693499',
  value: {
    typeOfDocument: 'ACAS Certificate',
    uploadedDocument: {
      document_url: 'http://localhost:5005/documents/3f48b0fd-a52a-4118-8b07-c98ebb019689',
      document_filename: 'TEST_ACAS_CERTIFICATE_R123456_78_90.docx',
      document_binary_url: 'http://localhost:5005/documents/3f48b0fd-a52a-4118-8b07-c98ebb019689/binary',
    },
  },
};
