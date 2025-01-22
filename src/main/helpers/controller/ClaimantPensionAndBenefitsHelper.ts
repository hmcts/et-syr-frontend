import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
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
  if (userCase?.employeeBenefits === YesOrNo.YES) {
    return userCase.benefitsCharCount
      ? translations.ydwYesOrNo.yes + ' - ' + userCase.benefitsCharCount
      : translations.yes;
  } else if (userCase?.employeeBenefits === YesOrNo.NO) {
    return translations.ydwYesOrNo.no;
  } else {
    return translations.notSure;
  }
};
