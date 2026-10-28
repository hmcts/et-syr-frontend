import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getCuiYourSupportFeature } from '../modules/featureFlag/CuiYourSupportFeature';
import ET3Util from '../utils/ET3Util';
import { isAValidNumber } from '../validators/validator';

export default class RespondentSiteEmployeesController {
  private readonly form: Form;
  private readonly respondentSiteEmployees: FormContent = {
    fields: {
      et3ResponseSiteEmploymentCount: {
        classes: 'govuk-text',
        id: 'et3ResponseSiteEmploymentCount',
        type: 'text',
        label: (l: AnyRecord): string => l.label,
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: false,
        validator: isAValidNumber,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentSiteEmployees.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const cuiYourSupportEnabled = await getCuiYourSupportFeature().isEnabled(req.session.userCase?.caseTypeId);
    const nextPage = cuiYourSupportEnabled ? PageUrls.YOUR_SUPPORT : PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES;

    if (cuiYourSupportEnabled && !req.body?.saveForLater && !req.session.returnUrl && !req.session.subSectionUrl) {
      req.session.subSectionUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES);
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      nextPage
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SITE_EMPLOYEES);
    const content = getPageContent(req, this.respondentSiteEmployees, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SITE_EMPLOYEES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_SITE_EMPLOYEES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
