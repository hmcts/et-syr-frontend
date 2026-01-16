import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

export const continueButton: SubmitButton = {
  text: (l: AnyRecord): string => l.continue,
  classes: 'govuk-!-margin-right-2',
};

export const uploadButton = {
  type: 'button',
  label: (l: AnyRecord): string => l.files.uploadButton,
  classes: 'govuk-button--secondary',
  id: 'upload',
  name: 'upload',
  value: 'true',
  divider: false,
};
