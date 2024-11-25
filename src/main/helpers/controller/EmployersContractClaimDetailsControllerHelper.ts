import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, RespondentET3Model, UploadedDocumentType } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { DefaultValues, FormFieldNames, ValidationErrors, et3AttachmentDocTypes } from '../../definitions/constants';
import CollectionUtils from '../../utils/CollectionUtils';
import ErrorUtils from '../../utils/ErrorUtils';
import FileUtils from '../../utils/FileUtils';
import NumberUtils from '../../utils/NumberUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';

export default class EmployersContractClaimDetailsControllerHelper {
  public static areInputValuesValid(req: AppRequest, formData: Partial<CaseWithId>): boolean {
    req.session.errors = [];
    let selectedRespondent: RespondentET3Model;
    if (
      NumberUtils.isNotEmpty(req.session.selectedRespondentIndex) &&
      ObjectUtils.isNotEmpty(req.session.userCase) &&
      CollectionUtils.isNotEmpty(req.session.userCase.respondents) &&
      ObjectUtils.isNotEmpty(req.session.userCase.respondents[req.session.selectedRespondentIndex])
    ) {
      selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
    }
    const et3ResponseEmployerClaimDetailsText = formData.et3ResponseEmployerClaimDetails;
    const employerClaimDetailsProvided = StringUtils.isNotBlank(et3ResponseEmployerClaimDetailsText);
    const employerClaimDetailsMoreThan3000Chars = StringUtils.isLengthMoreThan(
      et3ResponseEmployerClaimDetailsText,
      DefaultValues.EMPLOYERS_CLAIM_DETAILS_MAX_LENGTH
    );
    const claimSummaryFileExists =
      ObjectUtils.isNotEmpty(req.file) ||
      ObjectUtils.isNotEmpty(req.session.userCase.et3ResponseEmployerClaimDocument) ||
      ObjectUtils.isNotEmpty(selectedRespondent?.et3ResponseEmployerClaimDocument);
    if (!claimSummaryFileExists && !employerClaimDetailsProvided) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.REQUIRED,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return false;
    }
    if (employerClaimDetailsMoreThan3000Chars) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.TOO_LONG,
        FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS
      );
      return false;
    }
    return true;
  }

  public static getET3EmployersContractClaimDocumentName(req: AppRequest): string {
    if (ObjectUtils.isEmpty(req?.session?.userCase)) {
      return DefaultValues.STRING_EMPTY;
    }
    if (StringUtils.isNotBlank(req.session.userCase.et3ResponseEmployerClaimDocumentFileName)) {
      return req.session.userCase.et3ResponseEmployerClaimDocumentFileName;
    }
    if (
      ObjectUtils.isNotEmpty(req.session.userCase.et3ResponseEmployerClaimDocument) &&
      StringUtils.isNotBlank(req.session.userCase.et3ResponseEmployerClaimDocument.document_filename)
    ) {
      return req.session.userCase.et3ResponseEmployerClaimDocument.document_filename;
    }
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.respondents) &&
      NumberUtils.isNotEmpty(req.session.selectedRespondentIndex) &&
      ObjectUtils.isNotEmpty(req.session.userCase.respondents[req.session.selectedRespondentIndex])
    ) {
      const selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
      if (StringUtils.isNotBlank(selectedRespondent.et3ResponseEmployerClaimDocumentFileName)) {
        return selectedRespondent.et3ResponseEmployerClaimDocumentFileName;
      }
      if (
        ObjectUtils.isNotEmpty(selectedRespondent.et3ResponseEmployerClaimDocument) &&
        StringUtils.isNotBlank(selectedRespondent.et3ResponseEmployerClaimDocument.document_filename)
      ) {
        return selectedRespondent.et3ResponseEmployerClaimDocument.document_filename;
      }
    }
    return DefaultValues.STRING_EMPTY;
  }

  public static setEmployerClaimDocumentToUserCase(req: AppRequest, uploadedDocument: DocumentUploadResponse): void {
    if (ObjectUtils.isEmpty(uploadedDocument)) {
      return;
    }
    if (ObjectUtils.isEmpty(req?.session?.userCase)) {
      return;
    }
    const uploadedDocumentType: UploadedDocumentType = {
      category_id: et3AttachmentDocTypes[0],
      document_binary_url: uploadedDocument.uri + '/binary',
      document_filename: uploadedDocument.originalDocumentName,
      document_url: uploadedDocument.uri,
      upload_timestamp: uploadedDocument.createdOn,
    };
    req.session.userCase.et3ResponseEmployerClaimDocument = uploadedDocumentType;
    req.session.userCase.et3ResponseEmployerClaimDocumentFileName = uploadedDocumentType.document_filename;
    req.session.userCase.et3ResponseEmployerClaimDocumentUrl = uploadedDocumentType.document_url;
    req.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl = uploadedDocumentType.document_binary_url;
    req.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp = uploadedDocumentType.upload_timestamp;
    req.session.userCase.et3ResponseEmployerClaimDocumentCategoryId = et3AttachmentDocTypes[0];
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.respondents) &&
      NumberUtils.isNotEmpty(req.session.selectedRespondentIndex) &&
      ObjectUtils.isNotEmpty(req.session.userCase.respondents[req.session.selectedRespondentIndex])
    ) {
      const selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
      selectedRespondent.et3ResponseEmployerClaimDocument = uploadedDocumentType;
      selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl = uploadedDocumentType.document_binary_url;
      selectedRespondent.et3ResponseEmployerClaimDocumentUrl = uploadedDocumentType.document_url;
      selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId = et3AttachmentDocTypes[0];
      selectedRespondent.et3ResponseEmployerClaimDocumentFileName = uploadedDocumentType.document_filename;
      selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp = uploadedDocumentType.upload_timestamp;
    }
    if (CollectionUtils.isEmpty(req.session.userCase.documentCollection)) {
      req.session.userCase.documentCollection = [];
    }
    const documentTypeItem: DocumentTypeItem = FileUtils.convertDocumentUploadResponseToDocumentTypeItem(
      req,
      uploadedDocument
    );
    if (ObjectUtils.isNotEmpty(documentTypeItem)) {
      req.session.userCase.documentCollection.push(documentTypeItem);
    }
  }
}
