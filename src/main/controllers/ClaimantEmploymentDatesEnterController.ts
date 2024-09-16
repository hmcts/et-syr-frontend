import { Response } from 'express';

import { Form } from '../components/form';
import { convertToDateObject } from '../components/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateValues } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isDateEmpty, isDateInPast, isDateInputInvalid, isDateNotPartial } from '../validators/dateValidators';

const logger = getLogger('ClaimantEmploymentDatesEnterController');

export default class ClaimantEmploymentDatesEnterController {
  form: Form;
  private readonly claimantEmploymentDatesEnterContent: FormContent = {
    fields: {
      employmentStartDate: {
        id: 'employmentStartDate',
        classes: 'govuk-date-input',
        type: 'date',
        label: (l: AnyRecord): string => l.startDateLabel,
        hint: (l: AnyRecord): string => l.startDateLabelHint,
        values: DateValues,
        validator: (value: CaseDate) =>
          isDateNotPartial(value) || (isDateEmpty(value) ? '' : isDateInputInvalid(value)) || isDateInPast(value),
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('employmentStartDate', body),
      },
      employmentEndDate: {
        id: 'employmentEndDate',
        classes: 'govuk-date-input',
        type: 'date',
        label: (l: AnyRecord): string => l.endDateLabel,
        hint: (l: AnyRecord): string => l.endDateLabelHint,
        values: DateValues,
        validator: (value: CaseDate) =>
          isDateNotPartial(value) || (isDateEmpty(value) ? '' : isDateInputInvalid(value)),
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('employmentEndDate', body),
      },
      employmentDatesFurtherInformation: {
        id: 'employmentDatesFurtherInformation',
        name: 'employmentDatesFurtherInformation',
        type: 'textarea',
        label: (l: AnyRecord): string => l.furtherInformationLabel,
        attributes: {
          maxLength: 2500,
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.claimantEmploymentDatesEnterContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_IS_EMPLOYMENT_CONTINUING);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimantEmploymentDatesEnterContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER, {
      ...content,
      hideContactUs: true,
    });
  };
}
