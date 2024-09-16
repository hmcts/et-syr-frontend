import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantAcasEarlyConciliationCertificateController');

export default class ClaimantAcasEarlyConciliationCertificateController {
  form: Form;
  private readonly acasEarlyConciliationCertificateContent: FormContent = {
    fields: {
      disagreeEarlyConciliation: {
        classes: 'govuk-radios',
        id: 'disagreeEarlyConciliation',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        labelHidden: false,
        values: [
          {
            name: 'disagreeEarlyConciliation',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
          {
            name: 'disagreeEarlyConciliation',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              disagreeEarlyConciliationWhy: {
                id: 'disagreeEarlyConciliationWhy',
                name: 'disagreeEarlyConciliationWhy',
                type: 'textarea',
                label: (l: AnyRecord): string => l.whyLabel,
                labelSize: 'normal',
                attributes: {
                  maxLength: 2500,
                },
              },
            },
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.acasEarlyConciliationCertificateContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_EMPLOYMENT_DATES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasEarlyConciliationCertificateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_ACAS_EARLY_CONCILIATION_CERTIFICATE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_ACAS_EARLY_CONCILIATION_CERTIFICATE, {
      ...content,
      hideContactUs: true,
    });
  };
}
