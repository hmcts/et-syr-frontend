import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { getLinkFromDocument } from '../helpers/DocumentHelpers';
import { getApplicationDisplay } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationContent } from '../helpers/controller/ApplicationDetailsHelper';
import { getAppDetailsLink, getYourStoredApplication } from '../helpers/controller/StoredTseSubmitFormControllerHelper';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('StoredToSubmitController');

export default class StoredTseSubmitFormController {
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = getYourStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    res.render(TranslationKeys.STORED_TSE_SUBMIT_FORM, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_TSE_SUBMIT_FORM, { returnObjects: true }),
      applicationType: getApplicationDisplay(selectedApplication.value, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication.value, req),
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      document: selectedApplication.value?.documentUpload,
      viewCorrespondenceFileLink: getLinkFromDocument(selectedApplication.value.documentUpload),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
