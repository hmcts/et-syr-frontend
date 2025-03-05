import { AppRequest } from '../definitions/appRequest';
import {
  GenericTseApplicationType,
  GenericTseApplicationTypeItem,
} from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../definitions/constants';
import { ApplicationType, application } from '../definitions/contact-tribunal-applications';
import { AnyRecord } from '../definitions/util-types';

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
  const matchingApp = Object.values(application).find(appData =>
    isApplicantRespondent(app) ? appData.code === app?.type : appData.claimant === app?.type
  );
  return matchingApp ? matchingApp.type === ApplicationType.A || matchingApp.type === ApplicationType.B : undefined;
};
