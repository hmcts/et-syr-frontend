import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import { getEt3Section5 } from '../helpers/controller/CheckYourAnswersET3Helper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

export default class CheckYourAnswersContestClaimController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      contestClaimSection: {
        classes: 'govuk-radios',
        id: 'contestClaimSection',
        type: 'radios',
        label: (l: AnyRecord): string => l.cya.label,
        hint: (l: AnyRecord): string => l.cya.hint,
        labelHidden: false,
        values: [
          {
            name: 'contestClaimSection',
            label: (l: AnyRecord): string => l.cya.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'contestClaimSection',
            label: (l: AnyRecord): string => l.cya.no,
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
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let linkStatus;
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      linkStatus = LinkStatus.COMPLETED;
    } else {
      linkStatus = LinkStatus.IN_PROGRESS;
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContestClaim,
      linkStatus,
      PageUrls.RESPONDENT_RESPONSE_TASK_LIST
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      sessionErrors: req.session.errors,
      form: this.formContent,
      et3ResponseSection5: getEt3Section5(userCase, sectionTranslations, InterceptPaths.CONTEST_CLAIM_CHANGE),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
