import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

import { YesOrNo } from './case';
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

export const submitButton: SubmitButton = {
  text: (l: AnyRecord): string => l.submit,
  classes: 'govuk-!-margin-right-2',
};

export const saveForLaterButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveForLater,
  classes: 'govuk-button--secondary',
};
