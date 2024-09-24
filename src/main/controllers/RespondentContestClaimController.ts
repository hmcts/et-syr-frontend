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

const logger = getLogger('RespondentContestClaimController');

export default class RespondentContestClaimController {
  private readonly form: Form;
  private readonly respondentContestClaim: FormContent = {
    fields: {
      respondentContestClaim: {
        classes: 'govuk-radios',
        id: 'respondentContestClaim',
        type: 'radios',
        labelHidden: true,
        values: [
          {
            name: 'respondentContestClaim',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentContestClaim',
            label: (l: AnyRecord): string => l.no,
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
    this.form = new Form(<FormFields>this.respondentContestClaim.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      await postLogic(req, res, this.form, logger, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      await postLogic(req, res, this.form, logger, PageUrls.NOT_IMPLEMENTED);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM);
    const content = getPageContent(req, this.respondentContestClaim, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTEST_CLAIM,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_CONTEST_CLAIM, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
