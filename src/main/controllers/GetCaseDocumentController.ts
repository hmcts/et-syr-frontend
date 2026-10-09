import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { RespondentET3Model, UploadedDocumentType } from '../definitions/case';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, ET3_FORM, PageUrls, et3AttachmentDocTypes } from '../definitions/constants';
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
    const allDocumentSets = combineUserCaseDocuments([req?.session?.userCase], req.session.selectedRespondentIndex);
    const documentDetails = allDocumentSets.find(doc => doc && doc.id === docId);
    let contentType;
    let uploadedDocumentId = documentDetails?.id;
    let isET1Form = false;
    if (ObjectUtils.isNotEmpty(documentDetails)) {
      isET1Form = documentDetails?.originalDocumentName?.startsWith('ET1 -');
      logger.info('requested document found in userCase fields');
      contentType = findContentTypeByDocumentDetail(documentDetails);
    } else {
      logger.info('requested document not found in userCase fields checking document collection');
      let documentTypeItem = req.session.userCase.documentCollection?.find(doc => doc.id === req.params.docId);
      if (!documentTypeItem && CollectionUtils.isNotEmpty(req.session.userCase.respondents)) {
        for (const respondent of req.session.userCase.respondents) {
          documentTypeItem = findRespondentDocument(respondent, req.params.docId);
          if (ObjectUtils.isNotEmpty(documentTypeItem)) {
            break;
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

const findRespondentDocument = (respondent: RespondentET3Model, docId: string): DocumentTypeItem | undefined => {
  const contestDocument = (respondent?.et3ResponseContestClaimDocument || []).find(doc => doc.id === docId);
  if (ObjectUtils.isNotEmpty(contestDocument)) {
    return contestDocument;
  }

  const attachment = [respondent?.et3ResponseEmployerClaimDocument, respondent?.et3ResponseRespondentSupportDocument]
    .map(document => toDocumentTypeItem(document, docId, et3AttachmentDocTypes[0]))
    .find(document => ObjectUtils.isNotEmpty(document));
  if (attachment) {
    return attachment;
  }

  return [respondent?.et3Form, respondent?.et3FormWelsh]
    .map(document => toDocumentTypeItem(document, docId, ET3_FORM))
    .find(document => ObjectUtils.isNotEmpty(document));
};

const toDocumentTypeItem = (
  document: UploadedDocumentType | undefined,
  docId: string,
  typeOfDocument: string
): DocumentTypeItem | undefined => {
  const documentId = DocumentUtils.findDocumentIdByURL(document?.document_url);
  if (StringUtils.isBlank(documentId) || documentId !== docId) {
    return undefined;
  }
  return {
    id: documentId,
    value: {
      uploadedDocument: document,
      typeOfDocument,
      creationDate: document.upload_timestamp,
      shortDescription: document.document_filename,
    },
  };
};
