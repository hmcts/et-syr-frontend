import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';
import { AnyRecord } from '../definitions/util-types';
import { isOptionSelected } from '../components/form/validator';

export default class RespondentSelectPostCodeController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');
    const userCase = req.session.userCase;

    // NOTE: text, will need to be changed to option when addresses are loaded based on postcode
    const respondentSelectPostCodeContent: FormContent = {
      fields: {
        addressEnterPostcode: {
          type: 'text',
          classes: 'govuk-select',
          label: (l: AnyRecord): string => l.selectAddress,
          id: 'addressAddressTypes',
          validator: isOptionSelected,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    res.render(TranslationKeys.RESPONDENT_SELECT_POST_CODE, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_SELECT_POST_CODE as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentSelectPostCodeContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
