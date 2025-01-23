import { AppRequest } from '../../definitions/appRequest';
import { WeeksOrMonths, YesOrNo } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

const getTranslations = (req: AppRequest): AnyRecord => ({
  ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  ...req.t(TranslationKeys.CLAIMANT_NOTICE_PERIOD, { returnObjects: true }),
});

/**
 * Get written contract details with translation
 * @param req Request
 */
export const getWrittenContract = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);

  if (userCase?.noticePeriod === YesOrNo.YES) {
    return translations.yes;
  } else if (userCase?.noticePeriod === YesOrNo.NO) {
    return translations.no;
  } else {
    return translations.notProvided;
  }
};

/**
 * Get notice period details with translation
 * @param req Request
 */
export const getNoticePeriod = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);
  return getPeriodTranslation(userCase?.noticePeriodLength, userCase?.noticePeriodUnit, translations);
};

const getPeriodTranslation = (length: string, unit: WeeksOrMonths, translations: AnyRecord): string => {
  if (!length || !unit) {
    return translations.notProvided;
  }

  if (unit === WeeksOrMonths.WEEKS) {
    return length + ' ' + translations.weeks;
  }

  if (unit === WeeksOrMonths.MONTHS) {
    switch (length) {
      case '1':
        return length + ' ' + translations.months1;
      case '2':
        return length + ' ' + translations.months2;
      default:
        return length + ' ' + translations.months3;
    }
  }

  return translations.notProvided;
};
