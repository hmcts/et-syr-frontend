import { AppRequest } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import { DefaultValues } from '../../definitions/constants';
import CollectionUtils from '../../utils/CollectionUtils';
import DocumentUtils from '../../utils/DocumentUtils';
import ObjectUtils from '../../utils/ObjectUtils';
import RespondentUtils from '../../utils/RespondentUtils';

export default class RespondentContestClaimControllerHelper {
  public static resetRespondentContestClaimDetails(req: AppRequest): void {
    if (ObjectUtils.isEmpty(req?.session?.userCase)) {
      return;
    }
    let uploadedDocuments = req.session.userCase.et3ResponseContestClaimDocument;
    req.session.userCase.et3ResponseContestClaimDetails = DefaultValues.STRING_EMPTY;
    req.session.userCase.et3ResponseContestClaimDocument = [];
    const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
    if (ObjectUtils.isNotEmpty(selectedRespondent)) {
      selectedRespondent.et3ResponseContestClaimDetails = DefaultValues.STRING_EMPTY;
      if (ObjectUtils.isEmpty(uploadedDocuments)) {
        uploadedDocuments = selectedRespondent.et3ResponseContestClaimDocument;
      }
      selectedRespondent.et3ResponseContestClaimDocument = [];
    }
    if (
      CollectionUtils.isNotEmpty(uploadedDocuments) &&
      CollectionUtils.isNotEmpty(req.session.userCase.documentCollection)
    ) {
      for (const uploadedDocument of uploadedDocuments) {
        DocumentUtils.removeFileFromDocumentCollectionByFileName(
          req.session.userCase.documentCollection,
          uploadedDocument.value?.uploadedDocument?.document_filename
        );
      }
    }
  }
}
