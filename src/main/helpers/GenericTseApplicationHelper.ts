import { AppRequest, UserDetails } from '../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesRespond } from '../definitions/constants';
import { ApplicationType, application } from '../definitions/contact-tribunal-applications';
import { AnyRecord } from '../definitions/util-types';
import ObjectUtils from '../utils/ObjectUtils';

import { getApplicationDisplayByClaimantCode, getApplicationDisplayByCode } from './ApplicationHelper';

/**
 * Return selected application
 * @param req request
 */
export const findSelectedGenericTseApplication = (req: AppRequest): GenericTseApplicationTypeItem => {
  const items = req.session.userCase?.genericTseApplicationCollection;
  const param = req.params.appId;
  return items?.find(it => it.id === param);
};

/**
 * Check if application applied by Respondent or Respondent Representative
 * @param app application
 */
export const isApplicantRespondent = (app: GenericTseApplicationType): boolean => {
  return app?.applicant === Applicant.RESPONDENT || app?.applicant === Applicant.RESPONDENT_REP;
};

/**
 * Check if application applied by Claimant or Claimant Representative
 * @param app application
 */
export const isApplicantClaimant = (app: GenericTseApplicationType): boolean => {
  return app?.applicant === Applicant.CLAIMANT || app?.applicant === Applicant.CLAIMANT_REP;
};

/**
 * Get application display with translation
 * @param app application
 * @param translations translation
 */
export const getApplicationDisplay = (app: GenericTseApplicationType, translations: AnyRecord): string => {
  return isApplicantRespondent(app)
    ? getApplicationDisplayByCode(app.type, translations)
    : getApplicationDisplayByClaimantCode(app.type, translations);
};

/**
 * Check if application is Type A or Type B
 * @param app application in GenericTseApplicationType
 */
export const isTypeAOrB = (app: GenericTseApplicationType): boolean => {
  if (app?.type === undefined || app?.applicant === undefined) {
    return undefined;
  }
  const matchingApp = Object.values(application).find(appData =>
    isApplicantRespondent(app)
      ? appData.code === app?.type
      : appData.claimant === app?.type || appData.claimantLegalRep === app?.type
  );
  return matchingApp ? matchingApp.type === ApplicationType.A || matchingApp.type === ApplicationType.B : undefined;
};

/**
 * Boolean if respond to Application is required.
 * @param app selected application
 * @param user user in request
 */
export const isResponseToTribunalRequired = (app: GenericTseApplicationType, user: UserDetails): boolean => {
  if (!app || ObjectUtils.isEmpty(app.respondCollection) || !user) {
    return false;
  }

  const lastAdminRespondIndex = getLastAdminRespondIndex(app.respondCollection);
  if (lastAdminRespondIndex === -1) {
    return false;
  }

  const lastUserRespondIndex = getLastUserRespondIndex(app.respondCollection, user);
  if (lastUserRespondIndex === -1) {
    return true;
  }

  return lastAdminRespondIndex > lastUserRespondIndex;
};

const getLastAdminRespondIndex = (respondCollection: TseRespondTypeItem[]): number => {
  const indexes = respondCollection.map((response, index) =>
    response.value.from === Applicant.ADMIN &&
    (response.value.selectPartyRespond === PartiesRespond.BOTH_PARTIES ||
      response.value.selectPartyRespond === PartiesRespond.RESPONDENT)
      ? index
      : -1
  );
  return Math.max(...indexes);
};

const getLastUserRespondIndex = (respondCollection: TseRespondTypeItem[], user: UserDetails): number => {
  const userIndexes = respondCollection.map((response, index) =>
    response.value.from === Applicant.RESPONDENT && response.value.fromIdamId === user.id ? index : -1
  );
  return Math.max(...userIndexes);
};
