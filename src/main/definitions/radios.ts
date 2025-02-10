import { Validator, isContentCharsOrLessAndNotEmpty, isFieldFilledIn, isOptionSelected } from '../validators/validator';

import { PayInterval, YesOrNo } from './case';
import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

export const CopyToOtherPartyRadioFormFields = {
  type: 'radios',
  label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.label,
  values: [
    {
      label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.yes,
      value: YesOrNo.YES,
    },
    {
      label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.no,
      value: YesOrNo.NO,
      subFields: {
        copyToOtherPartyText: {
          type: 'charactercount',
          label: (l: AnyRecord): string => l.copyToOtherPartyText.label,
          labelSize: 's',
          maxlength: 2500,
          validator: isContentCharsOrLessAndNotEmpty(2500),
        },
      },
    },
  ],
  validator: isOptionSelected,
};

export const PayIntervalRadioValues = [
  {
    label: (l: AnyRecord): string => l.weekly,
    value: PayInterval.WEEKS,
  },
  {
    label: (l: AnyRecord): string => l.monthly,
    value: PayInterval.MONTHS,
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

export const saveAndContinueButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveAndContinue,
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
