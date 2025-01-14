import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

export const continueButton: SubmitButton = {
  text: (l: AnyRecord): string => l.continue,
  classes: 'govuk-!-margin-right-2',
};
