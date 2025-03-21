import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNoOrNotApplicable } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';

export default class IsClaimantEmploymentWithRespondentContinuingController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseContinuingEmployment: {
        type: 'radios',
        hint: (l: AnyRecord): string => l.hint,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotApplicable.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotApplicable.NO,
          },
          {
            label: (l: AnyRecord): string => l.notApplicable,
            value: YesOrNoOrNotApplicable.NOT_APPLICABLE,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      },
    },
    submit: saveAndContinueButton,
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
      ET3HubLinkNames.ConciliationAndEmployeeDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CLAIMANT_JOB_TITLE
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseContinuingEmployment = undefined;
    }
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING, {
      ...content,
      hideContactUs: true,
    });
  };
}
