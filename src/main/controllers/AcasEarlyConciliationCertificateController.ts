import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLess } from '../validators/validator';

export default class AcasEarlyConciliationCertificateController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseAcasAgree: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseAcasAgree.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
            subFields: {
              et3ResponseAcasAgreeReason: {
                type: 'charactercount',
                label: (l: AnyRecord): string => l.et3ResponseAcasAgreeReason.label,
                labelSize: 's',
                maxlength: 2500,
                validator: isContentCharsOrLess(2500),
              },
            },
          },
        ],
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];
    if (YesOrNo.NO !== formData.et3ResponseAcasAgree) {
      fieldsToReset.push(formData.et3ResponseAcasAgreeReason);
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_EMPLOYMENT_DATES,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.ACAS_EARLY_CONCILIATION_CERTIFICATE, {
      ...content,
      acasLink: PageUrls.NOT_IMPLEMENTED, // TODO: Update Acas link
      hideContactUs: true,
    });
  };
}
