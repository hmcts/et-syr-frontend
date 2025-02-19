import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isContentCharsOrLess } from '../validators/validator';

export default class ClaimantJobTitleController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseIsJobTitleCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.et3ResponseIsJobTitleCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
            subFields: {
              et3ResponseCorrectJobTitle: {
                type: 'text',
                id: 'et3ResponseCorrectJobTitle',
                label: (l: AnyRecord): string => l.et3ResponseCorrectJobTitle.label,
                labelSize: 's',
                validator: isContentCharsOrLess(100),
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notApplicable,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_JOB_TITLE,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];
    if (YesOrNoOrNotApplicable.NO !== formData.et3ResponseIsJobTitleCorrect) {
      fieldsToReset.push(formData.et3ResponseCorrectJobTitle);
    }
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseIsJobTitleCorrect = undefined;
      req.session.userCase.et3ResponseCorrectJobTitle = undefined;
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_JOB_TITLE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_JOB_TITLE, {
      ...content,
      hideContactUs: true,
      userCase: req.session.userCase,
    });
  };
}
