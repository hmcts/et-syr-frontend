import { YesOrNo, YesOrNoOrNotApplicable } from '../definitions/case';
import { AnyRecord } from '../definitions/util-types';

export const oesYesOrNoMap = (translations: AnyRecord): { [key: string]: string } => {
  return {
    [YesOrNo.YES]: translations.oesYesOrNo.yes,
    [YesOrNo.NO]: translations.oesYesOrNo.no,
  };
};

export const ydwYesOrNoMap = (translations: AnyRecord): { [key: string]: string } => {
  return {
    [YesOrNo.YES]: translations.ydwYesOrNo.yes,
    [YesOrNo.NO]: translations.ydwYesOrNo.no,
  };
};

export const ydyYesOrNoMap = (translations: AnyRecord): { [key: string]: string } => {
  return {
    [YesOrNo.YES]: translations.ydyYesOrNo.yes,
    [YesOrNo.NO]: translations.ydyYesOrNo.no,
  };
};

export const ydyYesOrNoOrNotApplicableMap = (translations: AnyRecord): { [key: string]: string } => {
  return {
    [YesOrNoOrNotApplicable.YES]: translations.ydyYesOrNo.yes,
    [YesOrNoOrNotApplicable.NO]: translations.ydyYesOrNo.no,
    [YesOrNoOrNotApplicable.NOT_APPLICABLE]: translations[YesOrNoOrNotApplicable.NOT_APPLICABLE],
  };
};
