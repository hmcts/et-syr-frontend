import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

export default class RespondToTribunalSupportingMaterialController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      responseText: {
        type: 'charactercount',
        hint: (l: AnyRecord): string => l.responseText.hint,
        maxlength: 2500,
        validator: isContentCharsOrLessAndNotEmpty(2500),
      },
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: (l: AnyRecord): string => l.files.title,
        type: 'insetFields',
        subFields: {
          supportingMaterialFile: {
            id: 'supportingMaterialFile',
            classes: 'govuk-label',
            labelHidden: false,
            labelSize: 'm',
            type: 'upload',
          },
          upload: {
            label: (l: AnyRecord): string => l.files.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            type: 'button',
            name: 'upload',
            value: 'true',
          },
        },
      },
      filesUploaded: {
        label: (l: AnyRecord): string => l.files.uploaded,
        type: 'summaryList',
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // TODO: Upload Supporting Material
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    return res.redirect(PageUrls.RESPOND_TO_TRIBUNAL_COPY_TO_ORDER_PARTY + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_TRIBUNAL_SUPPORTING_MATERIAL, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
