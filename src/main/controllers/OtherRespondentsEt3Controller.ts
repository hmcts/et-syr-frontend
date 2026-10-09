import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ET3CaseDetailsLinkNames, ET3CaseDetailsLinksStatuses, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getOtherRespondentEt3LinkStatus,
  getOtherRespondentEt3TableRows,
} from '../helpers/controller/OtherRespondentsEt3Helper';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import ET3Util from '../utils/ET3Util';

export default class OtherRespondentsEt3Controller {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const welshEnabled = await getFlagValue(TranslationKeys.WELSH_ENABLED, null);
    const redirectUrl = setUrlLanguage(req, PageUrls.OTHER_RESPONDENTS_ET3);
    const languageParam = getLanguageParam(req.url);
    await ET3Util.refreshRequestUserCase(req);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.OTHER_RESPONDENTS_ET3 as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
    };

    await markOtherRespondentEt3Viewed(req);

    res.render(TranslationKeys.OTHER_RESPONDENTS_ET3, {
      ...translations,
      PageUrls,
      hideContactUs: true,
      redirectUrl,
      languageParam,
      welshEnabled,
      tableRows: getOtherRespondentEt3TableRows(req, {
        et3FormText: translations.et3FormText,
        et3AttachmentText: translations.et3AttachmentText,
        acceptanceLetter: translations.acceptanceLetter,
      }),
    });
  };
}

const markOtherRespondentEt3Viewed = async (req: AppRequest): Promise<void> => {
  const selectedIndex = req.session?.selectedRespondentIndex;
  const selectedRespondent =
    selectedIndex === undefined || selectedIndex === null
      ? undefined
      : req.session?.userCase?.respondents?.[selectedIndex];
  const currentStatus = selectedRespondent?.et3CaseDetailsLinksStatuses?.[ET3CaseDetailsLinkNames.OtherRespondentEt3];
  if (getOtherRespondentEt3LinkStatus(req, currentStatus) !== LinkStatus.READY_TO_VIEW) {
    return;
  }

  const updatedCase = await ET3Util.updateCaseDetailsLinkStatuses(
    req,
    ET3CaseDetailsLinkNames.OtherRespondentEt3,
    LinkStatus.VIEWED
  );
  if (updatedCase) {
    req.session.userCase = updatedCase;
  }

  const respondent = req.session?.userCase?.respondents?.[selectedIndex];
  if (!respondent) {
    return;
  }
  if (!respondent.et3CaseDetailsLinksStatuses) {
    respondent.et3CaseDetailsLinksStatuses = new ET3CaseDetailsLinksStatuses();
  }
  respondent.et3CaseDetailsLinksStatuses[ET3CaseDetailsLinkNames.OtherRespondentEt3] = LinkStatus.VIEWED;
};
