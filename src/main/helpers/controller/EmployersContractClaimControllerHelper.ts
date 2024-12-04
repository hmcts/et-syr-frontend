import { AppRequest } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import { DefaultValues } from '../../definitions/constants';
import DocumentUtils from '../../utils/DocumentUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import RespondentUtils from '../../utils/RespondentUtils';

export default class EmployersContractClaimControllerHelper {
  public static resetEmployersContractClaimDetails(req: AppRequest): void {
    if (ObjectUtils.isEmpty(req?.session?.userCase)) {
      return;
    }
    let uploadedDocument = req.session.userCase.et3ResponseEmployerClaimDocument;
    req.session.userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_EMPTY;
    req.session.userCase.et3ResponseEmployerClaimDocumentFileName = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentUrl = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentCategoryId = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocument = undefined;
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    if (ObjectUtils.isNotEmpty(selectedRespondent)) {
      if (ObjectUtils.isEmpty(uploadedDocument)) {
        uploadedDocument = selectedRespondent.et3ResponseEmployerClaimDocument;
      }
      selectedRespondent.et3ResponseEmployerClaimDetails = DefaultValues.STRING_EMPTY;
      selectedRespondent.et3ResponseEmployerClaimDocument = undefined;
      selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl = undefined;
      selectedRespondent.et3ResponseEmployerClaimDocumentUrl = undefined;
      selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId = undefined;
      selectedRespondent.et3ResponseEmployerClaimDocumentFileName = undefined;
      selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp = undefined;
    }
    DocumentUtils.removeFileFromDocumentCollectionByFileName(
      req.session.userCase.documentCollection,
      uploadedDocument?.document_filename
    );
  }
}
