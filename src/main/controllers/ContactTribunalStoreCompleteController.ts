import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, TranslationKeys, TseErrors } from '../definitions/constants';
import { getAppDetailsLink } from '../helpers/ApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLinkFromDocument, getSelectedStoredApplication } from '../helpers/StoredApplicationHelper';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('ContactTribunalStoreCompleteController');

export default class ContactTribunalStoreCompleteController {
  public get = (req: AppRequest, res: Response): void => {
    const languageParam = getLanguageParam(req.url);

    // get selected application
    const selectedApplication: GenericTseApplicationTypeItem = getSelectedStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // render page
    res.render(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_TRIBUNAL_STORE_COMPLETE, { returnObjects: true }),
      viewCorrespondenceLink: getAppDetailsLink(selectedApplication.id, getLanguageParam(req.url)),
      document: selectedApplication.value?.documentUpload,
      viewCorrespondenceFileLink: getLinkFromDocument(selectedApplication.value?.documentUpload),
      redirectUrl: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
