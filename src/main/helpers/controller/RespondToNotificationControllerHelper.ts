import { DocumentUploadResponse } from '../../definitions/api/documentApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../../definitions/case';
import { ValidationErrors } from '../../definitions/constants';
import { FormError } from '../../definitions/form';
import FileUtils from '../../utils/FileUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import { isContentCharsOrLess, isFieldFilledIn, isOptionSelected } from '../../validators/validator';
import { fromApiFormatDocument } from '../ApiFormatter';

export const handleFileUpload = async (req: AppRequest, fieldName: string): Promise<boolean> => {
  req.session.errors = [];

  if (req.body?.upload && ObjectUtils.isEmpty(req?.file)) {
    req.session.errors = [
      {
        propertyName: fieldName,
        errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
      },
    ];
    return true;
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

export const getFormError = (req: AppRequest, formData: Partial<CaseWithId>): FormError => {
  const { userCase } = req.session;
  const { responseText, hasSupportingMaterial } = formData;

  const isRadioFilled = isOptionSelected(hasSupportingMaterial) === undefined;
  if (!isRadioFilled) {
    return { propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED };
  }

  if (hasSupportingMaterial === YesOrNo.YES) {
    if (ObjectUtils.isNotEmpty(req.file) && ObjectUtils.isEmpty(userCase.supportingMaterialFile)) {
      return { propertyName: 'supportingMaterialFile', errorType: ValidationErrors.WITHOUT_UPLOAD_BUTTON };
    }

    if (ObjectUtils.isEmpty(userCase.supportingMaterialFile)) {
      return { propertyName: 'supportingMaterialFile', errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED };
    }
  } else {
    const isTextFilled = isFieldFilledIn(responseText) === undefined;
    if (!isTextFilled) {
      return { propertyName: 'responseText', errorType: ValidationErrors.REQUIRED_FILE };
    }
  }

  const tooLong = isContentCharsOrLess(2500)(responseText);
  if (tooLong) {
    return { propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG };
  }
};
