import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId } from '../definitions/case';
import { ErrorPages, FormFieldNames, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getApplicationByUrl } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getApplicationDisplayByUrl } from '../helpers/controller/ContactTribunalHelper';
import {
  getFormError,
  getNextPage,
  getThisPage,
  handleFileUpload,
} from '../helpers/controller/ContactTribunalSelectedControllerHelper';
import { getLogger } from '../logger';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('ContactTribunalSelectedController');

export default class ContactTribunalSelectedController {
  private readonly form: Form;
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (StringUtils.isNotBlank(this.uploadedFileName)) {
      return (label.contactApplicationFile.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.contactApplicationFile.hint;
    }
  };

  private readonly formContent: FormContent = {
    fields: {
      contactApplicationFile: {
        id: 'contactApplicationFile',
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        label: (l: AnyRecord): string => l.contactApplicationFile.label,
        hint: (l: AnyRecord) => this.getHint(l),
      },
      upload: {
        label: (l: AnyRecord): string => l.files.uploadButton,
        classes: 'govuk-button--secondary',
        id: 'upload',
        type: 'button',
        name: 'upload',
        value: 'true',
        divider: false,
      },
      contactApplicationText: {
        type: 'charactercount',
        label: (l: AnyRecord): string => l.contactApplicationText.label,
        maxlength: 2500,
        labelAsHint: true,
      },
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }

    const selectedApplication = getApplicationByUrl(req.params.selectedOption);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (req.body?.upload) {
      const fileErrorRedirect = handleFileUpload(
        req,
        FormFieldNames.CONTACT_TRIBUNAL_SELECTED.CONTACT_APPLICATION_FILE_NAME
      );
      if (await fileErrorRedirect) {
        return res.redirect(getThisPage(selectedApplication, req));
      }
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const contactApplicationError = getFormError(req, formData);
    if (contactApplicationError) {
      req.session.errors.push(contactApplicationError);
      return res.redirect(getThisPage(selectedApplication, req));
    }

    req.session.userCase.contactApplicationType = selectedApplication.code;
    req.session.userCase.contactApplicationText = formData.contactApplicationText;

    res.redirect(getNextPage(selectedApplication, req));
  };

  public get = (req: AppRequest, res: Response): void => {
    this.uploadedFileName = req?.session?.userCase?.contactApplicationFile?.document_filename;
    const selectedApplication = getApplicationByUrl(req.params?.selectedOption);
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
      ethosCaseReference: req.session.userCase.ethosCaseReference,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      applicationType: getApplicationDisplayByUrl(req.params?.selectedOption, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
    });
  };
}
