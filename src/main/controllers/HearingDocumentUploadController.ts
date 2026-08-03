import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { ErrorPages, FormFieldNames, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormatDocument } from '../helpers/ApiFormatter';
import { getPageContent } from '../helpers/FormHelper';
import { getFileErrorMessage, getFilesRows, getPdfUploadError } from '../helpers/HearingDocumentsHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getLogger } from '../logger';
import FileUtils from '../utils/FileUtils';
import ObjectUtils from '../utils/ObjectUtils';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('HearingDocumentUploadController');

export default class HearingDocumentUploadController {
  private readonly form: Form;
  private readonly hearingDocumentUploadFormContent: FormContent = {
    fields: {
      inset: {
        id: 'inset',
        classes: 'govuk-heading-m',
        label: (l: AnyRecord): string => l.files.title,
        type: 'insetFields',
        subFields: {
          hearingDocument: {
            id: 'hearingDocument',
            classes: 'govuk-label',
            labelHidden: true,
            labelSize: 'm',
            type: 'upload',
          },
          upload: {
            label: (l: AnyRecord): string => l.files.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            type: 'button',
            name: 'upload',
            value: 'true',
          },
        },
      },
      filesUploaded: {
        label: (l: AnyRecord): string => l.files.uploaded,
        type: 'summaryList',
      },
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.hearingDocumentUploadFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    this.form.getParsedBody(req.body, this.form.getFormFields());

    req.session.errors = [];

    const hearingDocumentError = getPdfUploadError(
      req.file,
      req.fileTooLarge,
      userCase.hearingDocument,
      FormFieldNames.HEARING_DOCUMENT_UPLOAD.HEARING_DOCUMENT
    );

    const foundHearing = userCase.hearingCollection?.find(hearing => hearing.id === req.params.hearingId);
    if (!foundHearing) {
      logger.error('Hearing not found');
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }
    const pageUrl = PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', foundHearing.id) + getLanguageParam(req.url);

    if (hearingDocumentError) {
      req.session.errors.push(hearingDocumentError);
      return res.redirect(pageUrl);
    }

    if (req.body.upload) {
      try {
        if (ObjectUtils.isEmpty(req?.file)) {
          req.session.errors.push({
            propertyName: FormFieldNames.HEARING_DOCUMENT_UPLOAD.HEARING_DOCUMENT,
            errorType: 'required',
          });
          return res.redirect(pageUrl);
        }

        const uploadedDocumentResponse = await FileUtils.uploadFile(req);
        if (!uploadedDocumentResponse) {
          req.session.errors.push({
            propertyName: FormFieldNames.HEARING_DOCUMENT_UPLOAD.HEARING_DOCUMENT,
            errorType: 'backEndError',
          });
          return res.redirect(pageUrl);
        }
        userCase.hearingDocument = fromApiFormatDocument(uploadedDocumentResponse);
        req.file = undefined;
      } catch (error) {
        logger.info(error);
        req.session.errors.push({
          propertyName: FormFieldNames.HEARING_DOCUMENT_UPLOAD.HEARING_DOCUMENT,
          errorType: 'backEndError',
        });
        return res.redirect(pageUrl);
      }
      return res.redirect(pageUrl);
    }

    if (!userCase.hearingDocument) {
      req.session.errors.push({
        propertyName: FormFieldNames.HEARING_DOCUMENT_UPLOAD.HEARING_DOCUMENT,
        errorType: 'required',
      });
      return res.redirect(pageUrl);
    }

    return res.redirect(PageUrls.BUNDLES_DOCS_FOR_HEARING_CYA + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const userCase = req.session?.userCase;
    const content = getPageContent(req, this.hearingDocumentUploadFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.HEARING_DOCUMENT_UPLOAD,
    ]);

    (this.hearingDocumentUploadFormContent.fields as any).inset.subFields.upload.disabled =
      userCase?.hearingDocument !== undefined;

    (this.hearingDocumentUploadFormContent.fields as any).filesUploaded.rows = getFilesRows(
      userCase,
      req.params.hearingId,
      {
        ...req.t(TranslationKeys.HEARING_DOCUMENT_UPLOAD as never, { returnObjects: true } as never),
      }
    );

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.HEARING_DOCUMENT_UPLOAD as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.HEARING_DOCUMENT_UPLOAD, {
      PageUrls,
      userCase,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      documentsLink: PageUrls.DOCUMENTS + getLanguageParam(req.url),
      errorMessage: getFileErrorMessage(req.session.errors, translations.errors.hearingDocument),
      ...content,
    });
  };
}
