import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';

export default class EmployersContractClaimController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseEmployerClaim: {
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
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.CLAIMANT_JOB_TITLE,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const nextPage =
      req.body.et3ResponseEmployerClaim === YesOrNo.YES
        ? PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS
        : PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM;
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployersContractClaim,
      LinkStatus.IN_PROGRESS,
      nextPage
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    if (isClearSelection(req)) {
      req.session.userCase.et3ContractClaimSection7 = undefined;
    }

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.EMPLOYERS_CONTRACT_CLAIM,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.EMPLOYERS_CONTRACT_CLAIM, {
      ...content,
      hideContactUs: true,
    });
  };
}
