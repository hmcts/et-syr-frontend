import { CaseWithId } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PageUrls } from '../../definitions/constants';
import { LinkStatus, linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../RouterHelpers';

import { getApplicationDisplayByCode } from './ContactTribunalHelper';

export const getApplicationCollection = (
  userCase: CaseWithId,
  url: string,
  translations: AnyRecord
): GenericTseApplicationTypeItem[] => {
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
