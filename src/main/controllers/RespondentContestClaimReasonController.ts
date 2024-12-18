import { Response } from 'express';

import { Form } from '../components/form';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { ApiDocumentTypeItem, DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors, languages } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { GovukTableRow } from '../definitions/govuk/govukTable';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import RespondentContestClaimReasonControllerHelper from '../helpers/controller/RespondentContestClaimReasonControllerHelper';
import { getLogger } from '../logger';
import CollectionUtils from '../utils/CollectionUtils';
import DocumentUtils from '../utils/DocumentUtils';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import FileUtils from '../utils/FileUtils';
import ObjectUtils from '../utils/ObjectUtils';
import { isContentCharsOrLess } from '../validators/validator';

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
        maxlength: 3000,
        attributes: { maxLength: 3000 },
        validator: isContentCharsOrLess(3000),
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
        labelHidden: true,
        labelSize: 'm',
        label: 'Upload Document',
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
      submit: {
        label: (l: AnyRecord): string => l.submit,
        id: 'submit',
        type: 'button',
        name: 'submit',
        value: 'true',
        divider: false,
      },
      saveAsDraft: {
        label: (l: AnyRecord): string => l.saveForLater,
        id: 'saveAsDraft',
        type: 'button',
        name: 'saveAsDraft',
        value: 'true',
        divider: false,
        classes: 'govuk-button--secondary',
      },
    },
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
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    if (ObjectUtils.isNotEmpty(req.file)) {
      if (req.fileTooLarge) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
            errorType: ValidationErrors.INVALID_FILE_SIZE,
          },
        ];
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      if (!FileUtils.checkFile(req, FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT)) {
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      if (FileUtils.fileAlreadyExists(req)) {
        ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
          req,
          ValidationErrors.FILE_ALREADY_EXISTS,
          FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT
        );
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      const uploadedDocument: DocumentUploadResponse = await FileUtils.uploadFile(req);
      if (!uploadedDocument) {
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      const documentTypeItem: DocumentTypeItem = FileUtils.convertDocumentUploadResponseToDocumentTypeItem(
        req,
        uploadedDocument
      );
      if (!documentTypeItem) {
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      if (CollectionUtils.isEmpty(req.session.userCase.et3ResponseContestClaimDocument)) {
        req.session.userCase.et3ResponseContestClaimDocument = [];
      }
      req.session?.userCase?.et3ResponseContestClaimDocument.push(documentTypeItem);
      req.file = undefined;
    }
    req.session.userCase.et3ResponseContestClaimDetails = formData.et3ResponseContestClaimDetails;
    if (req.body?.upload) {
      return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
    }
    RespondentContestClaimReasonControllerHelper.areInputValuesValid(req, formData);

    if (req.session.errors && req.session.errors.length === 0 && (req.body?.submit || req.body?.saveAsDraft)) {
      req.session.userCase.et3ResponseContestClaimDetails = formData.et3ResponseContestClaimDetails;
      const userCase = await ET3Util.updateET3Data(req, ET3HubLinkNames.ContestClaim, LinkStatus.IN_PROGRESS);
      if (!userCase) {
        ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
          req,
          ValidationErrors.FILE_UPLOAD_BACKEND_ERROR,
          FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
        );
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
      }
      req.session.userCase = userCase;
      if (req.body?.submit) {
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM)));
      }
      if (req.body?.saveAsDraft) {
        return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONSE_SAVED)));
      }
    }
    return res.redirect(returnValidUrl(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON)));
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl: string = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    const userCase: CaseWithId = req.session.userCase;
    const languageParam: string = getLanguageParam(req.url);
    let et1Form: ApiDocumentTypeItem;
    if (languageParam === languages.WELSH_URL_PARAMETER) {
      et1Form = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        req?.session?.userCase?.documentCollection,
        languages.WELSH_URL_PARAMETER
      );
    } else {
      et1Form = DocumentUtils.findET1FormByLanguageAsApiDocumentTypeItem(
        req?.session?.userCase?.documentCollection,
        languages.ENGLISH_URL_PARAMETER
      );
    }
    const textAreaLabel = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    const uploadedDocumentListTable = Object.entries(this.form.getFormFields())[1][1] as GovukTableRow;
    if ('tableRows' in uploadedDocumentListTable) {
      uploadedDocumentListTable.tableRows = FileUtils.convertDocumentTypeItemsToGovUkTableRows(req);
    }
    textAreaLabel.label = (l: AnyRecord): string =>
      l.textAreaLabel1 + userCase.respondents[req.session.selectedRespondentIndex].respondentName + l.textAreaLabel2;

    const content = getPageContent(req, this.respondentContestClaimReason, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_CONTEST_CLAIM_REASON, {
      ...content,
      redirectUrl,
      hideContactUs: true,
      postAddress: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
      et1FormId: et1Form?.id,
    });
  };
}
