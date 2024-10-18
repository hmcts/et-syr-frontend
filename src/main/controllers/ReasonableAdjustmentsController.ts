import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

export default class ReasonableAdjustmentsController {
  private readonly form: Form;
  private readonly reasonableAdjustments: FormContent = {
    fields: {
      reasonableAdjustments: {
        classes: 'govuk-radios',
        id: 'reasonableAdjustments',
        type: 'radios',
        label: (l: AnyRecord): string => l.reasonableAdjustments,
        labelHidden: false,
        values: [
          {
            name: 'reasonableAdjustments',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
            subFields: {
              reasonableAdjustmentsDetail: {
                id: 'reasonableAdjustmentsDetail',
                name: 'reasonableAdjustmentsDetail',
                type: 'text',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.yesDetail,
                classes: 'govuk-text',
                validator: isFieldFilledIn,
              },
            },
          },
          {
            name: 'reasonableAdjustments',
            label: (l: AnyRecord): string => l.radioNo,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.reasonableAdjustments.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // todo: field reset needed here for the reasonable adjustment detail

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_EMPLOYEES
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.REASONABLE_ADJUSTMENTS);
    const content = getPageContent(req, this.reasonableAdjustments, [
      TranslationKeys.COMMON,
      TranslationKeys.REASONABLE_ADJUSTMENTS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.REASONABLE_ADJUSTMENTS, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
