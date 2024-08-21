import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helpers/ApiFormatter';
import { assignFormData } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getCaseApi } from '../services/CaseService';
import { isValidCaseReferenceId } from '../validators/numeric-validator';
import { isFieldFilledIn } from '../validators/validator';

export default class SelfAssignmentDataCheckController {
  private readonly form: Form;
  private readonly caseReferenceIdContent: FormContent = {
    fields: {
      id: {
        id: 'caseReferenceId',
        name: 'caseReferenceId',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isValidCaseReferenceId,
        label: (l: AnyRecord): string => l.caseReferenceId,
      },
      respondentName: {
        id: 'respondentName',
        name: 'respondentName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.respondentName,
      },
      firstName: {
        id: 'claimantFirstName',
        name: 'claimantFirstName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.claimantFirstName,
      },
      lastName: {
        id: 'claimantLastName',
        name: 'claimantLastName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        validator: isFieldFilledIn,
        label: (l: AnyRecord): string => l.claimantLastName,
      },
      hiddenErrorField: {
        id: 'hiddenErrorField',
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = [];
    let caseReferenceId: string = req.body.id;
    if (caseReferenceId) {
      caseReferenceId = caseReferenceId.replace('-', '');
      req.session.userCase = <CaseWithId>{
        createdDate: '',
        lastModified: '',
        state: undefined,
        id: caseReferenceId,
        respondentName: formData.respondentName,
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
    }
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length === 0) {
      const caseData = (
        await getCaseApi(req.session.user?.accessToken).getCaseByIdRespondentAndClaimantNames(
          formData.id,
          formData.respondentName,
          formData.firstName,
          formData.lastName
        )
      ).data;
      if (caseData) {
        req.session.userCase = fromApiFormat(caseData);
        return res.redirect(setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_DETAILS));
      }
      errors.push({ errorType: 'api', propertyName: 'hiddenErrorField' });
      req.session.errors = errors;
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
    const redirectUrl = setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER);
    const caseReferenceIdContentForm = this.caseReferenceIdContent;
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SELF_ASSIGNMENT_CASE_REFERENCE_NUMBER as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: caseReferenceIdContentForm,
      sessionErrors: req.session.errors,
      userCase: req.session?.userCase,
    });
  };
}
