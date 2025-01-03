import { AppRequest } from '../../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls, TranslationKeys } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

import { getApplicationDisplayByCode } from './ContactTribunalHelper';

export const getApplicationCollection = (req: AppRequest): GenericTseApplicationTypeItem[] => {
  const userCase = req.session.userCase;
  const url = req.url;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
  };
  const claimantApps = (userCase.genericTseApplicationCollection || []).filter(
    app => app.value?.applicant === Applicant.RESPONDENT
  );
  claimantApps.forEach(app => {
    app.linkValue = getApplicationDisplayByCode(app.value.type, translations);
    app.redirectUrl = PageUrls.APPLICATION_DETAILS.replace(':appId', app.id) + getLanguageParam(url);
    app.statusColor = linkStatusColorMap.get(<LinkStatus>app.value.status);
    app.displayStatus = translations[app.value.status];
  });
  return claimantApps;
};
