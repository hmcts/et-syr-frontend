import { AppRequest } from '../../definitions/appRequest';
import { CaseDate } from '../../definitions/case';
import { isDateEmpty, isDateInputInvalid, isFirstDateBeforeSecond } from '../../validators/dateValidators';

export const isEndDateBeforeStartDate = (req: AppRequest): boolean => {
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
    return false;
  }

  if (isDateInputInvalid(startDate) || isDateInputInvalid(endDate)) {
    return false;
  }

  return isFirstDateBeforeSecond(endDate, startDate);
};
