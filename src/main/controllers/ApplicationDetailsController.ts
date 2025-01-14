import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { SummaryListRow } from '../definitions/govuk/govukSummaryList';
import { findSelectedGenericTseApplication } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationContent, isResponseToTribunalRequired } from '../helpers/controller/ApplicationDetailsHelper';
import { getApplicationDisplayByCode } from '../helpers/controller/ContactTribunalHelper';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const appContent: SummaryListRow[] = getApplicationContent(selectedApplication, req);
    if (!appContent) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationType: getApplicationDisplayByCode(selectedApplication.value.type, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent,
      isRespondButton: isResponseToTribunalRequired(selectedApplication),
      respondRedirectUrl:
        PageUrls.RESPOND_TO_TRIBUNAL.replace(':appId', selectedApplication.id) + getLanguageParam(req.url),
    });
  };
}
