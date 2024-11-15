import { Response } from 'express';
import _ from 'lodash';

import { Form } from '../components/form';
import { convertToDateObject } from '../components/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DateValues } from '../definitions/dates';
import { FormContent, FormField, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { endSubSection } from '../helpers/RouterHelpers';
import {
  handleEndDateBeforeStartDate,
  isEndDateBeforeStartDate,
} from '../helpers/controller/ClaimantEmploymentDatesEnterHelper';
import ET3Util from '../utils/ET3Util';
import { isDateInPast, isDateInputInvalid } from '../validators/dateValidators';

const employment_date_common_fields = {
  classes: 'govuk-date-input',
  labelHidden: false,
  type: 'date',
  values: DateValues,
};

const et3_response_employment_start_date: DateFormFields = {
  ...employment_date_common_fields,
  id: 'et3ResponseEmploymentStartDate',
  label: (l: AnyRecord): string => l.et3ResponseEmploymentStartDate.label,
  hint: (l: AnyRecord): string => l.et3ResponseEmploymentStartDate.hint,
  validator: (value: CaseDate) => isDateInputInvalid(value) || isDateInPast(value),
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('et3ResponseEmploymentStartDate', body),
};

const et3_response_employment_end_date: DateFormFields = {
  ...employment_date_common_fields,
  id: 'et3ResponseEmploymentEndDate',
  label: (l: AnyRecord): string => l.et3ResponseEmploymentEndDate.label,
  hint: (l: AnyRecord): string => l.et3ResponseEmploymentEndDate.hint,
  validator: (value: CaseDate) => isDateInputInvalid(value),
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('et3ResponseEmploymentEndDate', body),
};

const et3_response_employment_information: FormField = {
  label: (l: AnyRecord): string => l.et3ResponseEmploymentInformation.label,
  id: 'et3ResponseEmploymentInformation',
  attributes: {
    maxLength: 2500,
  },
  type: 'textarea',
};

const fieldList = [
  {
    attributes: { maxLength: 2 },
    label: (l: AnyRecord): string => l.dateFormat.day,
    classes: 'govuk-input--width-2',
    name: 'day',
  },
  {
    classes: 'govuk-input--width-2',
    name: 'month',
    label: (l: AnyRecord): string => l.dateFormat.month,
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.dateFormat.year,
    attributes: { maxLength: 4 },
    name: 'year',
    classes: 'govuk-input--width-4',
  },
];

const startDateFieldList = _.cloneDeep(fieldList);
const endDateFieldList = _.cloneDeep(fieldList);

const formContentFieldsList = {
  et3ResponseEmploymentStartDate: et3_response_employment_start_date,
  et3ResponseEmploymentEndDate: et3_response_employment_end_date,
  et3ResponseEmploymentInformation: et3_response_employment_information,
};

export default class ClaimantEmploymentDatesEnterController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: formContentFieldsList,
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
    endSubSection(req);

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
    et3_response_employment_start_date.values = startDateFieldList;
    et3_response_employment_end_date.values = endDateFieldList;
    this.formContent.fields = formContentFieldsList;
    const content = getPageContent(req, this.formContent, [
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
