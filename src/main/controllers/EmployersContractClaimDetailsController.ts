import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLessAndNotEmpty } from '../validators/validator';

export default class EmployersContractClaimDetailsController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseContestClaimDetails: {
        type: 'textarea',
        id: 'et3ResponseContestClaimDetails',
        label: (l: AnyRecord): string => l.et3ResponseContestClaimDetails.label,
        validator: isContentCharsOrLessAndNotEmpty(2500),
      },
      inset: {
        type: 'insetFields',
        id: 'inset',
        classes: 'govuk-heading-m',
        label: (l: AnyRecord): string => l.et3ResponseContestClaimDocument.title,
        subFields: {
          et3ResponseContestClaimDocument: {
            type: 'upload',
            id: 'et3ResponseContestClaimDocument',
            classes: 'govuk-label',
            labelHidden: false,
            labelSize: 'm',
          },
          upload: {
            type: 'button',
            label: (l: AnyRecord): string => l.et3ResponseContestClaimDocument.button,
            classes: 'govuk-button--secondary',
            id: 'upload',
            name: 'upload',
            value: 'true',
          },
        },
      },
      filesUploaded: {
        type: 'summaryList',
        label: (l: AnyRecord): string => l.et3ResponseContestClaimDocument.uploaded,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployersContractClaim,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM
    );
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
