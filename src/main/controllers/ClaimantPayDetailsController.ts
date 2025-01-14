import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, PayInterval, YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, saveAndContinueButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
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
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            hint: (l: AnyRecord): string => l.et3ResponseEarningDetailsCorrect.no.hint,
          },
          {
            label: (l: AnyRecord): string => l.notApplicable,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
            hint: (l: AnyRecord): string => l.et3ResponseEarningDetailsCorrect.notApplicable.hint,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_PAY_DETAILS,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    let nextPage = setUrlLanguage(req, PageUrls.CLAIMANT_NOTICE_PERIOD);
    if (formData.et3ResponseEarningDetailsCorrect === YesOrNoOrNotApplicable.NO) {
      nextPage = setUrlLanguage(req, PageUrls.CLAIMANT_PAY_DETAILS_ENTER);
    }

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
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseEarningDetailsCorrect = undefined;
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PAY_DETAILS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_PAY_DETAILS, {
      ...content,
      hideContactUs: true,
      PayInterval: {
        WEEKS: PayInterval.WEEKS,
        MONTHS: PayInterval.MONTHS,
        ANNUAL: PayInterval.ANNUAL,
      },
    });
  };
}
