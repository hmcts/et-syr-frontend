import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { DefaultValues, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { isClearSelectionWithoutRequestUserCaseCheck } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';

export default class EmployersContractClaimController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseEmployerClaim: {
        id: 'et3ResponseEmployerClaim',
        type: 'radios',
        classes: 'govuk-radios--inline',
        label: (l: AnyRecord): string => l.label,
        values: [
          {
            name: 'et3ResponseEmployerClaim',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'et3ResponseEmployerClaim',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (StringUtils.isNotBlank(req.url)) {
      req.url = UrlUtils.removeParameterFromUrl(req.url, DefaultValues.CLEAR_SELECTION_URL_PARAMETER);
    }
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
    if (isClearSelectionWithoutRequestUserCaseCheck(req)) {
      if (req.session.userCase) {
        req.session.userCase.et3ResponseEmployerClaim = undefined;
      }
      req.session.errors = [];
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
