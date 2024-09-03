import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, Roles, TranslationKeys } from "../definitions/constants";
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCaseApi } from '../services/CaseService';
import { atLeastOneFieldIsChecked } from '../validators/validator';

export default class SelfAssignmentCheckController {
  private readonly form: Form;
  private readonly detailsCheckContent: FormContent = {
    fields: {
      selfAssignmentCheck: {
        id: 'selfAssignmentCheck',
        type: 'checkboxes',
        labelHidden: false,
        label: (l: AnyRecord) => l.h1,
        labelSize: 'xl',
        isPageHeading: true,
        hint: (l: AnyRecord) => l.hint,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            id: 'confirmation',
            name: 'selfAssignmentCheck',
            label: (l: AnyRecord) => l.confirmation.checkbox,
            value: YesOrNo.YES,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.detailsCheckContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    const caseAssignmentResponse = await getCaseApi(req.session.user?.accessToken)?.assignCaseUserRole(
      req.session.userCase.id,
      req.session.user.id,
      Roles.DEFENDANT_ROLE_WITH_BRACKETS
    );
    if (!caseAssignmentResponse) {
      return res.redirect(req.url);
    }
    return res.redirect(PageUrls.RESPONDENT_CASE_LIST);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK);
    const detailsCheckContent = this.detailsCheckContent;
    res.render(TranslationKeys.SELF_ASSIGNMENT_CHECK, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SELF_ASSIGNMENT_CHECK as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: detailsCheckContent,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}
