import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNoOrNotSure } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected, isValidAvgWeeklyHours } from '../validators/validator';

export default class ClaimantAverageWeeklyWorkHoursController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseClaimantWeeklyHours: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseClaimantWeeklyHours.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              et3ResponseClaimantCorrectHours: {
                type: 'text',
                id: 'et3ResponseClaimantCorrectHours',
                label: (l: AnyRecord): string => l.et3ResponseClaimantCorrectHours.label,
                labelSize: 's',
                hint: (l: AnyRecord): string => l.et3ResponseClaimantCorrectHours.hint,
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
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];
    if (YesOrNoOrNotSure.NO !== formData.et3ResponseClaimantWeeklyHours) {
      fieldsToReset.push(formData.et3ResponseClaimantCorrectHours);
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS, {
      ...content,
      hideContactUs: true,
      userCase: req.session.userCase,
    });
  };
}
