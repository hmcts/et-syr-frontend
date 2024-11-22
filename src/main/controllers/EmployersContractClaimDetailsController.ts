import { Response } from 'express';

import { Form } from '../components/form';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, UploadedDocumentType } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys, et3AttachmentDocTypes } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import EmployersContractClaimDetailsControllerHelper from '../helpers/controller/EmployersContractClaimDetailsControllerHelper';
import { getLogger } from '../logger';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';
import FileUtils from '../utils/FileUtils';
import NumberUtils from '../utils/NumberUtils';
import ObjectUtils from '../utils/ObjectUtils';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

const logger = getLogger('EmployersContractClaimDetailsController');

export default class EmployersContractClaimDetailsController {
  private uploadedFileName = '';
  private getHint = (label: AnyRecord): string => {
    if (this.uploadedFileName !== '') {
      return (label.fileUpload.hintExisting as string).replace('{{filename}}', this.uploadedFileName);
    } else {
      return label.fileUpload.hint;
    }
  };
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseEmployerClaimDetails: {
        type: 'charactercount',
        id: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS,
        label: (l: AnyRecord): string => l.et3ResponseEmployerClaimDetails.label,
        maxlength: 3000,
        attributes: { maxLength: 3000 },
        validator: isContentCharsOrLessAndNotEmpty(3000),
      },
      claimSummaryFile: {
        id: 'claimSummaryFile',
        label: (l: AnyRecord) => l.fileUpload.label,
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        hint: (l: AnyRecord) => this.getHint(l),
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
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
    if (req.fileTooLarge) {
      req.session.errors = [
        {
          propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME,
          errorType: 'invalidFileSize',
        },
      ];
      return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
    }
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    EmployersContractClaimDetailsControllerHelper.areInputValuesValid(req, formData);
    if (req.session.errors && req.session.errors.length === 0) {
      req.session.userCase.et3ResponseEmployerClaimDetails = formData.et3ResponseEmployerClaimDetails;
      if (ObjectUtils.isNotEmpty(req.file)) {
        if (!FileUtils.checkFile(req)) {
          return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
        }
        const uploadedDocument: DocumentUploadResponse = await FileUtils.uploadFile(req);
        if (!uploadedDocument) {
          return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
        }
        const uploadedDocumentType: UploadedDocumentType = {
          category_id: et3AttachmentDocTypes[0],
          document_binary_url: uploadedDocument.uri,
          document_filename: uploadedDocument.originalDocumentName,
          document_url: uploadedDocument.uri,
          upload_timestamp: uploadedDocument.createdOn,
        };
        req.session.userCase.et3ResponseEmployerClaimDocument = uploadedDocumentType;
        if (
          CollectionUtils.isNotEmpty(req.session?.userCase?.respondents) &&
          NumberUtils.isNotEmpty(req.session?.selectedRespondentIndex) &&
          ObjectUtils.isNotEmpty(req.session?.userCase.respondents[req.session.selectedRespondentIndex])
        ) {
          req.session.userCase.respondents[req.session.selectedRespondentIndex].et3ResponseEmployerClaimDocument =
            uploadedDocumentType;
        }
      }
      await ET3Util.updateET3ResponseWithET3Form(
        req,
        res,
        this.form,
        ET3HubLinkNames.EmployersContractClaim,
        LinkStatus.IN_PROGRESS,
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM
      );
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS, {
      ...content,
      hideContactUs: true,
    });
  };
}
