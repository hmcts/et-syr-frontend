import { combineDocuments } from '../../../main/helpers/DocumentHelpers';

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

describe('Documents Helper Test', () => {
  it('should combine document names', async () => {
    expect(combineDocuments(testDocumentList1ForCombineDocuments, testDocumentList2ForCombineDocuments)).toEqual(
      testExpectedDocumentListForCombineDocuments
    );
  });
});
