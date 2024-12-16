import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { DefaultValues, et3AttachmentDocTypes, languages } from '../../../main/definitions/constants';
import CollectionUtils from '../../../main/utils/CollectionUtils';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import { mockDocumentTypeItemFromMockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import mockUserCase from '../mocks/mockUserCase';

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
  describe('removeFileFromDocumentCollectionByFileName', () => {
    it.each([
      { tmpDocumentCollection: undefined, fileName: 'test.pdf', result: undefined },
      { documentCollection: [], fileName: 'test.pdf', result: undefined },
      {
        tmpDocumentCollection: [mockDocumentTypeItemFromMockDocumentUploadResponse],
        fileName: undefined,
        result: [mockDocumentTypeItemFromMockDocumentUploadResponse],
      },
      {
        tmpDocumentCollection: [mockDocumentTypeItemFromMockDocumentUploadResponse],
        fileName: 'test.pdf',
        result: [mockDocumentTypeItemFromMockDocumentUploadResponse],
      },
      {
        tmpDocumentCollection: [mockDocumentTypeItemFromMockDocumentUploadResponse],
        fileName: 'Screenshot 2024-11-03 at 18.53.00.png',
        result: [],
      },
    ])(
      'check if given string value returns a valid document name: %o',
      ({ tmpDocumentCollection, fileName, result }) => {
        if (CollectionUtils.isNotEmpty(tmpDocumentCollection)) {
          tmpDocumentCollection[0].value.uploadedDocument.document_filename = 'Screenshot 2024-11-03 at 18.53.00.png';
        }
        DocumentUtils.removeFileFromDocumentCollectionByFileName(tmpDocumentCollection, fileName);
        expect(tmpDocumentCollection).toStrictEqual(result);
      }
    );
  });
  describe('findET3FormIdByRequest tests', () => {
    const testWelshUrl: string = 'http://localhost:3000?lng=cy';
    const testEnglishUrl: string = 'http://localhost:3000?lng=en';
    const formDocumentWelsh = {
      category_id: 'category_id_welsh',
      document_binary_url: 'document_binary_url_welsh',
      document_filename: 'document_filename_welsh',
      upload_timestamp: 'upload_timestamp_welsh',
      document_url: 'http://localhost/et3_form_id_welsh',
    };
    const formDocumentEnglish = {
      category_id: 'category_id_english',
      document_binary_url: 'document_binary_url_english',
      document_filename: 'document_filename_english',
      upload_timestamp: 'upload_timestamp_english',
      document_url: 'http://localhost/et3_form_id_english',
    };
    const et3FormIdWelsh = 'et3_form_id_welsh';
    const et3FormIdEnglish = 'et3_form_id_english';
    test('Should return undefined when there is no selected respondent in the request', () => {
      const req: AppRequest = mockRequest({});
      expect(DocumentUtils.findET3FormIdByRequest(req)).toStrictEqual(undefined);
    });
    test('Should return undefined when there is no file in the selected respondent', () => {
      const req: AppRequest = mockRequest({});
      req.session.userCase = _.cloneDeep(mockUserCase);
      req.session.userCase.respondents = [mockRespondentET3Model];
      req.session.selectedRespondentIndex = 0;
      req.session.userCase.respondents[0].et3Form = undefined;
      req.session.userCase.respondents[0].et3FormWelsh = undefined;
      expect(DocumentUtils.findET3FormIdByRequest(req)).toStrictEqual(undefined);
    });
    test('Should return english et3 form when language parameter is welsh and there is no welsh et3 form in the selected respondent', () => {
      const req: AppRequest = mockRequest({});
      req.url = testWelshUrl;
      req.session.userCase = _.cloneDeep(mockUserCase);
      req.session.userCase.respondents = [mockRespondentET3Model];
      req.session.selectedRespondentIndex = 0;
      req.session.userCase.respondents[0].et3Form = formDocumentEnglish;
      req.session.userCase.respondents[0].et3FormWelsh = undefined;
      expect(DocumentUtils.findET3FormIdByRequest(req)).toStrictEqual(et3FormIdEnglish);
    });
    test('Should return welsh et3 form when language parameter is welsh and there is welsh et3 form in the selected respondent', () => {
      const req: AppRequest = mockRequest({});
      req.url = testWelshUrl;
      req.session.userCase = _.cloneDeep(mockUserCase);
      req.session.userCase.respondents = [mockRespondentET3Model];
      req.session.userCase.respondents[0].et3Form = formDocumentEnglish;
      req.session.userCase.respondents[0].et3FormWelsh = formDocumentWelsh;
      req.session.selectedRespondentIndex = 0;
      expect(DocumentUtils.findET3FormIdByRequest(req)).toStrictEqual(et3FormIdWelsh);
    });
    test('Should return english et3 form when language parameter is english and there is english et3 form in the selected respondent', () => {
      const req: AppRequest = mockRequest({});
      req.url = testEnglishUrl;
      req.session.userCase = _.cloneDeep(mockUserCase);
      req.session.userCase.respondents = [mockRespondentET3Model];
      req.session.userCase.respondents[0].et3Form = formDocumentEnglish;
      req.session.userCase.respondents[0].et3FormWelsh = undefined;
      req.session.selectedRespondentIndex = 0;
      expect(DocumentUtils.findET3FormIdByRequest(req)).toStrictEqual(et3FormIdEnglish);
    });
  });
});
