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
import { isOptionSelected, isValidAvgWeeklyHours } from '../validators/validator';

const logger = getLogger('ClaimantAverageWeeklyWorkHoursController');

export default class ClaimantAverageWeeklyWorkHoursController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      areClaimantWorkHourCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.areClaimantWorkHourCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              whatAreClaimantCorrectWorkHour: {
                type: 'text',
                id: 'whatAreClaimantCorrectWorkHour',
                label: (l: AnyRecord): string => l.whatAreClaimantCorrectWorkHour.label,
                labelSize: 's',
                hint: (l: AnyRecord): string => l.whatAreClaimantCorrectWorkHour.hint,
                validator: isValidAvgWeeklyHours,
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
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, {
      ...content,
      workHour: '[Average weekly work hours]', // TODO: Update work hour
      hideContactUs: true,
    });
  };
}
