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
  const claimantItems = (userCase.genericTseApplicationCollection || []).filter(
    item => item.value?.applicant === Applicant.RESPONDENT
  );
  claimantItems.forEach(item => {
    item.linkValue = getApplicationDisplayByCode(item.value.type, translations);
    item.redirectUrl = PageUrls.APPLICATION_DETAILS.replace(':appId', item.id) + getLanguageParam(url);
    item.statusColor = linkStatusColorMap.get(<LinkStatus>item.value.status);
    item.displayStatus = translations[item.value.status];
  });
  return claimantItems;
};
