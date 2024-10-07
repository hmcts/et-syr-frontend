import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { isFilledInAnd2500CharsOrLess } from '../helpers/controller/EmployersContractClaimDetailsHelper';
import { getLogger } from '../logger';

const logger = getLogger('EmployersContractClaimDetailsController');

export default class EmployersContractClaimDetailsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      provideDetailsOfECC: {
        type: 'textarea',
        id: 'provideDetailsOfECC',
        label: (l: AnyRecord): string => l.provideDetailsOfECC.label,
        validator: isFilledInAnd2500CharsOrLess,
      },
      inset: {
        type: 'insetFields',
        id: 'inset',
        classes: 'govuk-heading-m',
        label: (l: AnyRecord): string => l.files.title,
        subFields: {
          provideDetailsOfECCDoc: {
            type: 'upload',
            id: 'provideDetailsOfECCDoc',
            classes: 'govuk-label',
            labelHidden: false,
            labelSize: 'm',
          },
          upload: {
            type: 'button',
            label: (l: AnyRecord): string => l.files.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            name: 'upload',
            value: 'true',
          },
        },
      },
      filesUploaded: {
        type: 'summaryList',
        label: (l: AnyRecord): string => l.files.uploaded,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS, {
      ...content,
      hideContactUs: true,
    });
  };
}
