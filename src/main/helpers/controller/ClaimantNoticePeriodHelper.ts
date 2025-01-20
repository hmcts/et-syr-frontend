import { AppRequest } from '../../definitions/appRequest';
import { WeeksOrMonths, YesOrNo } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

const getTranslations = (req: AppRequest): AnyRecord => ({
  ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  ...req.t(TranslationKeys.CLAIMANT_NOTICE_PERIOD, { returnObjects: true }),
});

export const getWrittenContract = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);

  switch (userCase?.noticePeriod) {
    case YesOrNo.YES:
      return translations.yes;
    case YesOrNo.NO:
      return translations.no;
    default:
      return translations.notProvided;
  }
};

export const getNoticePeriod = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);

  if (!userCase.noticePeriodLength || !userCase.noticePeriodUnit) {
    return translations.notProvided;
  }

  if (userCase.noticePeriodUnit === WeeksOrMonths.WEEKS) {
    return userCase.noticePeriodLength + ' ' + translations.weeks;
  }

  if (userCase.noticePeriodUnit === WeeksOrMonths.MONTHS) {
    switch (userCase.noticePeriodLength) {
      case '1':
        return userCase.noticePeriodLength + ' ' + translations.months1;
      case '2':
        return userCase.noticePeriodLength + ' ' + translations.months2;
      default:
        return userCase.noticePeriodLength + ' ' + translations.months3;
    }
  }

  return translations.notProvided;
};
