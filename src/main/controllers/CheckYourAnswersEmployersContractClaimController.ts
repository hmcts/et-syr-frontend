import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getEt3Section6 } from '../helpers/controller/CheckYourAnswersET3Helper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

export default class CheckYourAnswersEmployersContractClaimController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      employersContractClaimSection: {
        classes: 'govuk-radios',
        id: 'employersContractClaimSection',
        type: 'radios',
        label: (l: AnyRecord): string => l.cya.label,
        hint: (l: AnyRecord): string => l.cya.hint,
        labelHidden: false,
        values: [
          {
            name: 'employersContractClaimSection',
            label: (l: AnyRecord): string => l.cya.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'employersContractClaimSection',
            label: (l: AnyRecord): string => l.cya.no,
            value: YesOrNo.NO,
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
    // todo: handle the submission of CheckYourAnswersEmployersContractClaimController screen and set to yes or no depending on value,
    //  also handle duplication of this block
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.EmployersContractClaim,
      LinkStatus.COMPLETED,
      PageUrls.CLAIMANT_PAY_DETAILS
    );
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM, {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      form: this.formContent,
      et3ResponseSection6: getEt3Section6(
        userCase,
        sectionTranslations,
        InterceptPaths.EMPLOYERS_CONTRACT_CLAIM_CHANGE
      ),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
