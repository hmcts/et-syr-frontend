import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { RespondentRepresented } from '../definitions/case';
import { PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import { isFieldFilledIn } from '../validators/validator';

export default class LipOrRepController {
  private readonly form: Form;
  private readonly lipOrRepContent: FormContent = {
    fields: {
      respondentLipOrRep: {
        type: 'radios',
        classes: 'govuk-radios',
        id: 'lip-or-representative',
        label: l => l.legend,
        values: [
          {
            label: l => l.radio1,
            value: RespondentRepresented.MYSELF,
          },
          {
            label: l => l.radio2,
            value: RespondentRepresented.SOMEONE_ELSE,
          },
          {
            label: l => l.radio3,
            value: RespondentRepresented.LEGAL_REP,
          },
        ],
        validator: isFieldFilledIn,
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.lipOrRepContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    req.session.errors = [];

    const redirectUrl = getRedirectUrl(req);

    if (!redirectUrl) {
      req.session.errors.push({
        propertyName: 'respondentLipOrRep',
        errorType: ValidationErrors.REQUIRED,
      });
      return res.redirect(PageUrls.LIP_OR_REPRESENTATIVE + getLanguageParam(req.url));
    }

    res.redirect(returnValidUrl(redirectUrl));
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.lipOrRepContent, [
      TranslationKeys.COMMON,
      TranslationKeys.LIP_OR_REPRESENTATIVE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.LIP_OR_REPRESENTATIVE, {
      ...content,
    });
  };
}

const getRedirectUrl = (req: AppRequest): string => {
  const { respondentLipOrRep } = req.body;

  if (
    respondentLipOrRep === RespondentRepresented.MYSELF ||
    respondentLipOrRep === RespondentRepresented.SOMEONE_ELSE
  ) {
    return PageUrls.CASE_NUMBER_CHECK + getLanguageParam(req.url);
  }

  if (respondentLipOrRep === RespondentRepresented.LEGAL_REP) {
    return PageUrls.MAKING_RESPONSE_AS_LEGAL_REPRESENTATIVE + getLanguageParam(req.url);
  }

  return undefined;
};
