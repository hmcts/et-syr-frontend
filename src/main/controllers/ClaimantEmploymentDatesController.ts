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

const logger = getLogger('ClaimantEmploymentDatesController');

export default class ClaimantEmploymentDatesController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      areDatesOfEmploymentCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            hint: (l: AnyRecord): string => l.noHintLabel,
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
            hint: (l: AnyRecord): string => l.notSureHintLabel,
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
    if (req.body.areDatesOfEmploymentCorrect === YesOrNoOrNotSure.NO) {
      await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER);
    } else {
      await postLogic(req, res, this.form, logger, PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, {
      ...content,
      startDate: '[Date entered by Claimant / Not provided]', // TODO: Update start date
      endDate: '[Date entered by Claimant / Not provided]', // TODO: Update end date
      hideContactUs: true,
    });
  };
}
