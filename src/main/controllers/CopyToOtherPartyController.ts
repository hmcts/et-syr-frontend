import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { CopyToOtherPartyRadioFormFields } from '../definitions/radios';
import { getApplicationDisplayByCode } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';

export default class CopyToOtherPartyController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: CopyToOtherPartyRadioFormFields,
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // TODO: Get values from inputs and Save them
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url));
    }

    req.session.userCase.copyToOtherPartyYesOrNo = formData.copyToOtherPartyYesOrNo;
    req.session.userCase.copyToOtherPartyText = formData.copyToOtherPartyText;
    res.redirect(PageUrls.CONTACT_TRIBUNAL_CYA + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COPY_TO_OTHER_PARTY,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.COPY_TO_OTHER_PARTY, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      caption: getApplicationDisplayByCode(req.session.userCase?.contactApplicationType, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
    });
  };
}
