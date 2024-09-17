import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantIsEmploymentContinuingController');

export default class ClaimantIsEmploymentContinuingController {
  form: Form;
  private readonly claimantIsEmploymentContinuingContent: FormContent = {
    fields: {
      isEmploymentContinuing: {
        type: 'radios',
        hint: (l: AnyRecord): string => l.hint,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.claimantIsEmploymentContinuingContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_JOB_TITLE);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimantIsEmploymentContinuingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_IS_EMPLOYMENT_CONTINUING,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_IS_EMPLOYMENT_CONTINUING, {
      ...content,
      hideContactUs: true,
    });
  };
}
