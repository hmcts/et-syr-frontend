import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNoOrNotSure } from '../definitions/case';
import { ControllerNames, FieldsToReset, LoggerConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { getLogger } from '../logger';
import ET3Util from '../utils/ET3Util';
import { isContent2500CharsOrLess } from '../validators/validator';

const logger = getLogger('ClaimantPensionAndBenefitsController');

export default class ClaimantPensionAndBenefitsController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      et3ResponseIsPensionCorrect: {
        type: 'radios',
        label: (l: AnyRecord): string => l.areClaimantPensionBenefitsCorrect.label,
        values: [
          {
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNoOrNotSure.YES,
          },
          {
            label: (l: AnyRecord): string => l.no,
            value: YesOrNoOrNotSure.NO,
            subFields: {
              et3ResponsePensionCorrectDetails: {
                type: 'charactercount',
                label: (l: AnyRecord): string => l.whatAreClaimantCorrectPensionBenefits.label,
                labelSize: 's',
                maxlength: 2500,
                validator: isContent2500CharsOrLess,
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.notSure,
            value: YesOrNoOrNotSure.NOT_SURE,
          },
        ],
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
    if (YesOrNoOrNotSure.NO !== formData.et3ResponseIsPensionCorrect) {
      fieldsToReset.push(FieldsToReset.ET3_RESPONSE_PENSION_CORRECT_DETAILS);
    }
    logger.info(
      LoggerConstants.INFO_LOG_UPDATE_ET3_RESPONSE_WITH_ET3_FORM +
        ControllerNames.CLAIMANT_PENSION_AND_BENEFITS_CONTROLLER
    );
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.PayPensionBenefitDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
      fieldsToReset
    );
    logger.info(
      LoggerConstants.INFO_LOG_UPDATED_ET3_RESPONSE_WITH_ET3_FORM +
        ControllerNames.CLAIMANT_PENSION_AND_BENEFITS_CONTROLLER
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.CLAIMANT_PENSION_AND_BENEFITS, {
      ...content,
      hideContactUs: true,
      userCase: req.session.userCase,
    });
  };
}
