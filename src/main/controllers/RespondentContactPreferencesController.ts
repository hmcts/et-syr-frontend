import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { EmailOrPost, EnglishOrWelsh } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { postLogic } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getContactPreferencesDetails } from '../helpers/controller/RespondentContactPreferencesControllerHelper';
import { getLogger } from '../logger';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentContactPreferencesController');

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
    await postLogic(req, res, this.form, logger, PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PREFERENCES);
    const userCase = req.session?.userCase;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    const content = getPageContent(req, this.respondentContactPreferences, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTACT_PREFERENCES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
      contactPreferencesRespondentSection: getContactPreferencesDetails(userCase, translations),
    });
  };
}
