import { atLeastOneFieldIsChecked } from '../../validators/validator';
import { YesOrNo } from '../case';
import { AnyRecord } from '../util-types';

export const ConfirmCopiedFormFields = {
  id: 'confirmCopied',
  label: (l: AnyRecord): string => l.haveYouCopied,
  labelHidden: false,
  labelSize: 'm',
  type: 'checkboxes',
  hint: (l: AnyRecord): string => l.iConfirmThatIHaveCopied,
  validator: atLeastOneFieldIsChecked,
  values: [
    {
      name: 'confirmCopied',
      label: (l: AnyRecord): string => l.yesIConfirm,
      value: YesOrNo.YES,
    },
  ],
};
