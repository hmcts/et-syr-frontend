import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, EmailOrPost, EnglishOrWelsh } from '../definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveAndContinueButton, saveForLaterButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import { getContactPreferencesDetails } from '../helpers/controller/RespondentContactPreferencesControllerHelper';
import ET3Util from '../utils/ET3Util';
import { isFieldFilledIn } from '../validators/validator';

export default class RespondentContactPreferencesController {
  private readonly form: Form;
  private readonly respondentContactPreferences: FormContent = {
    fields: {
      responseRespondentContactPreference: {
        classes: 'govuk-radios',
        id: 'responseRespondentContactPreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.contactPreferenceQuestion,
        labelHidden: false,
        values: [
          {
            name: 'responseRespondentContactPreference',
            label: (l: AnyRecord): string => l.email,
            value: EmailOrPost.EMAIL,
          },
          {
            name: 'responseRespondentContactPreference',
            label: (l: AnyRecord): string => l.post,
            value: EmailOrPost.POST,
            subFields: {
              et3ResponseContactReason: {
                id: 'et3ResponseContactReason',
                name: 'et3ResponseContactReason',
                type: 'text',
                label: (l: AnyRecord): string => l.postHintText,
                labelHidden: true,
                hint: (l: AnyRecord): string => l.postHintText,
                classes: 'govuk-text',
                validator: isFieldFilledIn,
              },
            },
          },
        ],
      },
      //need to show ONLY if user is completing WELSH form
      et3ResponseLanguagePreference: {
        classes: 'govuk-radios--inline',
        id: 'et3ResponseLanguagePreference',
        type: 'radios',
        label: (l: AnyRecord): string => l.tribunalContactYouQuestion,
        labelHidden: false,
        values: [
          {
            name: 'et3ResponseLanguagePreference',
            label: (l: AnyRecord): string => l.english,
            value: EnglishOrWelsh.ENGLISH,
          },
          {
            name: 'et3ResponseLanguagePreference',
            label: (l: AnyRecord): string => l.cymraeg,
            value: EnglishOrWelsh.WELSH,
          },
        ],
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentContactPreferences.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const userCase = req.session.userCase;
    const fieldsToReset: string[] = [];
    if (EmailOrPost.POST !== formData.responseRespondentContactPreference) {
      fieldsToReset.push('et3ResponseContactReason');
    }

    //hide the language preference if it's a Scottish office
    if (userCase.managingOffice === 'Scotland') {
      delete this.form.getFormFields().et3ResponseLanguagePreference;
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_CONTACT_PREFERENCES);
    const userCase = req.session?.userCase;
    const user = req.session?.user;

    if (isClearSelection(req)) {
      userCase.responseRespondentContactPreference = undefined;
      userCase.et3ResponseLanguagePreference = undefined;
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    };

    const content = getPageContent(req, this.respondentContactPreferences, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_CONTACT_PREFERENCES,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_CONTACT_PREFERENCES, {
      ...content,
      redirectUrl,
      hideContactUs: true,
      InterceptPaths,
      contactPreferencesRespondentSection: getContactPreferencesDetails(userCase, user.email, translations),
    });
  };
}
