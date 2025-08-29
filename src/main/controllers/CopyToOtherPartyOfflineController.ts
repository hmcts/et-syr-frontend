import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { CopyToOtherPartyOfflineRadioFormFields } from '../definitions/radios';
import { getApplicationDisplayByCode } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';

export default class CopyToOtherPartyOfflineController {
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
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.userCase.copyToOtherPartyYesOrNo = formData.copyToOtherPartyYesOrNo;
    req.session.userCase.copyToOtherPartyText = formData.copyToOtherPartyText;

    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY_OFFLINE + getLanguageParam(req.url));
    }

    const nextPage =
      req.body.copyToOtherPartyYesOrNo === YesOrNo.YES
        ? PageUrls.CONTACT_TRIBUNAL_CYA_OFFLINE + getLanguageParam(req.url)
        : PageUrls.CONTACT_TRIBUNAL_CYA + getLanguageParam(req.url);
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
      caption: getApplicationDisplayByCode(req.session.userCase?.contactApplicationType, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
    });
  };
}
