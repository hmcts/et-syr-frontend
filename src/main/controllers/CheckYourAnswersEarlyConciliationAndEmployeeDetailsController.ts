import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { FormFieldNames, InterceptPaths, LoggerConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getEt3Section3 } from '../helpers/controller/CheckYourAnswersET3Helper';
import { getLogger } from '../logger';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

const logger = getLogger('CheckYourAnswersEarlyConciliationAndEmployeeDetailsController');

export default class CheckYourAnswersEarlyConciliationAndEmployeeDetailsController {
  form: Form;
  private readonly formContent: FormContent = {
    fields: {
      haveYouCompleted: {
        classes: 'govuk-radios',
        id: 'haveYouCompleted',
        type: 'radios',
        label: (l: AnyRecord): string => l.cya.label,
        hint: (l: AnyRecord): string => l.cya.hint,
        labelHidden: false,
        values: [
          {
            name: 'haveYouCompleted',
            label: (l: AnyRecord): string => l.cya.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'haveYouCompleted',
            label: (l: AnyRecord): string => l.cya.no,
            value: YesOrNo.NO,
          },
        ],
        validator: isOptionSelected,
      },
      hiddenErrorField: {
        id: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        type: 'text',
        hidden: true,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(req.url);
    }

    // todo: handle the submission of CheckYourAnswersEarlyConciliationAndEmployeeDetailsController screen and set to yes or no depending on value,
    //  also handle duplication of this block
    //NOSONAR: duplication between CheckYourAnswers controllers

    const userCase: CaseWithId = await ET3Util.updateET3Data(req);
    if (req.session.errors?.length > 0) {
      logger.error(LoggerConstants.ERROR_API);
      return res.redirect(req.url);
    } else {
      req.session.userCase = userCase;
      res.redirect(PageUrls.CLAIMANT_PAY_DETAILS);
    }
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS);
    const userCase = req.session.userCase;

    const sectionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS, {
      ...req.t(
        TranslationKeys.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS as never,
        { returnObjects: true } as never
      ),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_ET3_COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      InterceptPaths,
      PageUrls,
      form: this.formContent,
      et3ResponseSection3: getEt3Section3(userCase, sectionTranslations),
      redirectUrl,
      hideContactUs: true,
    });
  };
}
