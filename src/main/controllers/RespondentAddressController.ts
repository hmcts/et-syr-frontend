import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentAddressController');

export default class RespondentAddressController {
  form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddress: {
        classes: 'govuk-radios--inline',
        id: 'respondentAddress',
        type: 'radios',
        label: (l: AnyRecord): string => l.correctAddressQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentAddress',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentAddress',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME);
    } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_ENTER_POST_CODE);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ADDRESS);

    const content = getPageContent(req, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
