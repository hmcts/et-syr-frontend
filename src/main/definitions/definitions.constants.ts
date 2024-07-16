import {
  areDateFieldsFilledIn,
  areDates10YearsApartOrMore,
  convertDateToCaseDate,
  isDateEmpty,
  isDateInLastTenYears,
  isDateInNextTenYears,
  isDateInPast,
  isDateInputInvalid,
  isDateNotInPast,
  isDateNotPartial,
} from '../components/form/dateValidators';

import { CaseDate } from './case';
import { InvalidField } from './form';
import { AnyRecord } from './util-types';

type DateTypes = string | void | InvalidField;

export const DateValuesTestConstants = {
  LENGTH: 3,
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
  TRANSLATION_FUNCTION_LABEL_DAY: (l: AnyRecord): string => l.dateFormat.day,
  TRANSLATION_FUNCTION_LABEL_MONTH: (l: AnyRecord): string => l.dateFormat.month,
  TRANSLATION_FUNCTION_LABEL_YEAR: (l: AnyRecord): string => l.dateFormat.year,
};

export const BirthDateFormFieldsTestConstants = {
  VALIDATOR_FUNCTION: (value: CaseDate): DateTypes =>
    isDateNotPartial(value) ||
    (isDateEmpty(value) ? '' : isDateInputInvalid(value)) ||
    isDateInPast(value) ||
    areDates10YearsApartOrMore(value, convertDateToCaseDate(new Date())),
};

export const EndDateFormFieldsTestConstants = {
  VALIDATOR_FUNCTION: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateInPast(value) || isDateInLastTenYears(value),
};

export const NewJobDateFormFieldsTestConstants = {
  VALIDATOR_FUNCTION: (value: CaseDate): DateTypes => isDateInputInvalid(value) || isDateInNextTenYears(value),
};

export const NoticeEndDateFormFieldsTestConstants = {
  VALIDATOR_FUNCTION: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateNotInPast(value) || isDateInNextTenYears(value),
};

export const StartDateFormFieldsTestConstants = {
  VALIDATOR_FUNCTION: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateInPast(value),
};
