import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import {
  GenericTseApplicationTypeItem,
  TseRespondTypeItem,
} from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, Parties, TranslationKeys } from '../../definitions/constants';
import { application } from '../../definitions/contact-tribunal-applications';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

import { getApplicationDisplayByCode } from './ContactTribunalHelper';

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
    app.linkValue = getApplicationDisplayByCode(app.value.type, translations);
    app.redirectUrl = PageUrls.CLAIMANTS_APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(url);
    app.statusColor = linkStatusColorMap.get(<LinkStatus>app.value.status);
    app.displayStatus = translations[app.value.status];
  });
  return claimantApps;
};

const isClaimantAppsShare = (app: GenericTseApplicationTypeItem): boolean => {
  if (app.value.type === application.ORDER_WITNESS_ATTEND.code) {
    return false;
  }
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
