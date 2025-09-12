import { AppRequest, UserDetails } from '../definitions/appRequest';
import { Document } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls } from '../definitions/constants';
import { RespondentTse } from '../definitions/respondentTse';
import DocumentUtils from '../utils/DocumentUtils';

import { getApplicationByCode } from './ApplicationHelper';
import { isYourApplication } from './controller/YourRequestAndApplicationsHelper';

/**
 * Get selected stored application by id
 * @param req request
 */
export const getSelectedStoredApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  return getYourStoredApplicationList(req)?.find(it => it.id === req.params.appId);
};

/**
 * Get user's stored applications
 * @param req request
 */
export const getYourStoredApplicationList = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  return req.session.userCase.tseRespondentStoredCollection?.filter(app =>
    isYourApplication(app.value, req.session.user)
  );
};

/**
 * Map new application to respondentTse
 */
export const mapNewRespondentTse = (req: AppRequest): RespondentTse => {
  const { user, userCase } = req.session;
  const appType = getApplicationByCode(userCase.contactApplicationType);
  return {
    respondentIdamId: user.id,
    contactApplicationType: userCase.contactApplicationType,
    contactApplicationClaimantType: appType ? appType.claimant : null,
    contactApplicationText: userCase.contactApplicationText,
    contactApplicationFile: userCase.contactApplicationFile,
    copyToOtherPartyYesOrNo: userCase.copyToOtherPartyYesOrNo,
    copyToOtherPartyText: userCase.copyToOtherPartyText,
  };
};

/**
 * Map stored application to respondentTse
 * @param user user
 * @param app application
 */
export const mapStoredRespondentTse = (user: UserDetails, app: GenericTseApplicationTypeItem): RespondentTse => {
  const appType = getApplicationByCode(app.value.type);
  return {
    respondentIdamId: user.id,
    contactApplicationType: app.value.type,
    contactApplicationClaimantType: appType ? appType.claimant : null,
    contactApplicationText: app.value.details,
    contactApplicationFile: app.value.documentUpload,
    copyToOtherPartyYesOrNo: app.value.copyToOtherPartyYesOrNo,
    storedApplicationId: app.id,
  };
};

/**
 * Get submit stored application link
 * @param appId application id
 * @param languageParam language parameter
 */
export const getSubmitStoredAppLink = (appId: string, languageParam: string): string => {
  return PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', appId) + languageParam;
};

/**
 * Get link to view supporting material from document
 * @param doc document
 */
export const getLinkFromDocument = (doc: Document): string => {
  if (!doc) {
    return '';
  }
  const documentId = DocumentUtils.findDocumentIdByURL(doc.document_url);
  return PageUrls.GET_SUPPORTING_MATERIAL.replace(':docId', documentId);
};
