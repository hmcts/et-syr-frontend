import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helpers/ApiFormatter';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCaseApi } from '../services/CaseService';
import { isValidCaseReferenceId } from '../validators/numeric-validator';

export default class SelfAssignmentCaseReferenceNumberController {
  private readonly form: Form;
  private readonly onlineCaseReferenceNumberContent: FormContent = {
    fields: {
      onlineCaseReferenceNumber: {
        id: 'onlineCaseReferenceNumber',
        name: 'onlineCaseReferenceNumber',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidCaseReferenceId,
        label: (l: AnyRecord): string => l.onlineCaseReferenceNumber,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.onlineCaseReferenceNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length === 0) {
      req.session.errors = [];
      try {
        let caseId: string = req.body.onlineCaseReferenceNumber;
        caseId = caseId.replace('-', '');
        req.session.userCase = fromApiFormat(
          (await getCaseApi(req.session.user?.accessToken).getUserCase(caseId)).data
        );
      } catch (error) {
        const errorDetails = {
          errorType: 'invalid',
          propertyName: 'onlineCaseReferenceNumber',
        };
        errors.push(errorDetails);
        req.session.errors = errors;
        return res.redirect(req.url);
      }
      return res.redirect(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_DETAILS));
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
    const redirectUrl = setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER);
    const onlineCaseReferenceNumberContentForm = this.onlineCaseReferenceNumberContent;
    res.render(TranslationKeys.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: onlineCaseReferenceNumberContentForm,
      sessionErrors: req.session.errors,
    });
  };
}
