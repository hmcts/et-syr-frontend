import { Response } from 'express';

import { Form } from '../components/form';
import { DocumentUploadResponse } from '../definitions/api/documentApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import EmployersContractClaimDetailsControllerHelper from '../helpers/controller/EmployersContractClaimDetailsControllerHelper';
import { getLogger } from '../logger';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
import FileUtils from '../utils/FileUtils';
import ObjectUtils from '../utils/ObjectUtils';
import StringUtils from '../utils/StringUtils';

const logger = getLogger('EmployersContractClaimDetailsController');

export default class EmployersContractClaimDetailsController {
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
      et3ResponseEmployerClaimDetails: {
        type: 'charactercount',
        id: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.ET3_RESPONSE_EMPLOYER_CLAIM_DETAILS,
        label: (l: AnyRecord): string => l.et3ResponseEmployerClaimDetails.label,
        maxlength: 3000,
        attributes: { maxLength: 3000 },
      },
      claimSummaryFile: {
        id: 'claimSummaryFile',
        labelHidden: true,
        type: 'upload',
        classes: 'govuk-label',
        label: 'Upload Document',
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
      claimSummaryAcceptedTypes: {
        id: 'claimSummaryFileAcceptedType',
        isCollapsable: true,
        collapsableTitle: l => l.acceptedFormats.label,
        hint: l => l.acceptedFormats.p1,
        labelHidden: true,
        type: 'readonly',
        classes: 'govuk-label',
        label: l => l.acceptedFormats.label,
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
    if (req.body?.upload && ObjectUtils.isEmpty(req?.file)) {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        req,
        ValidationErrors.INVALID_FILE_NOT_SELECTED,
        FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME
      );
      return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
    } else {
      req.session.errors = [];
    }
    if (ObjectUtils.isNotEmpty(req?.file)) {
      req.session.errors = [];
      if (req.fileTooLarge) {
        req.session.errors = [
          {
            propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME,
            errorType: 'invalidFileSize',
          },
        ];
        return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
      }

      if (!FileUtils.checkFile(req, FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME)) {
        return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
      }
      const uploadedDocument: DocumentUploadResponse = await FileUtils.uploadFile(req);
      if (!uploadedDocument) {
        return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
      }
      EmployersContractClaimDetailsControllerHelper.setEmployerClaimDocumentToUserCase(req, uploadedDocument);
      req.file = undefined;
    }
    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.userCase.et3ResponseEmployerClaimDetails = formData.et3ResponseEmployerClaimDetails;
    EmployersContractClaimDetailsControllerHelper.areInputValuesValid(req, formData);
    if (CollectionUtils.isNotEmpty(req.session.errors)) {
      return res.redirect(setUrlLanguage(req, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS));
    }
    let redirectUrl: string = PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM;
    if (req.body?.upload) {
      redirectUrl = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployersContractClaim,
      LinkStatus.IN_PROGRESS,
      redirectUrl
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    this.uploadedFileName = EmployersContractClaimDetailsControllerHelper.getET3EmployersContractClaimDocumentName(req);
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
