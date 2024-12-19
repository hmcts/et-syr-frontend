import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model } from '../definitions/case';
import { AllDocumentTypes, PageUrls, et3AttachmentDocTypes } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import {
  combineUserCaseDocuments,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
  findContentTypeByDocumentName,
  findUploadedDocumentIdByDocumentUrl,
} from '../helpers/DocumentHelpers';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ET3Util from '../utils/ET3Util';
import NumberUtils from '../utils/NumberUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('CaseDocumentController');

export default class GetCaseDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    if (!req.params?.docId) {
      logger.info('bad request parameter');
      return res.redirect(PageUrls.NOT_FOUND);
    }
    if (!req?.session?.userCase) {
      return res.redirect(PageUrls.NOT_FOUND);
    }
    const docId = req.params.docId;
    const allDocumentSets = combineUserCaseDocuments([req?.session?.userCase]);
    const documentDetails = allDocumentSets.find(doc => doc && doc.id === docId);
    let contentType;
    let uploadedDocumentId = documentDetails?.id;
    let isET1Form = false;
    if (ObjectUtils.isNotEmpty(documentDetails)) {
      isET1Form = documentDetails.originalDocumentName.startsWith('ET1 -');
      logger.info('requested document found in userCase fields');
      contentType = findContentTypeByDocumentDetail(documentDetails);
    } else {
      logger.info('requested document not found in userCase fields checking document collection');
      let documentTypeItem = req.session.userCase.documentCollection?.find(doc => doc.id === req.params.docId);
      let selectedRespondent: RespondentET3Model;
      if (!documentTypeItem) {
        if (
          CollectionUtils.isNotEmpty(req?.session?.userCase?.respondents) &&
          NumberUtils.isNotEmpty(req?.session?.selectedRespondentIndex)
        ) {
          selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
        }
        if (ObjectUtils.isNotEmpty(selectedRespondent)) {
          documentTypeItem = selectedRespondent?.et3ResponseContestClaimDocument.find(
            doc => doc.id === req.params.docId
          );
          if (ObjectUtils.isEmpty(documentTypeItem)) {
            if (ObjectUtils.isNotEmpty(selectedRespondent?.et3ResponseEmployerClaimDocument)) {
              const employerClaimDocumentId = DocumentUtils.findDocumentIdByURL(
                selectedRespondent.et3ResponseEmployerClaimDocument.document_url
              );
              if (StringUtils.isNotBlank(employerClaimDocumentId) && employerClaimDocumentId === req.params.docId) {
                documentTypeItem = {
                  id: employerClaimDocumentId,
                  value: {
                    uploadedDocument: selectedRespondent.et3ResponseEmployerClaimDocument,
                    typeOfDocument: et3AttachmentDocTypes[0],
                    creationDate: selectedRespondent.et3ResponseEmployerClaimDocument.upload_timestamp,
                    shortDescription: selectedRespondent.et3ResponseEmployerClaimDocument.document_filename,
                  },
                };
              }
            }
          }
        }
      }
      if (ObjectUtils.isNotEmpty(documentTypeItem)) {
        uploadedDocumentId = findUploadedDocumentIdByDocumentUrl(
          documentTypeItem?.value?.uploadedDocument?.document_url
        );
        contentType = findContentTypeByDocumentName(documentTypeItem?.value?.uploadedDocument?.document_filename);
        isET1Form =
          documentTypeItem?.value?.typeOfDocument === AllDocumentTypes.ET1 ||
          documentTypeItem?.value?.uploadedDocument?.document_filename.startsWith('ET1 -');
      }
    }
    try {
      if (StringUtils.isBlank(uploadedDocumentId)) {
        logger.error('Document Id does not match with any document in the case');
        return res.redirect(PageUrls.NOT_FOUND);
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(uploadedDocumentId);
      if (!document) {
        logger.error(
          'document not found for the case ' + req?.session?.userCase?.id + ' document id: ' + uploadedDocumentId
        );
        res.redirect(PageUrls.NOT_FOUND);
      }
      if (!contentType) {
        contentType = findContentTypeByDocument(document);
      }
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        logger.error('Failed to download document with id: ' + documentDetails.id);
        res.setHeader('Content-Type', 'application/pdf');
      }
      if (isET1Form) {
        req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
          req,
          ET3CaseDetailsLinkNames.ET1ClaimForm,
          LinkStatus.VIEWED
        );
      }
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (error) {
      logger.error(error.message);
      return res.redirect(PageUrls.NOT_FOUND);
    }
  }
}
