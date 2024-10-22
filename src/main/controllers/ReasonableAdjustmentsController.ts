import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

export default class ReasonableAdjustmentsController {
  private readonly form: Form;
  private readonly reasonableAdjustments: FormContent = {
    fields: {
      et3ResponseRespondentSupportNeeded: {
        classes: 'govuk-radios',
        id: 'et3ResponseRespondentSupportNeeded',
        type: 'radios',
        label: (l: AnyRecord): string => l.reasonableAdjustments,
        labelHidden: false,
        values: [
          {
            name: 'et3ResponseRespondentSupportNeeded',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
            subFields: {
              et3ResponseRespondentSupportDetails: {
                id: 'et3ResponseRespondentSupportDetails',
                name: 'et3ResponseRespondentSupportDetails',
                type: 'charactercount',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.yesDetail,
                classes: 'govuk-text',
                maxlength: 400,
                validator: isContentCharsOrLessAndNotEmpty(400),
              },
            },
          },
          {
            name: 'et3ResponseRespondentSupportNeeded',
            label: (l: AnyRecord): string => l.radioNo,
            value: YesOrNoOrNotSure.NO,
          },
          {
            name: 'et3ResponseRespondentSupportNeeded',
            label: (l: AnyRecord): string => l.radioNotSure,
            value: YesOrNoOrNotSure.NOT_SURE,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.REASONABLE_ADJUSTMENTS,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.reasonableAdjustments.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];

    if (YesOrNoOrNotSure.YES !== formData.et3ResponseRespondentSupportNeeded) {
      fieldsToReset.push('et3ResponseRespondentSupportDetails');
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_EMPLOYEES,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.REASONABLE_ADJUSTMENTS);

    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseRespondentSupportNeeded = undefined;
    }

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
