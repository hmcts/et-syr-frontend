import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCaseApi } from '../services/CaseService';
import ErrorUtils from '../utils/ErrorUtils';
import { atLeastOneFieldIsChecked } from '../validators/validator';

export default class SelfAssignmentCheckController {
  private readonly form: Form;
  private readonly detailsCheckContent: FormContent = {
    fields: {
      selfAssignmentCheck: {
        id: FormFieldNames.SELF_ASSIGNMENT_CHECK_FIELDS.SELF_ASSIGNMENT_CHECK,
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
            name: FormFieldNames.SELF_ASSIGNMENT_CHECK_FIELDS.SELF_ASSIGNMENT_CHECK,
            label: (l: AnyRecord) => l.confirmation.checkbox,
            value: YesOrNo.YES,
          },
        ],
      },
      hiddenErrorField: {
        id: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        type: 'text',
        hidden: true,
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
    let caseAssignmentResponse;
    try {
      caseAssignmentResponse = await getCaseApi(req.session.user?.accessToken)?.assignCaseUserRole(req);
    } catch (error) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
    }
    if (!caseAssignmentResponse) {
      return res.redirect(req.url);
    }
    return res.redirect(PageUrls.CASE_LIST);
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
      user: req.session?.user,
      sessionErrors: req.session.errors,
    });
  };
}
