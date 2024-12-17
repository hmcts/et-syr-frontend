import _ from 'lodash';

import { AppRequest } from '../../../main/definitions/appRequest';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, DefaultValues, et3AttachmentDocTypes, languages } from '../../../main/definitions/constants';
import CollectionUtils from '../../../main/utils/CollectionUtils';
import DocumentUtils from '../../../main/utils/DocumentUtils';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import {
  mockDocumentTypeItemFromMockDocumentUploadResponse,
  mockET1FormEnglish,
  mockET1FormWelsh,
} from '../mocks/mockDocumentUploadResponse';
import { mockedAcasForm, mockedET1FormEnglish, mockedET1FormWelsh } from '../mocks/mockDocuments';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import mockUserCase from '../mocks/mockUserCase';

describe('DocumentUtils', () => {
  const documentCollection: ApiDocumentTypeItem[] = [mockedET1FormEnglish, mockedET1FormWelsh, mockedAcasForm];
  describe('findET1FormByLanguageAsApiDocumentTypeItem', () => {
    test('Should find English et1 form in the given document collection and English URL parameter', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        documentCollection,
        languages.ENGLISH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find English et1 form in the given document collection and language parameter is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        documentCollection,
        undefined
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find English et1 form in the given document collection and language parameter is empty', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        documentCollection,
        DefaultValues.STRING_EMPTY
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormEnglish);
    });
    test('Should find Welsh et1 form in the given document collection and language parameter is welsh', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        documentCollection,
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(mockedET1FormWelsh);
    });
    test('Should not find et1 form in the given document collection is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        undefined,
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
    test('Should not find et1 form in the given document collection is empty', () => {
      const et1FormEnglish: ApiDocumentTypeItem = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        [],
        languages.WELSH_URL_PARAMETER
      );
      expect(et1FormEnglish).toStrictEqual(undefined);
    });
  });
  describe('findAcasCertificateByAcasNumber', () => {
    const acasCertificateNumber: string = 'R123456/78/90';
    const invalidAcasCertificateNumber: string = 'R123456/78/00';
    const documentTypeET1: string = 'ET1';
    const typeOfDocument: string = 'ACAS Certificate';
    const acasCertificateFileName: string = 'TEST_ACAS_CERTIFICATE_R1234567890.docx';
    const acasCertificateFileNameWithSlash: string = 'TEST_ACAS_CERTIFICATE_R123456/78/90.docx';
    test('Should not find acas certificate when request is undefined', () => {
      expect(DocumentUtils.findAcasCertificateByRequest(undefined)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when request session is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session = undefined;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when request session user case is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = undefined;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when request session user case document collection is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      request.session.userCase.documentCollection = undefined;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate when acas number not found', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      request.session.userCase.acasCertNum = undefined;
      request.session.userCase.documentCollection = [mockedAcasForm];
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should find acas certificate when acas number is found in selected respondents acas cert num field', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.respondents[0].acasCertNum = acasCertificateNumber;
      request.session.userCase.acasCertNum = undefined;
      request.session.userCase.documentCollection = [mockedAcasForm];
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(mockedAcasForm);
    });
    test('Should find acas certificate when acas number is found in selected respondents respondent acas field', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.respondents[0].acasCertNum = undefined;
      request.session.userCase.respondents[0].respondentACAS = acasCertificateNumber;
      request.session.userCase.acasCertNum = undefined;
      request.session.userCase.documentCollection = [mockedAcasForm];
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(mockedAcasForm);
    });
    test('Should find acas certificate in the given document collection when acas certificate number is R1234567890', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileName;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(acasCertificate);
    });
    test('Should find acas certificate in the given document collection when acas certificate number is R123456_78_90', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      request.session.userCase.documentCollection = [mockedAcasForm];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(mockedAcasForm);
    });
    test('Should find acas certificate in the given document collection when acas certificate number is R123456/78/90', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileNameWithSlash;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(acasCertificate);
    });
    test('Should not find acas certificate in the given document collection when acas certificate number is R123456/78/00', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileNameWithSlash;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = invalidAcasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate in the given document collection when document type is not acas certificate', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileNameWithSlash;
      acasCertificate.value.documentType = documentTypeET1;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should not find acas certificate in the given document collection when type of document is not acas certificate', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileNameWithSlash;
      acasCertificate.value.documentType = undefined;
      acasCertificate.value.typeOfDocument = documentTypeET1;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(undefined);
    });
    test('Should find acas certificate in the given document collection when type of document is acas certificate', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = mockValidCaseWithId;
      const acasCertificate: ApiDocumentTypeItem = _.cloneDeep(mockedAcasForm);
      acasCertificate.value.uploadedDocument.document_filename = acasCertificateFileNameWithSlash;
      acasCertificate.value.documentType = undefined;
      acasCertificate.value.typeOfDocument = typeOfDocument;
      request.session.userCase.documentCollection = [acasCertificate];
      request.session.userCase.acasCertNum = acasCertificateNumber;
      expect(DocumentUtils.findAcasCertificateByRequest(request)).toStrictEqual(acasCertificate);
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
  describe('findET3FormIdByRequest', () => {
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
  describe('findET1FormByRequestAndUrlLanguage', () => {
    const testWelshUrl: string = 'http://localhost:3000?lng=cy';
    const testEnglishUrl: string = 'http://localhost:3000?lng=en';
    test('should return undefined when request is undefined', () => {
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when request session is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session = undefined;
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(request)).toStrictEqual(undefined);
    });
    test('should return undefined when request session user case is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = undefined;
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(request)).toStrictEqual(undefined);
    });
    test('should return undefined when request session user case document collection is undefined', () => {
      const request: AppRequest = mockRequest({});
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      request.session.userCase.documentCollection = undefined;
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(request)).toStrictEqual(undefined);
    });
    test('should return welsh et1 form when request session user case document collection exists and request url has welsh url parameter as lng=cy', () => {
      const request: AppRequest = mockRequest({});
      request.url = testWelshUrl;
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      request.session.userCase.documentCollection = [_.cloneDeep(mockET1FormEnglish), _.cloneDeep(mockET1FormWelsh)];
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(request)).toStrictEqual(mockET1FormWelsh);
      expect(request.session.et1FormEnglish).toStrictEqual(mockET1FormEnglish);
      expect(request.session.et1FormWelsh).toStrictEqual(mockET1FormWelsh);
    });
    test('should return english et1 form when request session user case document collection exists and request url has welsh url parameter as lng=cy', () => {
      const request: AppRequest = mockRequest({});
      request.url = testEnglishUrl;
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      request.session.userCase.documentCollection = [_.cloneDeep(mockET1FormEnglish), _.cloneDeep(mockET1FormWelsh)];
      expect(DocumentUtils.findET1FormByRequestAndUrlLanguage(request)).toStrictEqual(mockET1FormEnglish);
      expect(request.session.et1FormWelsh).toStrictEqual(mockET1FormWelsh);
      expect(request.session.et1FormEnglish).toStrictEqual(mockET1FormEnglish);
    });
  });
  describe('convertDocumentListToGovUkTableRows', () => {
    test('should return undefined when document list is undefined', () => {
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when document in document list is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value = undefined;
      const documentTypeItems: DocumentTypeItem[] = [undefined];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual(undefined);
    });
    test('should return undefined when document value in document list is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value = undefined;
      const documentTypeItems: DocumentTypeItem[] = [et1FormEnglish];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual(undefined);
    });
    test('should return undefined when document id in document list is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.id = undefined;
      const documentTypeItems: DocumentTypeItem[] = [et1FormEnglish];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual(undefined);
    });
    test('should return undefined when uploaded document in document value of document list is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.uploadedDocument = undefined;
      const documentTypeItems: DocumentTypeItem[] = [et1FormEnglish];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual(undefined);
    });
    test('should return undefined when document file name of uploaded document in document value of document list is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.uploadedDocument.document_filename = undefined;
      const documentTypeItems: DocumentTypeItem[] = [et1FormEnglish];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual(undefined);
    });
    test('should return govUkTableRow when document list has a valid document', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      const documentTypeItems: ApiDocumentTypeItem[] = [et1FormEnglish];
      expect(DocumentUtils.convertDocumentListToGovUkTableRows(documentTypeItems)).toStrictEqual([
        {
          text: '05 Aug 2024',
        },
        {
          html: '<a href="getCaseDocument/900d4265-aaeb-455f-9cdd-bc0bdf61c918" target="_blank">ET1_Form_English.pdf</a>',
        },
      ]);
    });
  });
  describe('findDocumentDateByApiDocumentTypeItem', () => {
    const invalidDate: string = '2021/14/33';
    const validDate: string = '1979-08-05';
    const expectedValueWhenDateNotFound: string = '-' + DefaultValues.HTML_SPACE.repeat(25);
    const expectedValueWhenDateFound: string = '05 Aug 1979';
    test('should return not found expected value when document type item is undefined', () => {
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(undefined)).toStrictEqual(
        expectedValueWhenDateNotFound
      );
    });
    test('should return not found expected value when document type item value is undefined', () => {
      const et1FormEnglish: DocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value = undefined;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateNotFound
      );
    });
    test('should return not found expected value when documents date of correspondence is not a valid date and document value creation date and uploaded document createdOn values are undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = invalidDate;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateNotFound
      );
    });
    test('should return date of correspondence in dd mmm yyyy format when documents date of correspondence is a valid date', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = validDate;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateFound
      );
    });
    test('should return not found expected value when documents creation date is not a valid date and document date of correspondence and uploaded document createdOn values are undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = undefined;
      et1FormEnglish.value.creationDate = invalidDate;
      et1FormEnglish.value.uploadedDocument.createdOn = undefined;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateNotFound
      );
    });
    test('should return creation date in dd mmm yyyy format when documents creation date is a valid date', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = undefined;
      et1FormEnglish.value.dateOfCorrespondence = validDate;
      et1FormEnglish.value.uploadedDocument.createdOn = undefined;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateFound
      );
    });
    test('should return not found expected value when documents values created on is not a valid date and document date of correspondence and document value creation date values are undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = undefined;
      et1FormEnglish.value.creationDate = undefined;
      et1FormEnglish.value.uploadedDocument.createdOn = invalidDate;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateNotFound
      );
    });
    test('should return created on date in dd mmm yyyy format when documents created on date is a valid date', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.dateOfCorrespondence = undefined;
      et1FormEnglish.value.dateOfCorrespondence = undefined;
      et1FormEnglish.value.uploadedDocument.createdOn = validDate;
      expect(DocumentUtils.findDocumentDateByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValueWhenDateFound
      );
    });
  });
  describe('generateGovUkTableRowByApiDocumentTypeItem', () => {
    const expectedValidReturnValue = [
      {
        html: '05 Aug 2024',
      },
      {
        html: '<a href="getCaseDocument/900d4265-aaeb-455f-9cdd-bc0bdf61c918" target="_blank">ET1_Form_English.pdf</a>',
      },
    ];
    test('should return undefined when document type item is undefined', () => {
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item value is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value = undefined;
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item id is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.id = undefined;
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item value uploaded document is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.uploadedDocument = undefined;
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item value uploaded document file name is undefined', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      et1FormEnglish.value.uploadedDocument.document_filename = undefined;
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(undefined);
    });
    test('should return a valid list of { html?: string } when document type item is valid', () => {
      const et1FormEnglish: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      expect(DocumentUtils.generateGovUkTableRowByApiDocumentTypeItem(et1FormEnglish)).toStrictEqual(
        expectedValidReturnValue
      );
    });
  });
  describe('findET1AttachmentsInDocumentCollection', () => {
    test('should return undefined when document collection is undefined', () => {
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item in document collection is undefined', () => {
      const tmpDocumentCollection: ApiDocumentTypeItem[] = [undefined];
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(tmpDocumentCollection)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item value in document collection is undefined', () => {
      const apiDocumentTypeItem: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      apiDocumentTypeItem.value = undefined;
      const tmpDocumentCollection: ApiDocumentTypeItem[] = [apiDocumentTypeItem];
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(tmpDocumentCollection)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item values document type in document collection is undefined', () => {
      const apiDocumentTypeItem: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      apiDocumentTypeItem.value.documentType = undefined;
      const tmpDocumentCollection: ApiDocumentTypeItem[] = [apiDocumentTypeItem];
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(tmpDocumentCollection)).toStrictEqual(undefined);
    });
    test('should return undefined when document type item values document type in document collection is not ET1 Attachment', () => {
      const apiDocumentTypeItem: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      apiDocumentTypeItem.value.documentType = AllDocumentTypes.ET1;
      const tmpDocumentCollection: ApiDocumentTypeItem[] = [apiDocumentTypeItem];
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(tmpDocumentCollection)).toStrictEqual(undefined);
    });
    test('should return api document type item list when document collection has an ET1 Attachment', () => {
      const apiDocumentTypeItem: ApiDocumentTypeItem = _.cloneDeep(mockET1FormEnglish);
      apiDocumentTypeItem.value.documentType = AllDocumentTypes.ET1_ATTACHMENT;
      const tmpDocumentCollection: ApiDocumentTypeItem[] = [apiDocumentTypeItem];
      expect(DocumentUtils.findET1AttachmentsInDocumentCollection(tmpDocumentCollection)).toStrictEqual([
        apiDocumentTypeItem,
      ]);
    });
  });
});
