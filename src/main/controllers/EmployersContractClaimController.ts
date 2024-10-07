import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('EmployersContractClaimController');

export default class EmployersContractClaimController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      doesRespondentWantToMakeECC: {
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.doesRespondentWantToMakeECC === YesOrNo.YES) {
      await postLogic(req, res, this.form, logger, PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
    } else {
      await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYERS_CONTRACT_CLAIM,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM, {
      ...content,
      hideContactUs: true,
    });
  };
}
