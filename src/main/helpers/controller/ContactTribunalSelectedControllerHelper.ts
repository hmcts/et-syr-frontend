import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { DefaultValues, PageUrls, ValidationErrors } from '../../definitions/constants';
import { Application } from '../../definitions/contact-tribunal-applications';
import { FormError } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import FileUtils from '../../utils/FileUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';
import { fromApiFormatDocument } from '../ApiFormatter';
import { isTypeAOrB } from '../ApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

/**
 * Update uploadedFileName in ContactTribunalSelectedController
 * @param req request
 */
export const getContactApplicationFileName = (req: AppRequest): string => {
  if (ObjectUtils.isEmpty(req?.session?.userCase)) {
    return DefaultValues.STRING_EMPTY;
  }
  if (
    req.session.userCase.contactApplicationFile &&
    StringUtils.isNotBlank(req.session.userCase.contactApplicationFile.document_filename)
  ) {
    return req.session.userCase.contactApplicationFile.document_filename;
  }
  return DefaultValues.STRING_EMPTY;
};

/**
 * Get file hint display
 * @param label translation
 * @param uploadedFileName uploadedFileName in ContactTribunalSelectedController
 */
export const getFileHint = (label: AnyRecord, uploadedFileName: string): string => {
  if (StringUtils.isNotBlank(uploadedFileName)) {
    return (label.contactApplicationFile.hintExisting as string).replace('{{filename}}', uploadedFileName);
  } else {
    return label.contactApplicationFile.hint;
  }
};

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

    req.session.userCase.contactApplicationFile = fromApiFormatDocument(uploadedDocumentResponse);
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
  const isTextProvided = StringUtils.isNotBlank(formData.contactApplicationText);
  const isFileExists =
    ObjectUtils.isNotEmpty(req.file) || ObjectUtils.isNotEmpty(req.session.userCase.contactApplicationFile);
  if (!isFileExists && !isTextProvided) {
    return { propertyName: 'contactApplicationText', errorType: ValidationErrors.REQUIRED };
  }

  const isTextTooLong = StringUtils.isLengthMoreThan(formData.contactApplicationText, 2500);
  if (isTextTooLong) {
    return { propertyName: 'contactApplicationText', errorType: ValidationErrors.TOO_LONG };
  }
};

/**
 * Return CONTACT_TRIBUNAL_SELECTED page
 * @param app selected application
 * @param req request
 */
export const getThisPage = (app: Application, req: AppRequest): string => {
  return PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', app.url) + getLanguageParam(req.url);
};

/**
 * Return COPY_TO_OTHER_PARTY when Type A or B, otherwise return CONTACT_TRIBUNAL_CYA
 * @param app selected application
 * @param req request
 */
export const getNextPage = (app: Application, req: AppRequest): string => {
  if (req.body?.upload) {
    return getThisPage(app, req);
  }
  return (isTypeAOrB(app) ? PageUrls.COPY_TO_OTHER_PARTY : PageUrls.CONTACT_TRIBUNAL_CYA) + getLanguageParam(req.url);
};
