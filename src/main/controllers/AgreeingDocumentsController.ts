import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { AgreedDocuments, CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput, ValidationCheck } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';
import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

const disputedDocumentsTextFormFields = {
  type: 'charactercount',
  label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWithBut.label,
  labelSize: 's',
  maxlength: 2500,
  validator: isContentCharsOrLessAndNotEmpty(2500) as ValidationCheck,
} as FormInput;

const notAgreedTextFormFields = {
  type: 'charactercount',
  label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWithNo.label,
  labelSize: 's',
  maxlength: 2500,
  validator: isContentCharsOrLessAndNotEmpty(2500) as ValidationCheck,
} as FormInput;

export default class AgreeingDocumentsController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      bundlesRespondentAgreedDocWith: {
        type: 'radios',
        label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWith.label,
        values: [
          {
            label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWith.yes,
            value: AgreedDocuments.YES,
          },
          {
            label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWith.agreedBut,
            value: AgreedDocuments.AGREEDBUT,
            subFields: {
              bundlesRespondentAgreedDocWithBut: disputedDocumentsTextFormFields,
            },
          },
          {
            label: (l: AnyRecord): string => l.bundlesRespondentAgreedDocWith.notAgreed,
            value: AgreedDocuments.NOTAGREED,
            subFields: {
              bundlesRespondentAgreedDocWithNo: notAgreedTextFormFields,
            },
          },
        ],
        validator: isOptionSelected as ValidationCheck,
      },
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.AGREEING_DOCUMENTS + getLanguageParam(req.url));
    }

    req.session.userCase.bundlesRespondentAgreedDocWith = formData.bundlesRespondentAgreedDocWith;
    req.session.userCase.bundlesRespondentAgreedDocWithBut =
      formData.bundlesRespondentAgreedDocWith === AgreedDocuments.AGREEDBUT
        ? formData.bundlesRespondentAgreedDocWithBut
        : undefined;
    req.session.userCase.bundlesRespondentAgreedDocWithNo =
      formData.bundlesRespondentAgreedDocWith === AgreedDocuments.NOTAGREED
        ? formData.bundlesRespondentAgreedDocWithNo
        : undefined;

    // Next page in the hearing documents flow
    res.redirect(PageUrls.ABOUT_HEARING_DOCUMENTS + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.AGREEING_DOCUMENTS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.AGREEING_DOCUMENTS, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
