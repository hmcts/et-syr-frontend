import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import RespondentContestClaimControllerHelper from '../helpers/controller/RespondentContestClaimControllerHelper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

export default class RespondentContestClaimController {
  readonly form: Form;
  private readonly respondentContestClaim: FormContent = {
    fields: {
      et3ResponseRespondentContestClaim: {
        classes: 'govuk-radios',
        id: 'et3ResponseRespondentContestClaim',
        type: 'radios',
        labelHidden: true,
        values: [
          {
            name: 'et3ResponseRespondentContestClaim',
            label: (l: AnyRecord): string => l.yes1,
            value: YesOrNo.YES,
          },
          {
            name: 'et3ResponseRespondentContestClaim',
            label: (l: AnyRecord): string => l.no1,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentContestClaim.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    let nextPage = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
    if (formData.et3ResponseRespondentContestClaim === YesOrNo.YES) {
      nextPage = PageUrls.RESPONDENT_CONTEST_CLAIM_REASON;
      //force redirect through the flow before going back to CYA screen
      //if not save for later
      if (!req.body?.saveForLater) {
        req.session.returnUrl = nextPage;
      }
    } else {
      RespondentContestClaimControllerHelper.resetRespondentContestClaimDetails(req);
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContestClaim,
      LinkStatus.IN_PROGRESS,
      nextPage
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM);
    const userCase = req.session.userCase;
    const respondentName = userCase.respondents[0].respondentName;

    // Updating the labels to include both yes1, no1 and respondentName, yes2, no2
    const radioButtonFields = this.form.getFormFields();

    radioButtonFields.et3ResponseRespondentContestClaim.values[0].label = (l: AnyRecord): string =>
      `${l.yes1} ${respondentName} ${l.yes2}`;
    radioButtonFields.et3ResponseRespondentContestClaim.values[1].label = (l: AnyRecord): string =>
      `${l.no1} ${respondentName} ${l.no2}`;

    const content = getPageContent(req, this.respondentContestClaim, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTEST_CLAIM,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_CONTEST_CLAIM, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
