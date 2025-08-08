import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { DefaultValues, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelectionWithoutRequestUserCaseCheck, startSubSection } from '../helpers/RouterHelpers';
import EmployersContractClaimDetailsControllerHelper from '../helpers/controller/EmployersContractClaimControllerHelper';
import ET3Util from '../utils/ET3Util';
import ErrorUtils from '../utils/ErrorUtils';
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
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    let nextPage = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
    if (formData.et3ResponseEmployerClaim === YesOrNo.YES) {
      nextPage = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
      startSubSection(req, nextPage);
    } else {
      EmployersContractClaimDetailsControllerHelper.resetEmployersContractClaimDetails(req);
    }
    if (StringUtils.isNotBlank(req.url)) {
      req.url = UrlUtils.removeParameterFromUrl(req.url, DefaultValues.CLEAR_SELECTION_URL_PARAMETER);
    }

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
    // Removes all errors that remains in request session except api for hidden field errors.
    // Because this screen is optional
    // That is why errors are the remaining errors of other pages.
    ErrorUtils.removeErrorsFromRequestExceptHiddenErrorFieldApiErrors(req);
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
