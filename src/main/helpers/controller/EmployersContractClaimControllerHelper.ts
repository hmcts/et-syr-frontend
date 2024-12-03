import { AppRequest } from '../../definitions/appRequest';
import { DefaultValues } from '../../definitions/constants';
import CollectionUtils from '../../utils/CollectionUtils';
import NumberUtils from '../../utils/NumberUtils';
import ObjectUtils from '../../utils/ObjectUtils';

export default class EmployersContractClaimControllerHelper {
  public static resetEmployersContractClaimDetails(req: AppRequest): void {
    let uploadedDocument = undefined;
    if (ObjectUtils.isEmpty(req?.session?.userCase)) {
      return;
    }
    uploadedDocument = req.session.userCase.et3ResponseEmployerClaimDocument;
    req.session.userCase.et3ResponseEmployerClaimDetails = DefaultValues.STRING_EMPTY;
    req.session.userCase.et3ResponseEmployerClaimDocumentFileName = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentUrl = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocumentCategoryId = undefined;
    req.session.userCase.et3ResponseEmployerClaimDocument = undefined;
    if (
      CollectionUtils.isNotEmpty(req.session.userCase.respondents) &&
      NumberUtils.isNotEmpty(req.session.selectedRespondentIndex) &&
      ObjectUtils.isNotEmpty(req.session.userCase.respondents[req.session.selectedRespondentIndex])
    ) {
      const selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
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
    if (CollectionUtils.isEmpty(req.session.userCase.documentCollection)) {
      req.session.userCase.documentCollection = [];
      return;
    }
    if (ObjectUtils.isNotEmpty(uploadedDocument)) {
      const uploadedDocumentIndex = req.session.userCase.documentCollection
        .map(document => document?.value?.uploadedDocument?.document_filename)
        .indexOf(uploadedDocument?.document_filename);
      CollectionUtils.removeItemFromCollectionByIndex(req.session.userCase.documentCollection, uploadedDocumentIndex);
    }
  }
}
