import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { CaseDate } from '../../definitions/case';
import { PageUrls, ValidationErrors } from '../../definitions/constants';
import ErrorUtils from '../../utils/ErrorUtils';
import { isDateEmpty, isDateInputInvalid, isFirstDateBeforeSecond } from '../../validators/date-validator';
import { setUrlLanguage } from '../LanguageHelper';
import { returnValidUrl } from '../RouterHelpers';

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

  if (isDateEmpty(startDate) || isDateEmpty(endDate)) {
    return false;
  }

  if (isDateInputInvalid(startDate) || isDateInputInvalid(endDate)) {
    return false;
  }

  return isFirstDateBeforeSecond(endDate, startDate);
};

export const handleEndDateBeforeStartDate = (req: AppRequest, res: Response): void => {
  ErrorUtils.setManualErrorWithFieldToRequestSession(
    req,
    ValidationErrors.INVALID_END_DATE_BEFORE_START_DATE,
    'et3ResponseEmploymentEndDate',
    'day'
  );
  const redirectUrl = setUrlLanguage(req, PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER);
  return res.redirect(returnValidUrl(redirectUrl));
};
