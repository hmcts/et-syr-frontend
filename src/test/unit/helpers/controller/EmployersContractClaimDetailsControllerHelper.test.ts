import _ from 'lodash';

import { UploadedDocumentType } from '../../../../main/definitions/case';
import {
  DefaultValues,
  FormFieldNames,
  ValidationErrors,
  et3AttachmentDocTypes,
} from '../../../../main/definitions/constants';
import EmployersContractClaimDetailsControllerHelper from '../../../../main/helpers/controller/EmployersContractClaimDetailsControllerHelper';
import { mockCaseWithIdWithRespondents, mockValidCaseWithId } from '../../mocks/mockCaseWithId';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../../mocks/mockCaseWithIdWithFullRespondentDetails';
import { mockDocumentUploadResponse } from '../../mocks/mockDocumentUploadResponse';
import { mockRequest } from '../../mocks/mockRequest';
import { mockRespondentET3Model } from '../../mocks/mockRespondentET3Model';

describe('EmployersContractClaimDetailsControllerHelper tests', () => {
  describe('areInputValuesValid', () => {
    const request = mockRequest({});
    it('sets required error to session for hidden field when there is no file and detail entered', () => {
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_EMPTY;
      expect(
        EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, mockCaseWithIdWithRespondents)
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.REQUIRED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    it('sets too long error to session for  when employer claim detail field has more than 3000 characters', () => {
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(3001);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.TOO_LONG,
          propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS,
        },
      ]);
    });
    it('removes all session errors when employer claim detail field is filled and has less than 3000 characters', () => {
      request.session.selectedRespondentIndex = 0;
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = undefined;
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(2000);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(true);
      expect(request.session.errors).toEqual(DefaultValues.COLLECTION_EMPTY);
    });
    it('removes all session errors when there is employer claim document', () => {
      request.session.selectedRespondentIndex = 0;
      const userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      request.session.userCase.et3ResponseEmployerClaimDocument = {
        document_binary_url: 'document_binary_url',
        document_filename: 'document_filename.pdf',
        document_url: 'document_url',
        category_id: 'category_id',
        upload_timestamp: 'upload_timestamp',
      };
      request.session.userCase.respondents[0].et3ResponseEmployerClaimDocument = {
        document_binary_url: 'document_binary_url',
        document_filename: 'document_filename_selected_respondent.pdf',
        document_url: 'document_url',
        category_id: 'category_id',
        upload_timestamp: 'upload_timestamp',
      };
      userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_HASH.repeat(2000);
      expect(EmployersContractClaimDetailsControllerHelper.areInputValuesValid(request, userCase)).toEqual(true);
      expect(request.session.errors).toEqual(DefaultValues.COLLECTION_EMPTY);
    });
  });
  describe('getET3EmployersContractClaimDocumentName', () => {
    const request = mockRequest({});
    const dummyEt3ResponseEmployerClaimDocumentFileName = 'dummyFile.pdf';
    const dummyEt3ResponseEmployerClaimDocumentFileNameForSelectedRespondent = 'dummyFileForSelectedRespondent.pdf';
    const et3ResponseEmployerClaimDocument: UploadedDocumentType = {
      document_filename: 'uploadedDocumentFileName.pdf',
      upload_timestamp: 'dummtUploadTimeStamp',
      document_url: 'https://dummy.document.url',
      document_binary_url: 'https://dummy.document.url/binary',
      category_id: 'category_id',
    };
    const et3ResponseEmployerClaimDocumentForSelectedRespondent: UploadedDocumentType = {
      document_filename: 'uploadedDocumentFileNameForSelectedRespondent.pdf',
      upload_timestamp: 'dummtUploadTimeStamp',
      document_url: 'https://dummy.document.url',
      document_binary_url: 'https://dummy.document.url/binary',
      category_id: 'category_id',
    };
    it('returns empty string when request is undefined', () => {
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(undefined)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    it('returns empty string when request session is undefined', () => {
      const tmpRequest = _.cloneDeep(request);
      tmpRequest.session = undefined;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    it('returns empty string when request userCase is undefined', () => {
      const tmpRequest = _.cloneDeep(request);
      tmpRequest.session.userCase = undefined;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    it('returns userCase.et3ResponseEmployerClaimDocumentFileName when userCase.et3ResponseEmployerClaimDocumentFileName has value', () => {
      const tmpRequest = _.cloneDeep(request);
      tmpRequest.session.userCase.et3ResponseEmployerClaimDocumentFileName =
        dummyEt3ResponseEmployerClaimDocumentFileName;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(dummyEt3ResponseEmployerClaimDocumentFileName);
    });
    it('returns userCase.et3ResponseEmployerClaimDocument.document_filename when userCase.et3ResponseEmployerClaimDocument.document_filename has value', () => {
      const tmpRequest = _.cloneDeep(request);
      tmpRequest.session.userCase.et3ResponseEmployerClaimDocument = et3ResponseEmployerClaimDocument;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(et3ResponseEmployerClaimDocument.document_filename);
    });
    it('returns selectedRespondent.et3ResponseEmployerClaimDocumentFileName when selectedRespondent.et3ResponseEmployerClaimDocumentFileName has value', () => {
      const tmpRequest = _.cloneDeep(request);
      const selectedRespondent = _.cloneDeep(mockRespondentET3Model);
      selectedRespondent.et3ResponseEmployerClaimDocumentFileName =
        dummyEt3ResponseEmployerClaimDocumentFileNameForSelectedRespondent;
      tmpRequest.session.userCase.respondents = [selectedRespondent];
      tmpRequest.session.selectedRespondentIndex = 0;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(dummyEt3ResponseEmployerClaimDocumentFileNameForSelectedRespondent);
    });
    it('returns selectedRespondent.et3ResponseEmployerClaimDocument.document_filename when selectedRespondent.et3ResponseEmployerClaimDocument.document_filename has value', () => {
      const tmpRequest = _.cloneDeep(request);
      const selectedRespondent = _.cloneDeep(mockRespondentET3Model);
      selectedRespondent.et3ResponseEmployerClaimDocument = et3ResponseEmployerClaimDocumentForSelectedRespondent;
      tmpRequest.session.userCase.respondents = [selectedRespondent];
      tmpRequest.session.selectedRespondentIndex = 0;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(et3ResponseEmployerClaimDocumentForSelectedRespondent.document_filename);
    });
    it('returns empty string when et3Response employer claim document name not has value', () => {
      const tmpRequest = _.cloneDeep(request);
      const selectedRespondent = _.cloneDeep(mockRespondentET3Model);
      selectedRespondent.et3ResponseEmployerClaimDocument = undefined;
      tmpRequest.session.userCase.respondents = [selectedRespondent];
      tmpRequest.session.selectedRespondentIndex = 0;
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
    it('returns empty string when selected respondent index is undefined', () => {
      const tmpRequest = _.cloneDeep(request);
      const selectedRespondent = _.cloneDeep(mockRespondentET3Model);
      selectedRespondent.et3ResponseEmployerClaimDocument = undefined;
      tmpRequest.session.userCase.respondents = [selectedRespondent];
      expect(
        EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(tmpRequest)
      ).toStrictEqual(DefaultValues.STRING_EMPTY);
    });
  });
  describe('setEmployerClaimDocumentToUserCase tests', () => {
    const request = mockRequest({});
    const et3ResponseEmployerClaimDocument: UploadedDocumentType = {
      document_filename: mockDocumentUploadResponse.originalDocumentName,
      upload_timestamp: mockDocumentUploadResponse.createdOn,
      document_url: mockDocumentUploadResponse.uri,
      document_binary_url: mockDocumentUploadResponse.uri + '/binary',
      category_id: et3AttachmentDocTypes[0],
    };
    const documentTypeItem = {
      id: '900d4265-aaeb-455f-9cdd-bc0bdf61c918',
      downloadLink: 'http://localhost:5005/documents/900d4265-aaeb-455f-9cdd-bc0bdf61c918/binary',
      value: {
        typeOfDocument: 'ET3 Attachment',
        creationDate: '2024-11-04T13:53:43.000+00:00',
        shortDescription: 'Screenshot 2024-11-03 at 18.53.00.png',
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
    it('sets nothing to request when uploaded document is empty', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(request, undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocument).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(undefined);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp).toStrictEqual(undefined);
    });
    it('sets nothing to request when request userCase is empty', () => {
      const req = _.cloneDeep(request);
      req.session.userCase = undefined;
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(req, mockDocumentUploadResponse);
      expect(req.session.userCase).toStrictEqual(undefined);
    });
    it('sets nothing to request when request session is empty', () => {
      const req = _.cloneDeep(request);
      req.session = undefined;
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(
        request,
        mockDocumentUploadResponse
      );
      expect(req.session).toStrictEqual(undefined);
    });
    it('sets nothing to request when request is empty', () => {
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(
        undefined,
        mockDocumentUploadResponse
      );
      expect(undefined).toStrictEqual(undefined);
    });
    it('sets request userCase et3ResponseEmployerClaimDocument fields and adds new document to document collection when there is no respondent', () => {
      request.session.userCase = mockValidCaseWithId;
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(
        request,
        mockDocumentUploadResponse
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocument).toStrictEqual(et3ResponseEmployerClaimDocument);
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(
        mockDocumentUploadResponse.uri
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(
        mockDocumentUploadResponse.uri + '/binary'
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(
        et3AttachmentDocTypes[0]
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(
        mockDocumentUploadResponse.originalDocumentName
      );
      expect(request.session.userCase.documentCollection.length).toBeGreaterThan(0);
      expect(request.session.userCase.documentCollection).toEqual([documentTypeItem]);
    });
    it('sets selected respondent and request user case et3ResponseEmployerClaimDocument fields and adds new document to document collection when there is no respondent', () => {
      request.session.userCase = mockValidCaseWithIdWithFullRespondentDetails;
      request.session.selectedRespondentIndex = 0;
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(
        request,
        mockDocumentUploadResponse
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(
        mockDocumentUploadResponse.uri
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocument).toStrictEqual(et3ResponseEmployerClaimDocument);

      expect(request.session.userCase.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(
        et3AttachmentDocTypes[0]
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(
        mockDocumentUploadResponse.uri + '/binary'
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(
        mockDocumentUploadResponse.originalDocumentName
      );
      expect(request.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp).toStrictEqual(
        mockDocumentUploadResponse.createdOn
      );
      expect(request.session.userCase.documentCollection.length).toBeGreaterThan(0);
      expect(request.session.userCase.documentCollection).toEqual([documentTypeItem]);
      const selectedRespondent = request.session.userCase.respondents[0];
      expect(selectedRespondent.et3ResponseEmployerClaimDocument).toStrictEqual(et3ResponseEmployerClaimDocument);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(mockDocumentUploadResponse.uri);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(et3AttachmentDocTypes[0]);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(
        mockDocumentUploadResponse.uri + '/binary'
      );
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(
        mockDocumentUploadResponse.originalDocumentName
      );
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp).toStrictEqual(
        mockDocumentUploadResponse.createdOn
      );
    });
  });
});
