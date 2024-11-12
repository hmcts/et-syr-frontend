import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getApplicationByUrl } from '../definitions/contact-tribunal-applications';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { getCancelLink, getLanguageParam } from '../helpers/RouterHelpers';
import { getFormDataError, getNextPage } from '../helpers/controller/ContactTribunalSelectedHelper';

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
        labelAsHint: true,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const selectedApplication = getApplicationByUrl(req.params.selectedOption);
    if (!selectedApplication) {
      return res.redirect(PageUrls.NOT_IMPLEMENTED);
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const contactApplicationError = getFormDataError(formData);
    if (contactApplicationError) {
      req.session.errors.push(contactApplicationError);
      return res.redirect(
        PageUrls.CONTACT_TRIBUNAL_SELECTED.replace(':selectedOption', selectedApplication.url) +
          getLanguageParam(req.url)
      );
    }

    // TODO: Get values from inputs and Save them
    req.session.userCase.contactApplicationType = selectedApplication.code;
    req.session.userCase.contactApplicationFile = formData.contactApplicationFile;
    req.session.userCase.contactApplicationText = formData.contactApplicationText;
    res.redirect(getNextPage(selectedApplication, req.session.userCase) + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const selectedApplication = getApplicationByUrl(req.params.selectedOption);
    if (!selectedApplication) {
      return res.redirect(PageUrls.CONTACT_TRIBUNAL);
    }

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_TRIBUNAL_SELECTED,
      TranslationKeys.CONTACT_TRIBUNAL + '-' + selectedApplication.url,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CONTACT_TRIBUNAL_SELECTED, {
      ...content,
      hideContactUs: true,
      cancelLink: getCancelLink(req),
    });
  };
}
