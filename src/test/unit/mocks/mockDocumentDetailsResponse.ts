import { DocumentDetailsResponse } from '../../../main/definitions/api/documentDetailsResponse';
import { DocumentDetail } from '../../../main/definitions/definition';

export const mockDocumentDetailsResponse: DocumentDetailsResponse = {
  createdOn: '2000-01-01',
  size: 420,
  mimeType: 'application/pdf',
  classification: 'PUBLIC',
  originalDocumentName: 'mockDocumentName',
  createdBy: 'mockCreatedBy',
  lastModifiedBy: 'mockLastModifiedBy',
  modifiedOn: '2000-01-01',
  metadata: {
    jurisdiction: 'EMPLOYMENT',
    case_id: '1',
    case_type_id: '1',
  },
};

export const mockDocumentDetail: DocumentDetail = {
  createdOn: '2000-01-01',
  size: '420',
  mimeType: 'application/pdf',
  originalDocumentName: 'mockDocumentName',
  description: 'Test description',
  type: 'ET1',
  id: 'testId',
};

export const mockDocumentDetailsResponseData = { data: mockDocumentDetailsResponse };
