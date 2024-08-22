import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isOptionSelected } from '../validators/validator';
import { getLanguageParam } from '../helpers/RouterHelpers';


export default class RespondentAddressController {

  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');
    const userCase = req.session.userCase;

    const respondentAddressContent: FormContent = {
      fields: {
        respondentAddress: {
          classes: 'govuk-radios--inline',
          id: 'respondentAddress',
          type: 'radios',
          label: (l: AnyRecord): string => l.correctAddressQuestion,
          labelHidden: false,
          values: [
            {
              name: 'respondentAddress',
              label: (l: AnyRecord): string => l.yes,
              value: YesOrNo.YES,
            },
            {
              name: 'respondentAddress',
              label: (l: AnyRecord): string => l.no,
              value: YesOrNo.NO,
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    res.render(TranslationKeys.RESPONDENT_ADDRESS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_ADDRESS as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      form: respondentAddressContent,
      userCase,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
