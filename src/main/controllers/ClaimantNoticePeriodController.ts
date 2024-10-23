import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLess } from '../validators/validator';

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
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            subFields: {
              et3ResponseCorrectNoticeDetails: {
                type: 'charactercount',
                label: (l: AnyRecord): string => l.et3ResponseCorrectNoticeDetails.label,
                labelSize: 's',
                hint: (l: AnyRecord): string => l.et3ResponseCorrectNoticeDetails.hint,
                maxlength: 500,
                validator: isContentCharsOrLess(500),
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_NOTICE_PERIOD,
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
    if (YesOrNoOrNotApplicable.NO !== formData.et3ResponseIsNoticeCorrect) {
      fieldsToReset.push(formData.et3ResponseCorrectNoticeDetails);
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseIsNoticeCorrect = undefined;
      req.session.userCase.et3ResponseCorrectNoticeDetails = undefined;
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NOTICE_PERIOD,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_NOTICE_PERIOD, {
      ...content,
      hideContactUs: true,
    });
  };
}
