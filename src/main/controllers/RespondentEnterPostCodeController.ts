import { Response } from 'express';

import { isValidUKPostcode } from '../components/form/address_validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentEnterPostCodeController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');
    const userCase = req.session.userCase;

    const respondentEnterPostCodeContent: FormContent = {
      fields: {
        respondentEnterPostcode: {
          id: 'respondentEnterPostcode',
          type: 'text',
          label: l => l.enterPostcode,
          classes: 'govuk-label govuk-!-width-one-half',
          attributes: {
            maxLength: 14,
            autocomplete: 'postal-code',
          },
          validator: isValidUKPostcode,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    res.render(TranslationKeys.RESPONDENT_ENTER_POST_CODE, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ENTER_POST_CODE as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentEnterPostCodeContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
