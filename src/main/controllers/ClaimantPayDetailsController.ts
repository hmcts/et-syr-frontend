import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';

export default class ClaimantPayDetailsController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseEarningDetailsCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseEarningDetailsCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            hint: (l: AnyRecord): string => l.et3ResponseEarningDetailsCorrect.no.hint,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
            hint: (l: AnyRecord): string => l.et3ResponseEarningDetailsCorrect.notSure.hint,
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
    const nextPage =
      req.body.et3ResponseEarningDetailsCorrect === YesOrNoOrNotSure.NO
        ? PageUrls.CLAIMANT_PAY_DETAILS_ENTER
        : PageUrls.CLAIMANT_NOTICE_PERIOD;
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      nextPage
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PAY_DETAILS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_PAY_DETAILS, {
      ...content,
      hideContactUs: true,
    });
  };
}
