import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { assignFormData } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import SelfAssignmentFormControllerHelper from '../helpers/controller/SelfAssignmentFormControllerHelper';
import { getCaseApi } from '../services/CaseService';
import ErrorUtils from '../utils/ErrorUtils';
import { isValidCaseReferenceId } from '../validators/numeric-validator';
import { isFieldFilledIn } from '../validators/validator';

export default class SelfAssignmentFormController {
  private readonly form: Form;
  private readonly caseReferenceIdContent: FormContent = {
    fields: {
      id: {
        id: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CASE_REFERENCE_ID,
        name: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CASE_REFERENCE_ID,
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidCaseReferenceId,
        label: (l: AnyRecord): string => l.caseReferenceId,
      },
      respondentName: {
        id: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.RESPONDENT_NAME,
        name: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.RESPONDENT_NAME,
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.respondentName,
      },
      firstName: {
        id: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CLAIMANT_FIRST_NAME,
        name: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CLAIMANT_FIRST_NAME,
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.claimantFirstName,
      },
      lastName: {
        id: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CLAIMANT_LAST_NAME,
        name: FormFieldNames.SELF_ASSIGNMENT_FORM_FIELDS.CLAIMANT_LAST_NAME,
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.claimantLastName,
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
    this.form = new Form(<FormFields>this.caseReferenceIdContent.fields);
  }

  /**
   * Checks all the input values of the SelfAssignmentFormController. If any of the field is not entered returns
   * validator error. It also returns validation error when id value doesn't match with the regex values of
   * /^[0-9]{16}$/ and /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/
   * @param req Request value of the session.
   * @param res Response value of the session.
   */
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = [];
    req.session.userCase = SelfAssignmentFormControllerHelper.generateBasicUserCaseBySelfAssignmentFormData(formData);
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length === 0) {
      try {
        const caseData = (await getCaseApi(req.session.user?.accessToken)?.getCaseByApplicationRequest(req))?.data;
        if (caseData) {
          req.session.userCase = formatApiCaseDataToCaseWithId(caseData);
          SelfAssignmentFormControllerHelper.setRespondentName(req, caseData);
          return res.redirect(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK));
        }
      } catch (error) {
        ErrorUtils.setManualErrorToRequestSession(
          req,
          ValidationErrors.EXCEPTION,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
        return res.redirect(req.url);
      }
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(req.url);
    } else {
      req.session.errors = errors;
      req.session.save(err => {
        if (err) {
          throw err;
        }
        return res.redirect(req.url);
      });
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_FORM);
    const caseReferenceIdContentForm = this.caseReferenceIdContent;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SELF_ASSIGNMENT_FORM, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SELF_ASSIGNMENT_FORM as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: caseReferenceIdContentForm,
      sessionErrors: req.session.errors,
      userCase: req.session?.userCase,
    });
  };
}
