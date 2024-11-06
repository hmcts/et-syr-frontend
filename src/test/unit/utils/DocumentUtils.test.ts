import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { DefaultValues, languages } from '../../../main/definitions/constants';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';

describe('Document utils tests', () => {
  const documentCollection: ApiDocumentTypeItem[] = [mockedET1FormEnglish, mockedET1FormWelsh, mockedAcasForm];
  test('Should find English et1 form in the given document collection and English URL parameter', () => {
    const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(
      documentCollection,
      languages.ENGLISH_URL_PARAMETER
    );
    expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
  });
  test('Should find English et1 form in the given document collection and language parameter is undefined', () => {
    const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1DocumentByLanguage(documentCollection, undefined);
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
