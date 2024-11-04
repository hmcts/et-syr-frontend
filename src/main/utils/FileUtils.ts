import { AxiosResponse } from 'axios';

import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { UploadedFile } from '../definitions/api/uploadedFile';
import { AppRequest } from '../definitions/appRequest';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { FormFieldNames, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import { hasInvalidFileFormat, hasInvalidFileName } from '../validators/validator';

import CollectionUtils from './CollectionUtils';
import DocumentUtils from './DocumentUtils';
import ErrorUtils from './ErrorUtils';
import NumberUtils from './NumberUtils';
import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

const logger = getLogger('FileUtils');

export default class FileUtils {
  public static checkFile(req: AppRequest): boolean {
    req.session.errors = [];
    if (!req.file) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NOT_SELECTED,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    if (!req.file?.buffer || req.file?.buffer?.length === 0) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_BUFFER_EMPTY,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    if (StringUtils.isBlank(req.file?.originalname)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NAME_NOT_FOUND,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    if (hasInvalidFileName(req.file.originalname) === ValidationErrors.INVALID_FILE_NAME) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NAME,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    if (hasInvalidFileFormat(req.file, logger) === ValidationErrors.INVALID_FILE_FORMAT) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_FORMAT,
        FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
      );
      return false;
    }
    return true;
  }
  public static async uploadFile(req: AppRequest): Promise<DocumentUploadResponse> {
    try {
      req.session.errors = [];
      const result: AxiosResponse<DocumentUploadResponse> = await this.callAxiosFileUpload(req, req.file);
      if (ObjectUtils.isObjectNotEmpty(result?.data)) {
        return result.data;
      }
    } catch (error) {
      logger.info(error);
    }
    ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
      req,
      ValidationErrors.FILE_UPLOAD_BACKEND_ERROR,
      FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
    );
    return undefined;
  }

  public static async callAxiosFileUpload(
    req: AppRequest,
    file: UploadedFile
  ): Promise<AxiosResponse<DocumentUploadResponse>> {
    try {
      const result: AxiosResponse<DocumentUploadResponse> = await getCaseApi(
        req.session.user?.accessToken
      ).uploadDocument(file, req.session.userCase?.caseTypeId);
      logger.info(`Uploaded document to: ${result.data._links.self.href}`);
      return result;
    } catch (err) {
      logger.error(err.message);
      throw err;
    }
  }

  public static convertDocumentTypeItemsToGovUkTableRows(req: AppRequest): void {
    req.session.errors = [];
    const languageParam = getLanguageParam(req.url);
    const translationFunction: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON, { returnObjects: true }),
    };
    if (
      (!req?.session?.selectedRespondentIndex && req.session.selectedRespondentIndex !== 0) ||
      CollectionUtils.isEmpty(req?.session?.userCase?.respondents) ||
      ObjectUtils.isObjectEmpty(req?.session?.userCase?.respondents[req.session.selectedRespondentIndex])
    ) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.RESPONDENT_NOT_FOUND,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return;
    }
    if (
      CollectionUtils.isEmpty(
        req.session.userCase.respondents[req.session.selectedRespondentIndex].et3ResponseContestClaimDocument
      )
    ) {
      req.session.selectedDocuments = [];
      req.session.userCase.respondents[req.session.selectedRespondentIndex].et3ResponseContestClaimDocument = [];
      return;
    }
    if (!req.session.selectedDocuments) {
      req.session.selectedDocuments = [];
    }
    const textRemove = translationFunction.remove ? translationFunction.remove : 'remove';
    for (const documentTypeItem of req.session.userCase.respondents[req.session.selectedRespondentIndex]
      .et3ResponseContestClaimDocument) {
      req.session.selectedDocuments.push([
        { text: documentTypeItem.value?.uploadedDocument?.document_filename },
        {
          html: '<a href="remove-file' + languageParam + '&fileId=' + documentTypeItem?.id + '">' + textRemove + '</a>',
        },
      ]);
    }
  }

  public static convertDocumentUploadResponseToDocumentTypeItem(
    req: AppRequest,
    documentUploadResponse: DocumentUploadResponse
  ): DocumentTypeItem {
    req.session.errors = [];
    const documentTypeItem = {
      id: DocumentUtils.findDocumentIdByURL(documentUploadResponse?._links?.self?.href),
      downloadLink: documentUploadResponse?._links?.binary?.href,
      value: {
        typeOfDocument: documentUploadResponse?.mimeType,
        creationDate: documentUploadResponse?.createdOn,
        shortDescription: documentUploadResponse?.originalDocumentName,
        uploadedDocument: {
          document_filename: documentUploadResponse?.originalDocumentName,
          document_url: documentUploadResponse._links?.self.href,
          document_mime_type: documentUploadResponse?.mimeType,
          document_size: NumberUtils.isNumericValue(documentUploadResponse?.size)
            ? Number(documentUploadResponse?.size)
            : 0,
          createdOn: documentUploadResponse?.createdOn,
          document_binary_url: documentUploadResponse?._links?.binary.href,
        },
      },
    };
    if (
      !documentTypeItem?.id ||
      !documentTypeItem?.downloadLink ||
      !documentTypeItem?.value?.uploadedDocument?.document_filename
    ) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_CREATED,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return undefined;
    }
    return documentTypeItem;
  }
}
