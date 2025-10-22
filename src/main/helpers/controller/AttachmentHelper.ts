import { AppRequest } from '../../definitions/appRequest';
import {
  GenericTseApplicationTypeItem,
  TseAdminDecisionItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import { Applicant } from '../../definitions/constants';
import { getDocId } from '../ApiFormatter';

export const isDocIdValid = (docId: string, req: AppRequest): boolean => {
  const userCase = req.session.userCase;
  return (
    docId === getDocId(userCase.contactApplicationFile?.document_url) ||
    docId === getDocId(userCase.supportingMaterialFile?.document_url) ||
    isDocOnApplicationPage(docId, userCase.genericTseApplicationCollection) ||
    isDocOnApplicationPage(docId, userCase.tseRespondentStoredCollection) ||
    isDocOnNotificationPage(docId, userCase.sendNotificationCollection)
  );
};

const isDocOnApplicationPage = (docId: string, apps: GenericTseApplicationTypeItem[]): boolean => {
  return apps?.some(app => {
    return (
      docId === getDocId(app.value.documentUpload?.document_url) ||
      isValidResponseDocId(docId, app.value.respondCollection) ||
      isValidDecisionDocId(docId, app.value.adminDecision)
    );
  });
};

const isValidDecisionDocId = (docId: string, decisions: TseAdminDecisionItem[]): boolean => {
  return decisions?.some(decision => {
    return decision.value?.responseRequiredDoc?.some(d => docId === getDocId(d?.value?.uploadedDocument?.document_url));
  });
};

const isValidResponseDocId = (docId: string, responds: TseRespondTypeItem[]): boolean => {
  return responds?.some(response => {
    if (response.value?.from === Applicant.CLAIMANT || response.value?.from === Applicant.RESPONDENT) {
      return response.value?.supportingMaterial?.some(
        doc => docId === getDocId(doc?.value?.uploadedDocument?.document_url)
      );
    } else if (response.value?.from === Applicant.ADMIN) {
      return response.value?.addDocument?.some(doc => docId === getDocId(doc?.value?.uploadedDocument?.document_url));
    }
    return false;
  });
};

const isDocOnNotificationPage = (docId: string, notifications: SendNotificationTypeItem[]): boolean => {
  if (!notifications?.length) {
    return false;
  }
  return notifications.some(
    notification =>
      isRequestDocId(notification, docId) ||
      isRequestTribunalResponseDocId(notification, docId) ||
      isRequestResponseDocId(notification, docId)
  );
};

const isRequestDocId = (notification: SendNotificationTypeItem, docId: string): boolean => {
  const docs = notification?.value?.sendNotificationUploadDocument ?? [];
  return docs.some(doc => getDocId(doc.value?.uploadedDocument?.document_url) === docId);
};

const isRequestTribunalResponseDocId = (notification: SendNotificationTypeItem, docId: string): boolean => {
  const docs =
    notification?.value?.respondNotificationTypeCollection?.flatMap(
      nt => nt.value?.respondNotificationUploadDocument ?? []
    ) ?? [];
  return docs.some(doc => doc.value.uploadedDocument && getDocId(doc.value.uploadedDocument.document_url) === docId);
};

const isRequestResponseDocId = (notification: SendNotificationTypeItem, docId: string): boolean => {
  const docs = notification?.value?.respondCollection?.flatMap(rc => rc.value?.supportingMaterial ?? []) ?? [];
  return docs.some(doc => doc.value.uploadedDocument && getDocId(doc.value.uploadedDocument.document_url) === docId);
};
