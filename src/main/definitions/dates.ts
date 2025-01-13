import { DateValidator } from '../validators/dateValidators';

import { CaseDate } from './case';
import { AnyRecord, UnknownRecord } from './util-types';

export const DateValues = [
  {
    label: (l: AnyRecord): string => l.dateFormat.day,
    name: 'day',
    classes: 'govuk-input--width-2',
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.dateFormat.month,
    name: 'month',
    classes: 'govuk-input--width-2',
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.dateFormat.year,
    name: 'year',
    classes: 'govuk-input--width-4',
    attributes: { maxLength: 4 },
  },
];

export type DateFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  labelSize?: string;
  labelHidden: boolean;
  hint: (l: AnyRecord) => string;
  values: typeof DateValues;
  parser: (body: UnknownRecord) => CaseDate;
  validator: DateValidator;
};
