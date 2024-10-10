import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { answersAddressFormatter } from '../helpers/AddressHelper';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { conditionalRedirect } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected } from '../validators/validator';

export default class RespondentAddressController {
  form: Form;
  private readonly respondentAddressContent: FormContent = {
    fields: {
      respondentAddressQuestion: {
        classes: 'govuk-radios--inline',
        id: 'respondentAddressQuestion',
        type: 'radios',
        label: (l: AnyRecord): string => l.correctAddressQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentAddressQuestionYes',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'respondentAddressQuestionNo',
            label: (l: AnyRecord): string => l.no,
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
    this.form = new Form(<FormFields>this.respondentAddressContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)) {
      await ET3Util.updateET3ResponseWithET3Form(
        req,
        res,
        this.form,
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME
      );
    } else if (conditionalRedirect(req, this.form.getFormFields(), YesOrNo.NO)) {
      await ET3Util.updateET3ResponseWithET3Form(
        req,
        res,
        this.form,
        ET3HubLinkNames.ContactDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_ENTER_POST_CODE
      );
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_ADDRESS);
    const userCase = req.session.userCase;

    const content = getPageContent(req, this.respondentAddressContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_ADDRESS,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);

    const respondentAddress = answersAddressFormatter(
      userCase.workAddressLine1,
      userCase.workAddressLine2,
      userCase.workAddressLine3,
      userCase.workAddressTown,
      userCase.workAddressCounty,
      userCase.workAddressCountry,
      userCase.workAddressPostcode
    );

    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...content,
      redirectUrl,
      respondentAddress,
      hideContactUs: true,
    });
  };
}
