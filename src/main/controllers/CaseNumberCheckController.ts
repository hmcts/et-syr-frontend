import { AxiosResponse } from 'axios';
import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { FormFieldNames, LegacyUrls, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import { getCaseApi } from '../services/CaseService';
import ErrorUtils from '../utils/ErrorUtils';
import { isValidEthosCaseReference } from '../validators/validator';

export default class CaseNumberCheckController {
  private readonly form: Form;
  private readonly ethosCaseReferenceContent: FormContent = {
    fields: {
      ethosCaseReference: {
        id: FormFieldNames.CASE_NUMBER_CHECK_FIELDS.ETHOS_CASE_REFERENCE,
        name: FormFieldNames.CASE_NUMBER_CHECK_FIELDS.ETHOS_CASE_REFERENCE,
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidEthosCaseReference,
        label: (l: AnyRecord): string => l.caseNumber,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.ethosCaseReferenceContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    if (!req.session.userCase) {
      req.session.userCase = { createdDate: '', id: '', lastModified: '', state: undefined };
    }
    req.session.userCase.ethosCaseReference = formData.ethosCaseReference;
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length > 0) {
      req.session.errors = errors;
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CASE_NUMBER_CHECK)));
    }
    req.session.errors = [];
    try {
      req.session.caseNumberChecked = false;
      const isReformCase: AxiosResponse<string> = await getCaseApi(
        req.session.user?.accessToken
      ).checkEthosCaseReference(formData.ethosCaseReference);
      if ((isReformCase?.data && isReformCase.data !== 'false') || isReformCase?.data === 'true') {
        req.session.caseNumberChecked = true;
        return res.redirect(PageUrls.CHECKLIST + languageParam);
      } else {
        return res.redirect(LegacyUrls.ET3);
      }
    } catch (error) {
      ErrorUtils.setManualErrorToRequestSession(
        req,
        ValidationErrors.API,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
    }

    return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CASE_NUMBER_CHECK)));
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CASE_NUMBER_CHECK);
    const caseReferenceIdContentForm = this.ethosCaseReferenceContent;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CASE_NUMBER_CHECK, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CASE_NUMBER_CHECK as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: caseReferenceIdContentForm,
      sessionErrors: req.session.errors,
      userCase: req.session?.userCase,
    });
  };
}
