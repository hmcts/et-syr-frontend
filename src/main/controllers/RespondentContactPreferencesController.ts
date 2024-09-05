import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { EmailOrPost, EnglishOrWelsh } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getContactPreferencesDetails } from '../helpers/controller/RespondentContactPreferencesControllerHelper';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

export default class RespondentContactPreferencesController {
  private readonly form: Form;
  private readonly respondentContactPreferences: FormContent = {
    fields: {
      respondentContactPreference: {
        classes: 'govuk-radios',
        id: 'respondentContactPreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.contactPreferenceQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentContactPreference',
            label: (l: AnyRecord): string => l.email,
            value: EmailOrPost.EMAIL,
          },
          {
            name: 'respondentContactPreference',
            label: (l: AnyRecord): string => l.post,
            value: EmailOrPost.POST,
            subFields: {
              respondentContactPreferenceDetail: {
                id: 'respondentContactPreferenceDetail',
                name: 'respondentContactPreferenceDetail',
                type: 'text',
                labelSize: 'normal',
                hint: (l: AnyRecord): string => l.postHintText,
                classes: 'govuk-text',
                validator: isFieldFilledIn,
              },
            },
          },
        ],
        validator: isOptionSelected,
      },
      //need to show ONLY if user is completing WELSH form
      respondentLanguagePreference: {
        classes: 'govuk-radios--inline',
        id: 'respondentLanguagePreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.contactPreferenceQuestion,
        labelHidden: false,
        values: [
          {
            name: 'respondentLanguagePreference',
            label: (l: AnyRecord): string => l.english,
            value: EnglishOrWelsh.ENGLISH,
          },
          {
            name: 'respondentLanguagePreference',
            label: (l: AnyRecord): string => l.cymraeg,
            value: EnglishOrWelsh.WELSH,
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentContactPreferences.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.NOT_IMPLEMENTED);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PREFERENCES);
    const userCase = req.session?.userCase;
    const contactPreferencesForm = this.respondentContactPreferences;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    res.render(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      InterceptPaths,
      languageParam: getLanguageParam(req.url),
      userCase,
      contactPreferencesRespondentSection: getContactPreferencesDetails(userCase, translations),
      form: contactPreferencesForm,
      sessionErrors: req.session.errors,
    });
  };
}
