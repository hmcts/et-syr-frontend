import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { SummaryListRow } from '../definitions/govuk/govukSummaryList';
import {
  findSelectedGenericTseApplication,
  getAllTseApplicationCollection,
  getTseApplicationDetails,
  isResponseToTribunalRequired,
} from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationDisplayByCode } from '../helpers/controller/ContactTribunalHelper';

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    const selectedApplication = findSelectedGenericTseApplication(
      getAllTseApplicationCollection(userCase),
      req.params.appId
    );
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const applicationType = getApplicationDisplayByCode(selectedApplication.value.type, {
      ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
    });

    let appContent: SummaryListRow[] = [];
    try {
      appContent = getTseApplicationDetails(selectedApplication, req.url, {
        ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
        ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      });
    } catch (err) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const isRespondButton = isResponseToTribunalRequired(selectedApplication);
    const respondRedirectUrl =
      PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url);

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      applicationType,
      appContent,
      isRespondButton,
      respondRedirectUrl,
    });
  };
}
