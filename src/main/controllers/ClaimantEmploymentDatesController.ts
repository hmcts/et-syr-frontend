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
  private readonly claimantEmploymentDatesContent: FormContent = {
    fields: {
      areDatesOfEmploymentCorrect: {
        classes: 'govuk-radios',
        id: 'areDatesOfEmploymentCorrect',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        labelHidden: false,
        values: [
          {
            name: 'areDatesOfEmploymentCorrect',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            name: 'areDatesOfEmploymentCorrect',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            hint: (l: AnyRecord): string => l.noHintLabel,
          },
          {
            name: 'areDatesOfEmploymentCorrect',
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
    this.form = new Form(<FormFields>this.claimantEmploymentDatesContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.areDatesOfEmploymentCorrect === YesOrNoOrNotSure.NO) {
      await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER_CORRECT_DATES);
    }
    await postLogic(req, res, this.form, logger, PageUrls.CLAIMANT_IS_EMPLOYMENT_CONTINUING);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimantEmploymentDatesContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_EMPLOYMENT_DATES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_EMPLOYMENT_DATES, {
      ...content,
      startDate: '[Date entered by Claimant / Not provided]',
      endDate: '[Date entered by Claimant / Not provided]',
      hideContactUs: true,
    });
  };
}
