import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getApplicationByUrl, isTypeAOrB } from '../definitions/contact-tribunal-applications';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isClaimantSystemUser } from '../helpers/controller/ContactTribunalHelper';
import { isContentCharsOrLess } from '../validators/validator';

export default class ContactTribunalSelectedController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      contactApplicationFile: {
        type: 'upload',
        label: (l: AnyRecord): string => l.contactApplicationFile.label,
        labelAsHint: true,
      },
      contactApplicationText: {
        type: 'charactercount',
        label: (l: AnyRecord): string => l.contactApplicationText.label,
        maxlength: 2500,
        validator: isContentCharsOrLess(2500),
        labelAsHint: true,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication = getApplicationByUrl(req.params.selectedOption);
    if (!selectedApplication) {
      res.redirect(PageUrls.NOT_IMPLEMENTED);
    }

    let nextPage: string = PageUrls.CONTACT_THE_TRIBUNAL_CYA;
    if (isTypeAOrB(selectedApplication)) {
      nextPage = isClaimantSystemUser()
        ? PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url)
        : PageUrls.COPY_TO_OTHER_PARTY_OFFLINE + getLanguageParam(req.url);
    }

    // TODO: Get values from inputs and Save them
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.userCase.contactApplicationType = selectedApplication.code;
    req.session.userCase.contactApplicationFile = formData.contactApplicationFile;
    req.session.userCase.contactApplicationText = formData.contactApplicationText;
    res.redirect(nextPage + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const selectedApplication = getApplicationByUrl(req.params.selectedOption);
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_TRIBUNAL_SELECTED,
      TranslationKeys.CONTACT_TRIBUNAL + '-' + selectedApplication.url,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CONTACT_TRIBUNAL_SELECTED, {
      ...content,
      hideContactUs: true,
    });
  };
}
