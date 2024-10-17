import { AppRequest } from '../../definitions/appRequest';
import { CaseDate } from '../../definitions/case';
import { FormError } from '../../definitions/form';
import { isDateEmpty, isDateInputInvalid, isFirstDateBeforeSecond } from '../../validators/dateValidators';

export const getDateCompareError = (req: AppRequest): FormError[] => {
  const errors: FormError[] = [];

  const startDate: CaseDate = {
    day: req.body['et3ResponseEmploymentStartDate-day'],
    month: req.body['et3ResponseEmploymentStartDate-month'],
    year: req.body['et3ResponseEmploymentStartDate-year'],
  };

  const endDate: CaseDate = {
    day: req.body['et3ResponseEmploymentEndDate-day'],
    month: req.body['et3ResponseEmploymentEndDate-month'],
    year: req.body['et3ResponseEmploymentEndDate-year'],
  };

  if (isDateEmpty(startDate) && isDateEmpty(endDate)) {
    return errors;
  }

  if (isDateInputInvalid(startDate) || isDateInputInvalid(endDate)) {
    return errors;
  }

  if (isFirstDateBeforeSecond(endDate, startDate)) {
    errors.push({
      propertyName: 'et3ResponseEmploymentEndDate',
      errorType: 'invalidEndDateBeforeStartDate',
      fieldName: 'day',
    });
  }

  return errors;
};
