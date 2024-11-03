import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import RespondentContestClaimReasonControllerHelper from '../helpers/controller/RespondentContestClaimReasonControllerHelper';
import { getLogger } from '../logger';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

const logger = getLogger('RespondentContestClaimReasonController');

export default class RespondentContestClaimReasonController {
  private readonly form: Form;
  public uploadedFileList: [] = undefined;
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
      contestClaimFiles: {
        id: 'contestClaimFiles',
        label: l => l.fileUpload.label,
        labelHidden: false,
        type: 'insetFields',
        classes: 'govuk-label',
        isCollapsable: true,
        collapsableTitle: l => l.fileUpload.linkText,
        exclusive: true,
        divider: false,
        subFields: {
          uploadDocumentTable: {
            id: 'uploadDocumentTable',
            rows: this.uploadedFileList,
            type: 'table',
            hint: l => l.fileUploadTable.hint,
            hidden: false,
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
        },
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
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }
    if (req.fileTooLarge) {
      req.session.errors = [
        {
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
          errorType: ValidationErrors.INVALID_FILE_SIZE,
        },
      ];
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    }
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    if (!RespondentContestClaimReasonControllerHelper.areInputValuesValid(req, formData, [], logger)) {
      return res.redirect(setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON));
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    const userCase = req.session.userCase;

    const textAreaLabel = Object.entries(this.form.getFormFields())[0][1] as FormInput;
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
