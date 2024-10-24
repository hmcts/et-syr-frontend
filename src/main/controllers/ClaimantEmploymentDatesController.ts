import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import { dateInLocale } from '../helpers/dateInLocale';
import ET3Util from '../utils/ET3Util';
import { convertCaseDateToDate } from '../validators/dateValidators';

export default class ClaimantEmploymentDatesController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseAreDatesCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseAreDatesCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            hint: (l: AnyRecord): string => l.et3ResponseAreDatesCorrect.no.hint,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
            hint: (l: AnyRecord): string => l.et3ResponseAreDatesCorrect.notSure.hint,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_EMPLOYMENT_DATES,
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
      req.body.et3ResponseAreDatesCorrect === YesOrNoOrNotApplicable.NO
        ? PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER
        : PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING;
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      nextPage
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseAreDatesCorrect = undefined;
    }
    const { startDate, endDate } = req.session.userCase ?? {};
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, {
      ...content,
      hideContactUs: true,
      startDateDisplay: startDate ? dateInLocale(convertCaseDateToDate(startDate), req.url) : undefined,
      endDateDisplay: endDate ? dateInLocale(convertCaseDateToDate(endDate), req.url) : undefined,
    });
  };
}
