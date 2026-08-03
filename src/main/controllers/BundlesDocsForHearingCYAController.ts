import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { createLabelForHearing } from '../helpers/HearingDocumentsHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  createDownloadLinkForHearingDoc,
  getBundlesCyaContent,
} from '../helpers/controller/BundlesPrepareDocsCYAHelper';
import UrlUtils from '../utils/UrlUtils';

export default class BundlesDocsForHearingCYAController {
  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA as never, { returnObjects: true } as never),
    };

    const downloadLink = createDownloadLinkForHearingDoc(userCase?.hearingDocument);
    const foundHearing = userCase?.hearingCollection?.find(hearing => hearing.id === userCase.hearingDocumentsAreFor);
    const formattedSelectedHearing = foundHearing
      ? createLabelForHearing(foundHearing)
      : userCase?.formattedSelectedHearing;
    if (userCase) {
      userCase.formattedSelectedHearing = formattedSelectedHearing;
    }

    res.render(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, {
      ...translations,
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      submitLink: InterceptPaths.SUBMIT_BUNDLES_HEARING_DOCS_CYA + languageParam,
      cyaContent: getBundlesCyaContent(
        userCase,
        translations,
        languageParam,
        downloadLink,
        (userCase?.whoseHearingDocumentsAreYouUploading &&
          translations.whoseHearingDocument?.[userCase.whoseHearingDocumentsAreYouUploading]) ||
          userCase?.whoseHearingDocumentsAreYouUploading ||
          '',
        (userCase?.whatAreTheseDocuments &&
          translations.whatAreTheHearingDocuments?.[userCase.whatAreTheseDocuments]) ||
          userCase?.whatAreTheseDocuments ||
          '',
        formattedSelectedHearing ?? ''
      ),
    });
  };
}
