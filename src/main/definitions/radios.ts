import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

import { YesOrNo } from './case';
import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

const CopyToOtherPartyTextFormFields = {
  type: 'charactercount',
  label: (l: AnyRecord): string => l.copyToOtherPartyText.label,
  labelSize: 's',
  maxlength: 2500,
  validator: isContentCharsOrLessAndNotEmpty(2500),
};

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
        copyToOtherPartyText: CopyToOtherPartyTextFormFields,
      },
    },
  ],
  validator: isOptionSelected,
};

export const CopyToOtherPartyOfflineRadioFormFields = {
  type: 'radios',
  label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.label,
  values: [
    {
      label: (l: AnyRecord): string =>
        '<p class="govuk-body">' +
        l.copyToOtherPartyYesOrNo.yes1 +
        '</p><p class="govuk-body"><strong>' +
        l.copyToOtherPartyYesOrNo.important +
        ':</strong> ' +
        l.copyToOtherPartyYesOrNo.yes2 +
        '</p><p class="govuk-body">' +
        l.copyToOtherPartyYesOrNo.yes3 +
        '</p>',
      value: YesOrNo.YES,
    },
    {
      label: (l: AnyRecord): string =>
        '<p class="govuk-body">' +
        l.noIDoNotWantTo +
        '</p><p class="govuk-body"><strong>' +
        l.important +
        ':</strong> ' +
        l.youMustTellTheTribunal +
        '</p>',
      value: YesOrNo.NO,
      subFields: {
        copyToOtherPartyText: CopyToOtherPartyTextFormFields,
      },
    },
  ],
  validator: isOptionSelected,
};

export const saveAndContinueButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveAndContinue,
  classes: 'govuk-!-margin-right-2',
};

export const saveForLaterButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveForLater,
  classes: 'govuk-button--secondary',
};
