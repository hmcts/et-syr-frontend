import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';

const getTranslations = (req: AppRequest): AnyRecord => ({
  ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  ...req.t(TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS, { returnObjects: true }),
});

export const getAnyContributions = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);
  if (userCase?.claimantPensionContribution === 'Yes') {
    return translations.yes + ' - ' + translations.weekly + ': £' + userCase.claimantPensionWeeklyContribution;
  } else if (userCase?.claimantPensionContribution === 'No') {
    return translations.no;
  } else {
    return translations.notSure;
  }
};

export const getReceiveBenefits = (req: AppRequest): string => {
  const userCase = req.session.userCase;
  const translations = getTranslations(req);
  if (userCase?.employeeBenefits === 'Yes') {
    return userCase.benefitsCharCount ? translations.yes + ' - ' + userCase.benefitsCharCount : translations.yes;
  } else if (userCase?.employeeBenefits === 'No') {
    return translations.no;
  } else {
    return translations.notSure;
  }
};
