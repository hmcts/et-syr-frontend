import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getFormError, handleFileUpload } from '../helpers/controller/RespondToApplicationSupportingMaterialHelper';
import { getLogger } from '../logger';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';
import { isContentCharsOrLess } from '../validators/validator';

const logger = getLogger('RespondToApplicationSupportingMaterialController');

export default class RespondToApplicationSupportingMaterialController {
  private readonly form: Form;
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (StringUtils.isNotBlank(this.uploadedFileName)) {
      return (label.supportingMaterialFile.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.supportingMaterialFile.hint;
    }
  };

  private readonly formContent: FormContent = {
    fields: {
      responseText: {
        type: 'charactercount',
        hint: (l: AnyRecord): string => l.responseText.hint,
        maxlength: 2500,
        validator: isContentCharsOrLess(2500),
      },
      supportingMaterialFile: {
        id: 'supportingMaterialFile',
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        label: (l: AnyRecord): string => l.supportingMaterialFile.label,
        hint: (l: AnyRecord) => this.getHint(l),
      },
      upload: {
        label: (l: AnyRecord): string => l.files.uploadButton,
        classes: 'govuk-button--secondary',
        id: 'upload',
        type: 'button',
        name: 'upload',
        value: 'true',
        divider: false,
      },
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }

    if (req.body?.upload) {
      const fileErrorRedirect = handleFileUpload(
        req,
        FormFieldNames.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL.SUPPORTING_MATERIAL_FILE
      );
      if (await fileErrorRedirect) {
        return res.redirect(PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL + getLanguageParam(req.url));
      }
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const formError = getFormError(req, formData);
    if (formError) {
      req.session.errors.push(formError);
      return res.redirect(PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL + getLanguageParam(req.url));
    }

    req.session.userCase.responseText = formData.responseText;
    return res.redirect(PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    assignFormData(req.session.userCase, this.form.getFormFields());
    this.uploadedFileName = req?.session?.userCase?.supportingMaterialFile?.document_filename;
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
