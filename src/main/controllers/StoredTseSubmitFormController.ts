import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { getApplicationDisplay } from '../helpers/GenericTseApplicationHelper';
import { getApplicationContent } from '../helpers/controller/ApplicationDetailsHelper';
import { getYourStoredApplication } from '../helpers/controller/StoredToSubmitControllerHelper';
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

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_TSE_SUBMIT_FORM, { returnObjects: true }),
      applicationType: getApplicationDisplay(selectedApplication.value, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication.value, req),
      viewCorrespondenceLink: '',
      document: selectedApplication.value?.documentUpload,
      viewCorrespondenceFileLink: '',
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
