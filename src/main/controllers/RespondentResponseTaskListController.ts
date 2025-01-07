import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ApiDocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { CLAIM_TYPES, PageUrls, TranslationKeys, languages } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import {
  ET3HubLinkNames,
  SectionIndexToEt3HubLinkNamesWithEmployersContractClaim,
  SectionIndexToEt3HubLinkNamesWithoutEmployersContractClaim,
  getResponseHubLinkStatusesByRespondentHubLinkStatuses,
  linkStatusColorMap,
} from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getET3HubLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../helpers/ResponseHubHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import DocumentUtils from '../utils/DocumentUtils';

export default class RespondentResponseTaskListController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.NOT_IMPLEMENTED);
    const selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
    const et3HubLinksStatuses = getResponseHubLinkStatusesByRespondentHubLinkStatuses(
      selectedRespondent.et3HubLinksStatuses
    );
    const languageParam = getLanguageParam(req.url);
    let et1Form: ApiDocumentTypeItem;
    if (languageParam === languages.WELSH_URL_PARAMETER) {
      et1Form = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        req?.session?.userCase?.documentCollection,
        languages.WELSH_URL_PARAMETER
      );
    } else {
      et1Form = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        req?.session?.userCase?.documentCollection,
        languages.ENGLISH_URL_PARAMETER
      );
    }
    const acasCertificate: ApiDocumentTypeItem = DocumentUtils.findAcasCertificateByRequest(req);
    let sectionIndexToEt3HubLinkNames: ET3HubLinkNames[][] = SectionIndexToEt3HubLinkNamesWithoutEmployersContractClaim;
    if (
      req.session?.userCase?.typeOfClaim?.includes(CLAIM_TYPES.BREACH_OF_CONTRACT) ||
      req.session?.userCase?.typeOfClaim?.includes(TypesOfClaim.BREACH_OF_CONTRACT)
    ) {
      sectionIndexToEt3HubLinkNames = SectionIndexToEt3HubLinkNamesWithEmployersContractClaim;
    }
    const sections = Array.from(Array(sectionIndexToEt3HubLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: sectionIndexToEt3HubLinkNames[index].map(linkName => {
          const status = et3HubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: shouldCaseDetailsLinkBeClickable(status),
            url: () => getET3HubLinksUrlMap(languageParam).get(linkName),
            statusColor: () => linkStatusColorMap.get(status),
          };
        }),
      };
    });
    res.render(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      sections,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
      et1FormId: et1Form?.id,
      acasCertificateId: acasCertificate?.id,
    });
  }
}
