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
 * Get application display with translation
 * @param app application
 * @param translations translation
 */
export const getApplicationDisplay = (app: GenericTseApplicationType, translations: AnyRecord): string => {
  return app.applicant === Applicant.RESPONDENT
    ? getApplicationDisplayByCode(app.type, translations)
    : getApplicationDisplayByClaimantCode(app.type, translations);
};

/**
 * Check if application is Type A or Type B
 * @param app application in GenericTseApplicationType
 */
export const isTypeAOrB = (app: GenericTseApplicationType): boolean => {
  if (!app?.applicant || !app?.type) {
    return undefined;
  }

  const matchingApp = Object.values(application).find(appData =>
    app.applicant === Applicant.RESPONDENT ? appData.code === app.type : appData.claimant === app.type
  );
  return matchingApp ? matchingApp.type === ApplicationType.A || matchingApp.type === ApplicationType.B : undefined;
};
