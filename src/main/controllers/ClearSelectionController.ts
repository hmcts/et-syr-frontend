import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, ParameterizedUrls } from '../definitions/constants';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';

export default class ClearSelectionController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl: string = setUrlLanguage(req, PageUrls.RESPONDENT_HEARING_PANEL_PREFERENCE);
    if (StringUtils.isNotBlank(req?.params?.pageName) && req.params.pageName === ParameterizedUrls.CLEAR_SELECTION) {
      if (ObjectUtils.isNotEmpty(req.session?.userCase)) {
        req.session.userCase.respondentHearingPanelPreference = undefined;
        req.session.userCase.respondentHearingPanelPreferenceReasonJudge = undefined;
        req.session.userCase.respondentHearingPanelPreferenceReasonPanel = undefined;
      }
    }
    res.redirect(redirectUrl);
  }
}
