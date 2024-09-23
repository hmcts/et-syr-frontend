import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';

const logger = getLogger('RespondentSitesController');

export default class RespondentSitesController {
  private readonly form: Form;
  private readonly respondentSites: FormContent = {
    fields: {
      respondentSites: {
        classes: 'govuk-radios',
        id: 'respondentSites',
        type: 'text',
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: true,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentSites.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_SITE_EMPLOYEES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SITES);
    const content = getPageContent(req, this.respondentSites, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SITES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_SITES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
