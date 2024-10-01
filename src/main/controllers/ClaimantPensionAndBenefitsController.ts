import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isContent2500CharsOrLess, isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantPensionAndBenefitsController');

export default class ClaimantPensionAndBenefitsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      areClaimantPensionBenefitsCorrect: {
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
              whatAreClaimantCorrectPensionBenefits: {
                type: 'textarea',
                id: 'whatAreClaimantCorrectPensionBenefits',
                label: (l: AnyRecord): string => l.whatAreClaimantCorrectPensionBenefits.label,
                labelSize: 's',
                validator: isContent2500CharsOrLess,
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
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS);
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
      anyContributions: '[selection and entered text if Yes]', // TODO: Update value
      receiveBenefits: '[selection and entered text if Yes]', // TODO: Update value
      hideContactUs: true,
    });
  };
}
