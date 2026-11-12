import { AppRequest } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import {
  ET3CaseDetailsLinkNames,
  ET3CaseDetailsLinksStatuses,
  LinkStatus,
  linkStatusColorMap,
} from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getET3CaseDetailsLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../ResponseHubHelper';
import { getLanguageParam } from '../RouterHelpers';

const SectionIndexToEt3CaseDetailsLinkNamesForRep: ET3CaseDetailsLinkNames[][] = [
  [ET3CaseDetailsLinkNames.PersonalDetails],
  [ET3CaseDetailsLinkNames.ET1ClaimForm, ET3CaseDetailsLinkNames.ClaimantContactDetails],
  [ET3CaseDetailsLinkNames.RespondentResponse, ET3CaseDetailsLinkNames.RespondentContactDetails],
  [ET3CaseDetailsLinkNames.HearingDetails],
  [
    ET3CaseDetailsLinkNames.YourRequestsAndApplications,
    ET3CaseDetailsLinkNames.ClaimantApplications,
    ET3CaseDetailsLinkNames.OtherRespondentApplications,
    ET3CaseDetailsLinkNames.ContactTribunal,
  ],
  [ET3CaseDetailsLinkNames.TribunalNotification],
  [ET3CaseDetailsLinkNames.TribunalJudgements],
  [ET3CaseDetailsLinkNames.Documents],
];

interface SectionItem {
  title: {
    text: string;
  };
  hint?: {
    text: string;
  };
  href?: string;
  status: {
    text?: string;
    tag?: {
      text: string;
      classes: string;
    };
  };
}

interface Section {
  title: string;
  items: SectionItem[];
}

function getSectionItems(
  translations: AnyRecord,
  linkName: ET3CaseDetailsLinkNames,
  status: LinkStatus,
  eT3CaseDetailsLinksUrlMap: Map<string, string>
): SectionItem {
  const shouldLinkClickable: boolean = shouldCaseDetailsLinkBeClickable(status);
  const title = {
    text: translations[linkName],
  };
  const tag = {
    text: translations[status],
    classes: 'govuk-tag' + linkStatusColorMap.get(status),
  };
  return shouldLinkClickable
    ? {
        title,
        href: eT3CaseDetailsLinksUrlMap.get(linkName),
        status: { tag },
      }
    : {
        title,
        status: { tag },
      };
}

function getSection(
  translations: AnyRecord,
  index: number,
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  eT3CaseDetailsLinksUrlMap: Map<string, string>
): Section {
  return {
    title: translations[`section${index + 1}`],
    items: SectionIndexToEt3CaseDetailsLinkNamesForRep[index].map(linkName => {
      const status = et3CaseDetailsLinksStatuses[linkName];
      return getSectionItems(translations, linkName, status, eT3CaseDetailsLinksUrlMap);
    }),
  };
}

export function getSectionsList(
  et3CaseDetailsLinksStatuses: ET3CaseDetailsLinksStatuses,
  selectedRespondent: RespondentET3Model,
  req: AppRequest
): Section[] {
  const languageParam = getLanguageParam(req.url);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER as never, { returnObjects: true } as never),
  };
  const eT3CaseDetailsLinksUrlMap = getET3CaseDetailsLinksUrlMap(languageParam, selectedRespondent);
  return Array.from(Array(SectionIndexToEt3CaseDetailsLinkNamesForRep.length)).map((__ignored, index) => {
    return getSection(translations, index, et3CaseDetailsLinksStatuses, eT3CaseDetailsLinksUrlMap);
  });
}
