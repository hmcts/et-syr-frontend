import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import FileUtils from '../../utils/FileUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';
import { fromApiFormatDocument } from '../ApiFormatter';

/**
 * Handle file upload. Return true when error occur.
 * @param req request
 * @param fieldName form field name
 */
export const handleFileUpload = async (req: AppRequest, fieldName: string): Promise<boolean> => {
  if (req.body?.upload && ObjectUtils.isEmpty(req?.file)) {
    req.session.errors = [
      {
        propertyName: fieldName,
        errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
      },
    ];
    return true;
  } else {
    req.session.errors = [];
  }

  if (ObjectUtils.isNotEmpty(req?.file)) {
    req.session.errors = [];
    if (req.fileTooLarge) {
      req.session.errors = [
        {
          propertyName: fieldName,
          errorType: ValidationErrors.INVALID_FILE_SIZE,
        },
      ];
      return true;
    }

    if (!FileUtils.checkFile(req, fieldName)) {
      return true;
    }

    const uploadedDocumentResponse: DocumentUploadResponse = await FileUtils.uploadFile(req);
    if (!uploadedDocumentResponse) {
      return true;
    }

    req.session.userCase.supportingMaterialFile = fromApiFormatDocument(uploadedDocumentResponse);
    req.file = undefined;
  }
  return false;
};

/**
 * Handle form validation. Return FormError when error found.
 * @param req request
 * @param formData form data
 */
export const getFormError = (req: AppRequest, formData: Partial<CaseWithId>): FormError => {
  if (ObjectUtils.isNotEmpty(req.file) && ObjectUtils.isEmpty(req.session.userCase.supportingMaterialFile)) {
    return { propertyName: 'supportingMaterialFile', errorType: 'WithoutUploadButton' };
  }

  if (ObjectUtils.isEmpty(req.session.userCase.supportingMaterialFile)) {
    return { propertyName: 'supportingMaterialFile', errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED };
  }

  if (StringUtils.isLengthMoreThan(formData.responseText, 2500)) {
    return { propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG };
  }
};
