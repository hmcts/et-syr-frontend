import { FormFieldNames, ValidationErrors } from '../../../main/definitions/constants';
import FileUtils from '../../../main/utils/FileUtils';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import {
  mockDocumentTypeItemFromMockDocumentUploadResponse,
  mockDocumentTypeItemFromMockDocumentUploadResponseDocumentFileNameTestFilePdf,
  mockDocumentUploadResponse,
  mockDocumentUploadResponseWithoutBinaryLink,
  mockDocumentUploadResponseWithoutOriginalDocumentName,
  mockDocumentUploadResponseWithoutSelfLink,
  mockGovUKTableRowArrayFromDocumentTypeItem,
} from '../mocks/mockDocumentUploadResponse';
import {
  mockInvalidMulterFileWithEmptyFileName,
  mockInvalidMulterFileWithInvalidBuffer,
  mockInvalidMulterFileWithInvalidFormat,
  mockInvalidMulterFileWithInvalidName,
  mockValidMulterFile,
} from '../mocks/mockExpressMulterFile';
import { mockRequest } from '../mocks/mockRequest';

describe('FileUtils', () => {
  const request = mockRequest({});
  describe('checkFile', () => {
    test('Should return false and set file not selected session error when there is no file in request', async () => {
      expect(FileUtils.checkFile(request)).toStrictEqual(false);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    test('Should return false and set empty file error when file buffer in request is empty', async () => {
      request.file = mockInvalidMulterFileWithInvalidBuffer;
      expect(FileUtils.checkFile(request)).toStrictEqual(false);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_BUFFER_EMPTY,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    test('Should return false and set file name not found error when file name in request not found', async () => {
      request.file = mockInvalidMulterFileWithEmptyFileName;
      expect(FileUtils.checkFile(request)).toStrictEqual(false);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_NAME_NOT_FOUND,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    test('Should return false and set invalid file name error when file name in request is invalid', async () => {
      request.file = mockInvalidMulterFileWithInvalidName;
      expect(FileUtils.checkFile(request)).toStrictEqual(false);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_NAME,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    test('Should return false and set invalid file format error when file in request has invalid format', async () => {
      request.file = mockInvalidMulterFileWithInvalidFormat;
      expect(FileUtils.checkFile(request)).toStrictEqual(false);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_FORMAT,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    test('Should return true when file in request is valid', async () => {
      request.file = mockValidMulterFile;
      expect(FileUtils.checkFile(request)).toStrictEqual(true);
      expect(request.session.errors).toStrictEqual([]);
    });
  });
  describe('uploadFile', () => {
    const updateUploadFileMock = jest.spyOn(FileUtils, 'uploadFile');
    const callAxiosFileUploadMock = jest.spyOn(FileUtils, 'callAxiosFileUpload');
    test('Should upload file when file is valid', async () => {
      updateUploadFileMock.mockResolvedValueOnce(mockDocumentUploadResponse);
      expect(await FileUtils.uploadFile(request)).toEqual(mockDocumentUploadResponse);
    });
    test('Should upload file when axios file response is valid', async () => {
      callAxiosFileUploadMock.mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithDocumentUploadResponse);
      expect(await FileUtils.uploadFile(request)).toEqual(mockDocumentUploadResponse);
    });
    test('Should return undefined and add file upload backend error to session when axios file response does not have any data', async () => {
      callAxiosFileUploadMock.mockResolvedValueOnce(MockAxiosResponses.mockAxiosResponseWithoutData);
      expect(await FileUtils.uploadFile(request)).toEqual(undefined);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.FILE_UPLOAD_BACKEND_ERROR,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    test('Should return undefined and add file upload backend error to session when axios file response not returns', async () => {
      callAxiosFileUploadMock.mockImplementationOnce(() => {
        throw new Error('backend error');
      });
      expect(await FileUtils.uploadFile(request)).toEqual(undefined);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.FILE_UPLOAD_BACKEND_ERROR,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
  });
  describe('convertDocumentUploadResponseToDocumentTypeItem', () => {
    test('Should return undefined and set invalid file created error when uploaded document does not have id', async () => {
      expect(
        FileUtils.convertDocumentUploadResponseToDocumentTypeItem(request, mockDocumentUploadResponseWithoutSelfLink)
      ).toBeUndefined();
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_CREATED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    test('Should return undefined and set invalid file created error when uploaded document does not have download link', async () => {
      expect(
        FileUtils.convertDocumentUploadResponseToDocumentTypeItem(request, mockDocumentUploadResponseWithoutBinaryLink)
      ).toBeUndefined();
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_CREATED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    test('Should return undefined and set invalid file created error when uploaded document does not have file name', async () => {
      expect(
        FileUtils.convertDocumentUploadResponseToDocumentTypeItem(
          request,
          mockDocumentUploadResponseWithoutOriginalDocumentName
        )
      ).toBeUndefined();
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_CREATED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    test('Should return document type item and remove all session errors', async () => {
      expect(
        FileUtils.convertDocumentUploadResponseToDocumentTypeItem(request, mockDocumentUploadResponse)
      ).toStrictEqual(mockDocumentTypeItemFromMockDocumentUploadResponse);
      expect(request.session.errors).toStrictEqual([]);
    });
  });
  describe('convertDocumentTypeItemsToGovUkTableRows', () => {
    test('Should have no selected documents in the session when there is no document in et3ResponseContestClaimDocument field', async () => {
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.et3ResponseContestClaimDocument = undefined;
      FileUtils.convertDocumentTypeItemsToGovUkTableRows(request);
      expect(request.session.userCase.et3ResponseContestClaimDocument).toStrictEqual([]);
    });
    test('Should have no selected document in the session when there is document in et3ResponseContestClaimDocument field', async () => {
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.et3ResponseContestClaimDocument = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      const govUKTableRows = FileUtils.convertDocumentTypeItemsToGovUkTableRows(request);
      expect(govUKTableRows).toStrictEqual(mockGovUKTableRowArrayFromDocumentTypeItem);
    });
  });
  describe('fileAlreadyExists', () => {
    test('Should return true if req file name is equal to one of the existing contest claim documents file name.', async () => {
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.file = mockValidMulterFile;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.et3ResponseContestClaimDocument = [
        mockDocumentTypeItemFromMockDocumentUploadResponseDocumentFileNameTestFilePdf,
      ];
      expect(FileUtils.fileAlreadyExists(request)).toStrictEqual(true);
    });
  });
  test('Should return false if req file name is not equal to one of the existing contest claim documents file name.', async () => {
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.file = mockValidMulterFile;
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.userCase.et3ResponseContestClaimDocument = [mockDocumentTypeItemFromMockDocumentUploadResponse];
    expect(FileUtils.fileAlreadyExists(request)).toStrictEqual(false);
  });
  test('Should return false and set empty array if contest claim documents field is undefined.', async () => {
    request.session.selectedRespondentIndex = 0;
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.file = mockValidMulterFile;
    request.session.userCase = mockCaseWithIdWithRespondents;
    request.session.userCase.et3ResponseContestClaimDocument = undefined;
    expect(FileUtils.fileAlreadyExists(request)).toStrictEqual(false);
    expect(request.session.userCase.et3ResponseContestClaimDocument).toStrictEqual([]);
  });
  describe('getFileByUrl', () => {
    test('Should return undefined when url is undefined', async () => {
      const url: string = undefined;
      expect(FileUtils.getFileIdByUrl(url)).toStrictEqual(undefined);
    });
    test('Should return undefined when url not includes file id parameter', async () => {
      const url: string = '/remove-file?lng=en';
      expect(FileUtils.getFileIdByUrl(url)).toStrictEqual(undefined);
    });
    test('Should return undefined when url not includes file id parameter does not have any value', async () => {
      const url: string = '/remove-file?lng=en&fileId=';
      expect(FileUtils.getFileIdByUrl(url)).toStrictEqual(undefined);
    });
    test('Should return file id when remove url is valid', async () => {
      const url: string = 'https://localhost:3003/remove-file?lng=en&fileId=57ce554c-a8b0-4a0d-a786-0565634601b1';
      expect(FileUtils.getFileIdByUrl(url)).toStrictEqual('57ce554c-a8b0-4a0d-a786-0565634601b1');
    });
  });
});
