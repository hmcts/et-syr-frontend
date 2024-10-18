import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isContent2500CharsOrLess, isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantNoticePeriodController');

export default class ClaimantNoticePeriodController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      areClaimantNoticePeriodDetailsCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.areClaimantNoticePeriodDetailsCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            subFields: {
              whatAreClaimantCorrectNoticeDetails: {
                type: 'textarea',
                id: 'whatAreClaimantCorrectNoticeDetails',
                label: (l: AnyRecord): string => l.whatAreClaimantCorrectNoticeDetails.label,
                labelSize: 's',
                hint: (l: AnyRecord): string => l.whatAreClaimantCorrectNoticeDetails.hint,
                validator: isContent2500CharsOrLess,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
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
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_PENSION_AND_BENEFITS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NOTICE_PERIOD,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_NOTICE_PERIOD, {
      ...content,
      writtenContract: '[entry]', // TODO: Update value
      noticePeriod: '[Notice period digit] [Weeks / Months]', // TODO: Update value
      hideContactUs: true,
    });
  };
}
