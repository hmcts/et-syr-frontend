import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { CopyToOtherPartyOfflineRadioFormFields } from '../definitions/radios';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToNotificationCopyOfflineController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: CopyToOtherPartyOfflineRadioFormFields,
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    userCase.copyToOtherPartyYesOrNo = formData.copyToOtherPartyYesOrNo;
    userCase.copyToOtherPartyText = formData.copyToOtherPartyText;

    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION_COPY_OFFLINE + getLanguageParam(req.url));
    }

    if (userCase.copyToOtherPartyYesOrNo === YesOrNo.YES) {
      userCase.copyToOtherPartyText = undefined;
    }

    const nextPage =
      req.body.copyToOtherPartyYesOrNo === YesOrNo.YES
        ? PageUrls.RESPOND_TO_NOTIFICATION_CYA_OFFLINE + getLanguageParam(req.url)
        : PageUrls.RESPOND_TO_NOTIFICATION_CYA + getLanguageParam(req.url);
    res.redirect(nextPage);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
