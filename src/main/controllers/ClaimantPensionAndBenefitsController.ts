import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';
import { isContent3000CharsOrLessOrEmpty, isOptionSelected } from '../validators/validator';

export default class ClaimantPensionAndBenefitsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseIsPensionCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.areClaimantPensionBenefitsCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              et3ResponsePensionCorrectDetails: {
                type: 'charactercount',
                id: 'whatAreClaimantCorrectPensionBenefits',
                label: (l: AnyRecord): string => l.whatAreClaimantCorrectPensionBenefits.label,
                labelSize: 's',
                validator: isContent3000CharsOrLessOrEmpty,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS, {
      ...content,
      hideContactUs: true,
      userCase: req.session.userCase,
    });
  };
}
