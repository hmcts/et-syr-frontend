import { Response } from 'express';

import { Form } from '../components/form';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { ErrorPages, FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getApplicationByUrl } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getApplicationDisplayByUrl } from '../helpers/controller/ContactTribunalHelper';
import {
  getFormDataError,
  getNextPage,
  getThisPage,
  setFileToUserCase,
} from '../helpers/controller/ContactTribunalSelectedControllerHelper';
import { getLogger } from '../logger';
import ErrorUtils from '../utils/ErrorUtils';
import FileUtils from '../utils/FileUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('ContactTribunalSelectedController');

export default class ContactTribunalSelectedController {
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (StringUtils.isNotBlank(this.uploadedFileName)) {
      return (label.fileUpload.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.fileUpload.hint;
    }
  };
  private readonly form: Form;
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
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
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

    const thisPage = getThisPage(selectedApplication, req);

    if (req.body?.upload && ObjectUtils.isEmpty(req?.file)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NOT_SELECTED,
        FormFieldNames.CONTACT_TRIBUNAL_SELECTED.CONTACT_APPLICATION_FILE_NAME
      );
      return res.redirect(thisPage);
    } else {
      req.session.errors = [];
    }

    if (ObjectUtils.isNotEmpty(req?.file)) {
      req.session.errors = [];
      if (req.fileTooLarge) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.CONTACT_TRIBUNAL_SELECTED.CONTACT_APPLICATION_FILE_NAME,
            errorType: ValidationErrors.INVALID_FILE_SIZE,
          },
        ];
        return res.redirect(thisPage);
      }

      if (!FileUtils.checkFile(req, FormFieldNames.CONTACT_TRIBUNAL_SELECTED.CONTACT_APPLICATION_FILE_NAME)) {
        return res.redirect(thisPage);
      }

      const uploadedDocument: DocumentUploadResponse = await FileUtils.uploadFile(req);
      if (!uploadedDocument) {
        return res.redirect(thisPage);
      }

      setFileToUserCase(req, uploadedDocument);
      req.file = undefined;
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());

    const contactApplicationError = getFormDataError(formData);
    if (contactApplicationError) {
      req.session.errors.push(contactApplicationError);
      return res.redirect(thisPage);
    }

    req.session.userCase.contactApplicationType = selectedApplication.code;
    req.session.userCase.contactApplicationFile = formData.contactApplicationFile;
    req.session.userCase.contactApplicationText = formData.contactApplicationText;

    res.redirect(getNextPage(selectedApplication, req));
  };

  public get = (req: AppRequest, res: Response): void => {
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
