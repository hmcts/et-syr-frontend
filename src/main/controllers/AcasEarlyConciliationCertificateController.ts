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
import { isContent2500CharsOrLess, isOptionSelected } from '../validators/validator';

const logger = getLogger('AcasEarlyConciliationCertificateController');

export default class AcasEarlyConciliationCertificateController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      doYouDisagreeAboutAcas: {
        type: 'radios',
        label: (l: AnyRecord): string => l.doYouDisagreeAboutAcas.label,
        values: [
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              whyDoYouDisagreeAcas: {
                type: 'textarea',
                id: 'whyDoYouDisagreeAcas',
                label: (l: AnyRecord): string => l.whyDoYouDisagreeAcas.label,
                labelSize: 's',
                validator: isContent2500CharsOrLess,
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
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_EMPLOYMENT_DATES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE, {
      ...content,
      acasLink: PageUrls.NOT_IMPLEMENTED, // TODO: Update Acas link
      hideContactUs: true,
    });
  };
}
