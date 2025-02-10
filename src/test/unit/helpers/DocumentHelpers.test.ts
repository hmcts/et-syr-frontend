import { Document } from '../../../main/definitions/case';
import { DefaultValues } from '../../../main/definitions/constants';
import { DocumentDetail } from '../../../main/definitions/definition';
import {
  combineDocuments,
  combineUserCaseDocuments,
  findContentTypeByDocumentDetail,
  findUploadedDocumentIdByDocumentUrl,
  formatDocumentDetailToApiDocumentTypeItem,
  getSupportingMaterialLink,
} from '../../../main/helpers/DocumentHelpers';
import { mockDocumentDetail } from '../mocks/mockDocumentDetailsResponse';
import mockUserCaseWithDocumentsComplete from '../mocks/mockUserCaseWithDocumentsComplete';
const testDocumentList1ForCombineDocuments: string[] = ['Document1.pdf', 'Document2.txt', 'Document3.xlsx'];
const testDocumentList2ForCombineDocuments: string[] = ['Document4.docx', 'Document5.rtx', 'Document6.xls'];
const testExpectedDocumentListForCombineDocuments: string[] = [
  'Document1.pdf',
  'Document2.txt',
  'Document3.xlsx',
  'Document4.docx',
  'Document5.rtx',
  'Document6.xls',
];

const documentDetailWithMimeType = {
  id: '1',
  description: 'desc',
  mimeType: 'image/jpeg',
  size: '123',
  createdOn: '01/12/2023',
};

const documentDetailWithOriginalDocumentName = {
  id: '1',
  description: 'desc',
  size: '123',
  createdOn: '01/12/2023',
  originalDocumentName: 'test.doc',
};

const documentDetailWithoutMimeTypeAndOriginalDocumentName = {
  id: '1',
  description: 'desc',
  size: '123',
  createdOn: '01/12/2023',
};

describe('Documents Helper Test', () => {
  it('should combine document names', async () => {
    expect(combineDocuments(testDocumentList1ForCombineDocuments, testDocumentList2ForCombineDocuments)).toEqual(
      testExpectedDocumentListForCombineDocuments
    );
  });

  it('should combine user case documents correctly', () => {
    expect(combineUserCaseDocuments([mockUserCaseWithDocumentsComplete])).toStrictEqual([
      { description: 'Case Details - Mehmet Tahir Dede', id: '3aa7dfc1-378b-4fa8-9a17-89126fae5673', type: 'ET1' },
      { id: '1', description: 'desc1' },
      { id: '2', description: 'desc2' },
      { id: '3', description: 'desc3' },
      { id: '4', description: 'desc4' },
      { id: '5', description: 'desc5' },
      { id: '6', description: 'desc6' },
      { id: '7', description: 'desc7' },
      { id: '8', description: 'desc8' },
      {
        id: 'a0c113ec-eede-472a-a59c-f2614b48177c',
        description: 'Claim Summary File Detail',
        originalDocumentName: 'document.pdf',
      },
    ]);
  });

  describe('FindContentTypeByDocumentDetail', () => {
    it.each([
      [documentDetailWithMimeType, 'image/jpeg'],
      [documentDetailWithOriginalDocumentName, 'application/vnd.ms-word'],
      [documentDetailWithoutMimeTypeAndOriginalDocumentName, undefined],
    ])('%o document type should be %s', (documentDetailItem: DocumentDetail, contentType: string) => {
      expect(findContentTypeByDocumentDetail(documentDetailItem)).toStrictEqual(contentType);
    });
  });

  describe('FindUploadedDocumentIdByDocumentUrl', () => {
    it.each([
      { value: undefined, result: undefined },
      { value: '', result: undefined },
      { value: 'http', result: undefined },
      { value: 'https://', result: DefaultValues.STRING_EMPTY },
      { value: 'http://test_document_id', result: 'test_document_id' },
    ])('check if given string value is blank: %o', ({ value, result }) => {
      expect(findUploadedDocumentIdByDocumentUrl(value)).toStrictEqual(result);
    });
  });

  describe('FormatDocumentDetailToApiDocumentTypeItem', () => {
    it('should format document detail to ApiDocumentTypeItem', async () => {
      const apiDocumentTypeItem = formatDocumentDetailToApiDocumentTypeItem(mockDocumentDetail);
      expect(apiDocumentTypeItem.id).toEqual(mockDocumentDetail.id);
      expect(apiDocumentTypeItem.value.uploadedDocument.document_filename).toEqual(
        mockDocumentDetail.originalDocumentName
      );
      expect(apiDocumentTypeItem.value.shortDescription).toEqual(mockDocumentDetail.description);
      expect(apiDocumentTypeItem.value.dateOfCorrespondence).toEqual(mockDocumentDetail.createdOn);
    });
  });

  describe('getLinkFromDocument', () => {
    it('should return empty string when document is null', () => {
      expect(getSupportingMaterialLink(null)).toBe('');
    });

    it('should return empty string when document is undefined', () => {
      expect(getSupportingMaterialLink(undefined)).toBe('');
    });

    it('should return valid link when document is provided', () => {
      const mockDoc: Document = {
        document_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074',
        document_filename: 'test_document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      };
      const result = getSupportingMaterialLink(mockDoc);
      expect(result).toBe(
        '<a href="/getSupportingMaterial/e760f197-7611-41ae-bbcd-7f92194f6074" target="_blank">test_document.pdf</a><br>'
      );
    });

    it('should handle missing document_url gracefully', () => {
      const mockDoc: Document = {
        document_url: '',
        document_filename: 'test_document.pdf',
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      };
      const result = getSupportingMaterialLink(mockDoc);
      expect(result).toBe(undefined);
    });

    it('should handle missing document_filename gracefully', () => {
      const mockDoc: Document = {
        document_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074',
        document_filename: '', // Empty Filename
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      };
      const result = getSupportingMaterialLink(mockDoc);
      expect(result).toBe(undefined);
    });

    it('should handle special characters in document_filename properly', () => {
      const mockDoc: Document = {
        document_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074',
        document_filename: 'test & doc.pdf',
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      };
      const result = getSupportingMaterialLink(mockDoc);
      expect(result).toBe(
        '<a href="/getSupportingMaterial/e760f197-7611-41ae-bbcd-7f92194f6074" target="_blank">test & doc.pdf</a><br>'
      );
    });
  });
});
