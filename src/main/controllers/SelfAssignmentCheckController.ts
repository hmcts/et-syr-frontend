import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { FormFieldNames, PageUrls, ServiceErrors, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';
import ErrorUtils from '../utils/ErrorUtils';
import StringUtils from '../utils/StringUtils';
import { atLeastOneFieldIsChecked } from '../validators/validator';

const logger = getLogger('SelfAssignmentCheckController');

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
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.detailsCheckContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK)));
    }
    const selfAssignmentEnabled = await getFlagValue('et3-self-assignment', null);

    let caseAssignmentResponse;
    try {
      caseAssignmentResponse = await getCaseApi(req.session.user?.accessToken)?.assignCaseUserRole(req);
    } catch (error) {
      if (
        StringUtils.isNotBlank(error?.message) &&
        error.message
          .toString()
          .includes(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_USER_ALREADY_HAS_ROLE_EXCEPTION_CHECK_VALUE)
      ) {
        logger.error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + 'caseId: ' + req.session?.userCase?.id + ', ' + error);
        ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
          req,
          ValidationErrors.CASE_ALREADY_ASSIGNED_TO_SAME_USER,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
      } else if (
        StringUtils.isNotBlank(error?.message) &&
        error.message.toString().includes(ServiceErrors.ERROR_ASSIGNING_USER_ROLE_ALREADY_ASSIGNED_CHECK_VALUE)
      ) {
        logger.error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + 'caseId: ' + req.session?.userCase?.id + ', ' + error);
        ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
          req,
          ValidationErrors.CASE_ALREADY_ASSIGNED,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
      } else {
        logger.error(ServiceErrors.ERROR_ASSIGNING_USER_ROLE + 'caseId: ' + req.session?.userCase?.id + ', ' + error);
        ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
          req,
          ValidationErrors.API,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
      }
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK)));
    }

    // Old behavior - when flag is disabled
    if (!selfAssignmentEnabled) {
      if (!caseAssignmentResponse) {
        ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
          req,
          ValidationErrors.API,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK)));
      }
      return res.redirect(PageUrls.CASE_LIST);
    }

    // New behavior - when flag is enabled
    if (!caseAssignmentResponse?.data) {
      logger.error('Case assignment response data is null or undefined. caseId: ' + req.session?.userCase?.id);
      ErrorUtils.setManualErrorToRequestSessionWithRemovingExistingErrors(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CHECK)));
    }

    // Check if user is a professional user (legal representative)
    if (caseAssignmentResponse.data.status === 'PROFESSIONAL_USER') {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE)));
    }

    return res.redirect(`${PageUrls.CASE_LIST}${getLanguageParam(req.url)}`);
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
      formRespondentName: req.session.respondentNameFromForm,
    });
  };
}
