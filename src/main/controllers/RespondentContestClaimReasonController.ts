import { Response } from 'express';

import { Form } from '../components/form';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { GovukTableRow } from '../definitions/govuk/govukTable';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import RespondentContestClaimReasonControllerHelper from '../helpers/controller/RespondentContestClaimReasonControllerHelper';
import { getLogger } from '../logger';
import FileUtils from '../utils/FileUtils';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

const logger = getLogger('RespondentContestClaimReasonController');

export default class RespondentContestClaimReasonController {
  private readonly form: Form;
  private readonly respondentContestClaimReason: FormContent = {
    fields: {
      et3ResponseContestClaimDetails: {
        classes: 'govuk-textarea',
        id: 'et3ResponseContestClaimDetails',
        type: 'charactercount',
        label: (l: AnyRecord): string => l.textAreaLabel,
        labelHidden: false,
        maxlength: 2500,
        validator: isContentCharsOrLessAndNotEmpty(2500),
      },
      uploadDocumentTable: {
        id: 'uploadDocumentTable',
        type: 'table',
        tableRows: [],
        hidden: false,
        label: l => l.fileUpload.linkText,
        hint: l => l.fileUploadTable.hint,
        classes: 'govuk-label',
      },
      contestClaimDocument: {
        id: 'contestClaimDocument',
        classes: 'govuk-label',
        labelHidden: false,
        labelSize: 'm',
        type: 'upload',
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
      claimSummaryAcceptedType: {
        id: 'claim-summary-file-accepted-type',
        label: l => l.acceptedFormats.label,
        labelHidden: true,
        type: 'readonly',
        classes: 'govuk-label',
        isCollapsable: true,
        collapsableTitle: l => l.acceptedFormats.label,
        hint: l => l.acceptedFormats.p1,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.respondentContestClaimReason.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.errors = [];
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }
    if (req.body?.upload) {
      if (req.fileTooLarge) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
            errorType: ValidationErrors.INVALID_FILE_SIZE,
          },
        ];
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      if (!FileUtils.checkFile(req)) {
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      const uploadedDocument: DocumentUploadResponse = await FileUtils.uploadFile(req);
      if (!uploadedDocument) {
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      const documentTypeItem: DocumentTypeItem = FileUtils.convertDocumentUploadResponseToDocumentTypeItem(
        req,
        uploadedDocument
      );
      if (!documentTypeItem) {
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      if (!req.session?.selectedRespondentIndex && req.session.selectedRespondentIndex !== 0) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
            errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
          },
        ];
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      if (
        !req.session?.userCase?.respondents ||
        !req.session?.userCase?.respondents[req.session.selectedRespondentIndex]
      ) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
            errorType: ValidationErrors.RESPONDENT_NOT_FOUND,
          },
        ];
        return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
      }
      if (!req.session?.userCase?.respondents[req.session.selectedRespondentIndex].et3ResponseContestClaimDocument) {
        req.session.userCase.respondents[req.session.selectedRespondentIndex].et3ResponseContestClaimDocument = [];
      }
      req.session?.userCase?.respondents[req.session.selectedRespondentIndex].et3ResponseContestClaimDocument.push(
        documentTypeItem
      );
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    }
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    RespondentContestClaimReasonControllerHelper.areInputValuesValid(req, formData);
    return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    const userCase = req.session.userCase;

    const textAreaLabel = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    const uploadedDocumentListTable = Object.entries(this.form.getFormFields())[1][1] as GovukTableRow;
    if ('tableRows' in uploadedDocumentListTable) {
      uploadedDocumentListTable.tableRows = req.session.selectedDocuments;
    }
    textAreaLabel.label = (l: AnyRecord): string =>
      l.textAreaLabel1 + userCase.respondents[0].respondentName + l.textAreaLabel2;

    const content = getPageContent(req, this.respondentContestClaimReason, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON, {
      ...content,
      redirectUrl,
      hideContactUs: true,
      postAddress: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
    });
  };
}
