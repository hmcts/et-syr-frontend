import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CaseState, ET3Status } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';

export default class CaseListController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    await new Promise(f => setTimeout(f, 1000));
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };
    const userCases = await getUserCasesByLastModified(req);
    const languageParam = getLanguageParam(req.url);
    const newSelfAssignmentRequestUrl = PageUrls.SELF_ASSIGNMENT_FORM + languageParam;
    const usersApplications = getUserApplications(userCases, translations, languageParam);
    const et3NotCompleted = [];
    const et3Completed = [];
    for (const application of usersApplications) {
      if (application.userCase?.state === CaseState.ACCEPTED) {
        for (const respondent of application.userCase.respondents) {
          if (req.session.user.id === respondent.idamId) {
            const respondentName = ET3Util.getUserNameByRespondent(respondent);
            application.completionStatus = ET3Util.getOverallStatus(respondent, translations);
            if (StringUtils.isBlank(respondent.et3Status) || respondent.et3Status === ET3Status.IN_PROGRESS) {
              et3NotCompleted.push(ET3Util.getUserApplicationsListItem(application, respondentName, respondent));
            } else {
              et3Completed.push(ET3Util.getUserApplicationsListItem(application, respondentName, respondent));
            }
          }
        }
      }
    }
    req.session.userCase = undefined;
    req.session.errors = [];
    res.render(TranslationKeys.CASE_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_LIST as never, { returnObjects: true } as never),
      form: <FormContent>{},
      sessionErrors: req.session?.errors || [],
      PageUrls,
      user: req.session?.user,
      usersApplications,
      languageParam,
      newSelfAssignmentRequestUrl,
      et3NotCompleted,
      et3Completed,
    });
  };
}
