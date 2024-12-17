import { DocumentUploadResponse } from '../../../main/definitions/api/documentApiResponse';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { GovukTableRowArray } from '../../../main/definitions/govuk/govukTable';
export const mockDocumentUploadResponseMain = {
  uri: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  classification: 'PUBLIC',
  size: '47481',
  mimeType: 'image/png',
  hashToken: '7831ecef6f2909c593cd8489bcddbda32ddc1bdeca9da0189b44ad6af892fdac',
  createdOn: '2024-11-04T13:53:43.000+00:00',
  createdBy: 'dda9d1c3-1a11-3c3a-819e-74174fbec26b',
  lastModifiedBy: 'dda9d1c3-1a11-3c3a-819e-74174fbec26b',
  modifiedOn: '2024-11-04T13:53:43.000+00:00',
  ttl: '2024-11-05T13:53:42.000+00:00',
  metadata: {
    case_type_id: 'ET_EnglandWales',
    jurisdiction: 'EMPLOYMENT',
  },
};
export const mockDocumentUploadResponse: DocumentUploadResponse = {
  ...mockDocumentUploadResponseMain,
  originalDocumentName: 'Screenshot 2024-11-03 at 18.53.00.png',
  _links: {
    self: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
    },
    binary: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
    },
  },
};
export const mockDocumentUploadResponseWithoutSelfLink: DocumentUploadResponse = {
  ...mockDocumentUploadResponseMain,
  originalDocumentName: 'Screenshot 2024-11-03 at 18.53.00.png',
  _links: {
    self: {
      href: '',
    },
    binary: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
    },
  },
};
export const mockDocumentUploadResponseWithoutBinaryLink: DocumentUploadResponse = {
  ...mockDocumentUploadResponseMain,
  originalDocumentName: 'Screenshot 2024-11-03 at 18.53.00.png',
  _links: {
    self: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
    },
    binary: {
      href: '',
    },
  },
};
export const mockDocumentUploadResponseWithoutOriginalDocumentName: DocumentUploadResponse = {
  uri: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  classification: 'PUBLIC',
  size: '47481',
  mimeType: 'image/png',
  originalDocumentName: '',
  hashToken: '7831ecef6f2909c593cd8489bcddbda32ddc1bdeca9da0189b44ad6af892fdac',
  createdOn: '2024-11-04T13:53:43.000+00:00',
  createdBy: 'dda9d1c3-1a11-3c3a-819e-74174fbec26b',
  lastModifiedBy: 'dda9d1c3-1a11-3c3a-819e-74174fbec26b',
  modifiedOn: '2024-11-04T13:53:43.000+00:00',
  ttl: '2024-11-05T13:53:42.000+00:00',
  metadata: {
    case_type_id: 'ET_EnglandWales',
    jurisdiction: 'EMPLOYMENT',
  },
  _links: {
    self: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
    },
    binary: {
      href: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
    },
  },
};
export const mockDocumentTypeItemFromMockDocumentUploadResponse: DocumentTypeItem = {
  id: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  downloadLink: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
  value: {
    typeOfDocument: 'ET3 Attachment',
    creationDate: '2024-11-04T13:53:43.000+00:00',
    shortDescription: mockDocumentUploadResponse.originalDocumentName,
    uploadedDocument: {
      document_filename: 'Screenshot 2024-11-03 at 18.53.00.png',
      document_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      document_mime_type: 'image/png',
      document_size: 47481,
      createdOn: '2024-11-04T13:53:43.000+00:00',
      document_binary_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
    },
  },
};
export const mockDocumentTypeItemFromMockDocumentUploadResponseDocumentFileNameTestFilePdf: DocumentTypeItem = {
  id: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  downloadLink: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
  value: {
    typeOfDocument: 'ET3 Attachment',
    creationDate: '2024-11-04T13:53:43.000+00:00',
    shortDescription: mockDocumentUploadResponse.originalDocumentName,
    uploadedDocument: {
      document_filename: 'testFile.pdf',
      document_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      document_mime_type: 'image/png',
      document_size: 47481,
      createdOn: '2024-11-04T13:53:43.000+00:00',
      document_binary_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
    },
  },
};
export const mockGovUKTableRowArrayFromDocumentTypeItem: GovukTableRowArray[] = [
  [
    {
      text: 'Screenshot 2024-11-03 at 18.53.00.png',
    },
    {
      html: '<a href="remove-file/900d4265-aaeb-455f-9cdd-bc0bdf61c918/undefined?lng=en">remove</a>',
    },
  ],
];

export const mockET1FormEnglish: ApiDocumentTypeItem = {
  id: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  downloadLink: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
  value: {
    typeOfDocument: 'ET1',
    shortDescription: mockDocumentUploadResponse.originalDocumentName,
    dateOfCorrespondence: '2024-08-05',
    uploadedDocument: {
      document_filename: 'ET1_Form_English.pdf',
      document_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      document_binary_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
      category_id: 'test_category_id',
    },
  },
};

export const mockET1FormWelsh: ApiDocumentTypeItem = {
  id: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
  downloadLink: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
  value: {
    typeOfDocument: 'ET1',
    shortDescription: mockDocumentUploadResponse.originalDocumentName,
    dateOfCorrespondence: '2024-08-05',
    uploadedDocument: {
      document_filename: 'ET1_Form_Welsh.pdf',
      document_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      document_binary_url: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
      category_id: 'test_category_id',
    },
  },
};
