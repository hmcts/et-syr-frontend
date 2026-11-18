import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCyaContent } from '../helpers/controller/ContactTribunalCYAHelper';
import UrlUtils from '../utils/UrlUtils';

export default class ContactTribunalCYAController {
  public get = (req: AppRequest, res: Response): void => {
    const contactTheTribunal = req.t(TranslationKeys.CONTACT_TRIBUNAL_CONTACT_TRIBUNAL, {
      returnObjects: true,
    }) as AnyRecord;
    res.render(TranslationKeys.CONTACT_TRIBUNAL_CYA, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      documentTitleSuffix: contactTheTribunal.title,
      hideContactUs: true,
      ethosCaseReference: req.session.userCase.ethosCaseReference,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      cyaContent: getCyaContent(req),
      submitLink: InterceptPaths.CONTACT_TRIBUNAL_SUBMIT + getLanguageParam(req.url),
    });
  };
}
