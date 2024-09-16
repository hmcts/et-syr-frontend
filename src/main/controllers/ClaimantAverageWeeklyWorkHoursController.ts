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

const logger = getLogger('ClaimantAverageWeeklyWorkHoursController');

export default class ClaimantAverageWeeklyWorkHoursController {
  form: Form;
  private readonly claimantAverageWeeklyWorkHoursContent: FormContent = {
    fields: {
      areWorkHourCorrect: {
        classes: 'govuk-radios',
        id: 'areWorkHourCorrect',
        type: 'radios',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            name: 'areWorkHourCorrect',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            name: 'areWorkHourCorrect',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              whatAreWorkHour: {
                id: 'whatAreWorkHour',
                name: 'whatAreWorkHour',
                type: 'text',
                label: (l: AnyRecord): string => l.noLabel,
                attributes: { maxLength: 100 },
                hint: (l: AnyRecord): string => l.noLabelHint,
              },
            },
          },
          {
            name: 'areWorkHourCorrect',
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
    this.form = new Form(<FormFields>this.claimantAverageWeeklyWorkHoursContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await postLogic(req, res, this.form, logger, PageUrls.NOT_IMPLEMENTED);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.claimantAverageWeeklyWorkHoursContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, {
      ...content,
      workHour: '[Average weekly work hours]',
      hideContactUs: true,
    });
  };
}
