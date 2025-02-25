import { Form } from '../components/form';
import { YesOrNo } from '../definitions/case';
import { FormContent, FormFields } from '../definitions/form';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { isOptionSelected } from '../validators/validator';

export default abstract class BaseCYAController {
  protected readonly form: Form;
  protected readonly formContent: FormContent;

  constructor(sectionName: string) {
    this.formContent = {
      fields: {
        [sectionName]: {
          classes: 'govuk-radios',
          id: sectionName,
          type: 'radios',
          label: (l: AnyRecord): string => l.cya.label,
          hint: (l: AnyRecord): string => l.cya.hint,
          labelHidden: false,
          values: [
            {
              name: sectionName,
              label: (l: AnyRecord): string => l.cya.yes,
              value: YesOrNo.YES,
            },
            {
              name: sectionName,
              label: (l: AnyRecord): string => l.cya.no,
              value: YesOrNo.NO,
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: saveAndContinueButton,
      saveForLater: saveForLaterButton,
    } as never;

    this.form = new Form(<FormFields>this.formContent.fields);
  }
}
