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
import { isContent100CharsOrLess, isOptionSelected } from '../validators/validator';

const logger = getLogger('ClaimantJobTitleController');

export default class ClaimantJobTitleController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      isClaimantJobTitleCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.isClaimantJobTitleCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              whatIsClaimantJobTitle: {
                type: 'text',
                id: 'whatIsClaimantJobTitle',
                label: (l: AnyRecord): string => l.whatIsClaimantJobTitle.label,
                labelSize: 's',
                validator: isContent100CharsOrLess,
              },
            },
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
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_JOB_TITLE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_JOB_TITLE, {
      ...content,
      jobTitle: '[Job title / Not provided]', // TODO: Update job title
      hideContactUs: true,
    });
  };
}
