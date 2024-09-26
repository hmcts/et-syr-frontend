import { Validator, isFieldFilledIn, isOptionSelected } from '../validators/validator';

import { PayInterval, YesOrNo, YesOrNoOrNotSure } from './case';
import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

export const PayIntervalRadioValues = [
  {
    label: (l: AnyRecord): string => l.weekly,
    value: PayInterval.WEEKLY,
  },
  {
    label: (l: AnyRecord): string => l.monthly,
    value: PayInterval.MONTHLY,
  },
  {
    label: (l: AnyRecord): string => l.annual,
    value: PayInterval.ANNUAL,
  },
];

export const YesNoRadioValues = [
  {
    label: (l: AnyRecord): string => l.yes,
    name: 'radioYes',
    value: YesOrNo.YES,
  },
  {
    label: (l: AnyRecord): string => l.no,
    name: 'radioNo',
    value: YesOrNo.NO,
  },
];

const YesNoNotSureRadioValues = [
  {
    label: (l: AnyRecord): string => l.yes,
    value: YesOrNoOrNotSure.YES,
    hint: (l: AnyRecord): string => l.yesHintLabel,
  },
  {
    label: (l: AnyRecord): string => l.no,
    value: YesOrNoOrNotSure.NO,
    hint: (l: AnyRecord): string => l.noHintLabel,
  },
  {
    label: (l: AnyRecord): string => l.notSure,
    value: YesOrNoOrNotSure.NOT_SURE,
    hint: (l: AnyRecord): string => l.notSureHintLabel,
  },
];

export const YesNoNotSureRadio = {
  type: 'radios',
  label: (l: AnyRecord): string => l.label,
  hint: (l: AnyRecord): string => l.hint,
  values: YesNoNotSureRadioValues,
  validator: isOptionSelected,
};

export const SupportingMaterialYesNoRadioValues = [
  {
    label: (l: AnyRecord): string => l.supportingMaterialYesNo.yes,
    name: 'radioYes',
    value: YesOrNo.YES,
  },
  {
    label: (l: AnyRecord): string => l.supportingMaterialYesNo.no,
    name: 'radioNo',
    value: YesOrNo.NO,
  },
];

export const submitButton: SubmitButton = {
  text: (l: AnyRecord): string => l.submit,
  classes: 'govuk-!-margin-right-2',
};

export const saveForLaterButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveForLater,
  classes: 'govuk-button--secondary',
};

export type RadioFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  labelHidden?: boolean;
  values: typeof YesNoRadioValues;
  validator: Validator;
};

export const DefaultRadioFormFields = {
  type: 'radios',
  values: YesNoRadioValues,
  validator: isFieldFilledIn,
};

export const DefaultInlineRadioFormFields = {
  classes: 'govuk-radios--inline',
  type: 'radios',
  values: YesNoRadioValues,
  validator: isFieldFilledIn,
};

export type PayIntervalRadioFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  values: typeof PayIntervalRadioValues;
};

export const DefaultPayIntervalRadioFormFields = {
  type: 'radios',
  classes: 'govuk-radios',
  values: PayIntervalRadioValues,
};
