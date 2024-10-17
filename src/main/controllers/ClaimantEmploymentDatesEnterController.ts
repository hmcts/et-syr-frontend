import { Response } from 'express';

import { Form } from '../components/form';
import { convertToDateObject } from '../components/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateValues } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import {
  handleEndDateBeforeStartDate,
  isEndDateBeforeStartDate,
} from '../helpers/controller/ClaimantEmploymentDatesEnterHelper';
import ET3Util from '../utils/ET3Util';
import { isDateInPast, isDateInputInvalid } from '../validators/dateValidators';

export default class ClaimantEmploymentDatesEnterController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseEmploymentStartDate: {
        type: 'date',
        id: 'et3ResponseEmploymentStartDate',
        label: (l: AnyRecord): string => l.et3ResponseEmploymentStartDate.label,
        hint: (l: AnyRecord): string => l.et3ResponseEmploymentStartDate.hint,
        values: DateValues,
        validator: (value: CaseDate) => isDateInputInvalid(value) || isDateInPast(value),
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('et3ResponseEmploymentStartDate', body),
      },
      et3ResponseEmploymentEndDate: {
        type: 'date',
        id: 'et3ResponseEmploymentEndDate',
        label: (l: AnyRecord): string => l.et3ResponseEmploymentEndDate.label,
        hint: (l: AnyRecord): string => l.et3ResponseEmploymentEndDate.hint,
        values: DateValues,
        validator: (value: CaseDate) => isDateInputInvalid(value),
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('et3ResponseEmploymentEndDate', body),
      },
      et3ResponseEmploymentInformation: {
        type: 'textarea',
        id: 'et3ResponseEmploymentInformation',
        label: (l: AnyRecord): string => l.et3ResponseEmploymentInformation.label,
        attributes: {
          maxLength: 2500,
        },
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (isEndDateBeforeStartDate(req)) {
      return handleEndDateBeforeStartDate(req, res);
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES_ENTER, {
      ...content,
      hideContactUs: true,
    });
  };
}
