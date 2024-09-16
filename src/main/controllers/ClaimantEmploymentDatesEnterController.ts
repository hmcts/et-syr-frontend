import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateValues } from '../definitions/dates';
import { FormContent, FormFields, InvalidField } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { areDateFieldsFilledIn, isDateInPast, isDateInputInvalid } from '../validators/dateValidators';

const logger = getLogger('ClaimantEmploymentDatesEnterController');
type DateTypes = string | void | InvalidField;

export default class ClaimantEmploymentDatesEnterController {
  form: Form;
  private readonly claimantEmploymentDatesEnterContent: FormContent = {
    fields: {
      employmentStartDate: {
        classes: 'govuk-date-input',
        type: 'date',
        label: (l: AnyRecord): string => l.legend,
        labelHidden: false,
        labelSize: 'l',
        hint: (l: AnyRecord): string => l.hint,
        values: DateValues,
        validator: (value: CaseDate): DateTypes =>
          areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateInPast(value),
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.claimantEmploymentDatesEnterContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_ACAS_EARLY_CONCILIATION_CERTIFICATE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimantEmploymentDatesEnterContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, {
      ...content,
      startDate: '[Date entered by Claimant / Not provided]',
      endDate: '[Date entered by Claimant / Not provided]',
      hideContactUs: true,
    });
  };
}
