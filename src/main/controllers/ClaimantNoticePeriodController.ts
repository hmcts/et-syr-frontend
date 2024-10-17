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
import { isContent2500CharsOrLess } from '../validators/validator';

export default class ClaimantNoticePeriodController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseIsNoticeCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseIsNoticeCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              et3ResponseCorrectNoticeDetails: {
                type: 'textarea',
                id: 'et3ResponseCorrectNoticeDetails',
                label: (l: AnyRecord): string => l.et3ResponseCorrectNoticeDetails.label,
                labelSize: 's',
                hint: (l: AnyRecord): string => l.et3ResponseCorrectNoticeDetails.hint,
                validator: isContent2500CharsOrLess,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_PENSION_AND_BENEFITS
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NOTICE_PERIOD,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_NOTICE_PERIOD, {
      ...content,
      writtenContract: '[entry]', // TODO: Update value
      noticePeriod: '[Notice period digit] [Weeks / Months]', // TODO: Update value
      hideContactUs: true,
    });
  };
}
