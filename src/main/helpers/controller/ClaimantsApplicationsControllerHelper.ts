import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, Parties, TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

import { updateAppsInfo } from './YourRequestAndApplicationsHelper';

export const getClaimantsApplications = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const userCase = req.session.userCase;
  const url = req.url;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  const claimantApps = (userCase.genericTseApplicationCollection || []).filter(
    app => app.value?.applicant === Applicant.CLAIMANT && isClaimantAppsShare(app)
  );
  claimantApps.forEach(app => {
    updateAppsInfo(app, translations, url);
  });
  return claimantApps;
};

const isClaimantAppsShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value?.copyToOtherPartyYesOrNo === YesOrNo.YES) {
    return true;
  }
  return app.value?.respondCollection?.some((response: TseRespondTypeItem) => {
    isAdminNotifyBothParty(response);
  });
};

const isAdminNotifyBothParty = (response: TseRespondTypeItem): boolean => {
  return response.value?.from === Applicant.ADMIN && response.value?.selectPartyNotify === Parties.BOTH_PARTIES;
};
