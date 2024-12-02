import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { DefaultValues, et3AttachmentDocTypes, languages } from '../../../main/definitions/constants';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import { mockDocumentTypeItemFromMockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';

describe('Document utils tests', () => {
  const documentCollection: ApiDocumentTypeItem[] = [mockedET1FormEnglish, mockedET1FormWelsh, mockedAcasForm];
  describe('findET1DocumentByLanguage', () => {
    test('Should find English et1 form in the given document collection and English URL parameter', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        documentCollection,
        languages.ENGLISH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find English et1 form in the given document collection and language parameter is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        documentCollection,
        undefined
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find English et1 form in the given document collection and language parameter is empty', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        documentCollection,
        DefaultValues.STRING_EMPTY
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find Welsh et1 form in the given document collection and language parameter is welsh', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        documentCollection,
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormWelsh);
    });
    test('Should not find et1 form in the given document collection is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        undefined,
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
    test('Should not find et1 form in the given document collection is empty', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
        [],
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
  });
  describe('findAcasCertificateByAcasNumber', () => {
    test('Should not find acas certificate in the given document collection when acas certificate number is R123456/78/90', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByAcasNumber(
        documentCollection,
        'R123456/78/90'
      );
      expect(et1FormEnglish).toStrictEqual(mockedAcasForm);
    });
    test('Should not find acas certificate in the given document collection when acas certificate number is R123456/78/00', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByAcasNumber(
        documentCollection,
        'R123456/78/00'
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when document collection is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByAcasNumber(
        undefined,
        'R123456/78/90'
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when document collection is empty', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByAcasNumber([], 'R123456/78/90');
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
  });
  describe('findDocumentIdByURL', () => {
    it.each([
      { value: undefined, result: undefined },
      { value: '', result: undefined },
      { value: ' ', result: undefined },
      { value: 'test', result: undefined },
      { value: ' test', result: undefined },
      { value: 'test   ', result: undefined },
      { value: 'test ', result: undefined },
      { value: '    test', result: undefined },
      { value: ' test ', result: undefined },
      { value: '    test   ', result: undefined },
      { value: '     ', result: undefined },
      { value: null, result: undefined },
      {
        value: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918',
        result: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      },
    ])('check if given string value returns document id by url: %o', ({ value, result }) => {
      expect(DocumentUtils.findDocumentIdByURL(value)).toStrictEqual(result);
    });
  });
  describe('getDocumentsWithTheirLinksByDocumentTypes', () => {
    test('Should return documents link in html format with their names', () => {
      const documentTypeItemList = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      expect(
        DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(documentTypeItemList, et3AttachmentDocTypes)
      ).toStrictEqual(
        '<a href="getCaseDocument/900d4265-aaeb-455f-9cdd-bc0bdf61c918" target="_blank">Screenshot 2024-11-03 at 18.53.00.png</a><br>'
      );
    });
    test('Should return empty string when document type item list is empty', () => {
      expect(DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(undefined, et3AttachmentDocTypes)).toStrictEqual(
        DefaultValues.STRING_EMPTY
      );
    });
    test('Should return empty string when document types is empty', () => {
      const documentTypeItemList = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      expect(DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(documentTypeItemList, undefined)).toStrictEqual(
        DefaultValues.STRING_EMPTY
      );
    });
    test('Should return empty string when document type is empty', () => {
      const documentTypeItemList = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      documentTypeItemList[0].value.typeOfDocument = DefaultValues.STRING_EMPTY;
      expect(
        DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(documentTypeItemList, et3AttachmentDocTypes)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    test('Should return empty string when document id is empty', () => {
      const documentTypeItemList = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      documentTypeItemList[0].value.typeOfDocument = et3AttachmentDocTypes[0];
      documentTypeItemList[0].id = undefined;
      expect(
        DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(documentTypeItemList, et3AttachmentDocTypes)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    test('Should return empty string when document file name is empty', () => {
      const documentTypeItemList = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      documentTypeItemList[0].value.typeOfDocument = et3AttachmentDocTypes[0];
      documentTypeItemList[0].id = '1234';
      documentTypeItemList[0].value.uploadedDocument.document_filename = undefined;
      expect(
        DocumentUtils.getDocumentsWithTheirLinksByDocumentTypes(documentTypeItemList, et3AttachmentDocTypes)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
  });
  describe('sanitizeDocumentName', () => {
    it.each([
      { value: undefined, result: DefaultValues.STRING_EMPTY },
      { value: '', result: DefaultValues.STRING_EMPTY },
      { value: ' ', result: DefaultValues.STRING_EMPTY },
      { value: 'test.pdf', result: 'test.pdf' },
      { value: ' test', result: 'test' },
      { value: 'test   ', result: 'test' },
      { value: 'test ', result: 'test' },
      { value: '    test', result: 'test' },
      { value: ' test ', result: 'test' },
      { value: '    test   ', result: 'test' },
      { value: '     ', result: DefaultValues.STRING_EMPTY },
      { value: null, result: DefaultValues.STRING_EMPTY },
      {
        value: 'test(1).pdf',
        result: 'test1.pdf',
      },
    ])('check if given string value returns a valid document name: %o', ({ value, result }) => {
      expect(DocumentUtils.sanitizeDocumentName(value)).toStrictEqual(result);
    });
  });
});
