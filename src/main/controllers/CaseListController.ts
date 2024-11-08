import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getUserApplications, getUserCasesByLastModified } from '../services/CaseSelectionService';

export default class CaseListController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };
    const userCases = await getUserCasesByLastModified(req);
    const languageParam = getLanguageParam(req.url);
    const newSelfAssignmentRequestUrl = PageUrls.SELF_ASSIGNMENT_FORM + languageParam;
    const usersApplications = getUserApplications(userCases, translations, languageParam);
    req.session.userCase = undefined;
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
      caseDetailsUrl: PageUrls.CASE_DETAILS_WITHOUT_CASE_ID_PARAMETER,
    });
  };
}
