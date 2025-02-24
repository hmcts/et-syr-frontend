import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';

export default class RespondentSitesController {
  private readonly form: Form;
  private readonly respondentSites: FormContent = {
    fields: {
      et3ResponseMultipleSites: {
        classes: 'govuk-radios',
        id: 'respondentSites',
        type: 'radios',
        hint: (l: AnyRecord): string => l.hint,
        labelHidden: true,
        values: [
          {
            name: 'respondentSites',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            name: 'respondentSites',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.RESPONDENT_SITES,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentSites.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployerDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_SITE_EMPLOYEES
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_SITES);

    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseMultipleSites = undefined;
    }

    const content = getPageContent(req, this.respondentSites, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_SITES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_SITES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
