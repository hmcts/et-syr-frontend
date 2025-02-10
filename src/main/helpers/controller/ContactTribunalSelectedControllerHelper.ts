import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import { Application } from '../../definitions/contact-tribunal-applications';
import { FormError } from '../../definitions/form';
import FileUtils from '../../utils/FileUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import StringUtils from '../../utils/StringUtils';
import { fromApiFormatDocument } from '../ApiFormatter';
import { isTypeAOrB } from '../ApplicationHelper';
import { getLanguageParam } from '../RouterHelpers';

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
  if (ObjectUtils.isNotEmpty(req.file) && ObjectUtils.isEmpty(req.session.userCase.contactApplicationFile)) {
    return { propertyName: 'contactApplicationFile', errorType: 'WithoutUploadButton' };
  }

  if (
    ObjectUtils.isEmpty(req.session.userCase.contactApplicationFile) &&
    StringUtils.isBlank(formData.contactApplicationText)
  ) {
    return { propertyName: 'contactApplicationText', errorType: ValidationErrors.REQUIRED };
  }

  if (StringUtils.isLengthMoreThan(formData.contactApplicationText, 2500)) {
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
