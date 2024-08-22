import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class RespondentNameController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');
    const userCase = req.session.userCase;

    const respondentNameContent: FormContent = {
      fields: {
        respondentName: {
          classes: 'govuk-radios',
          id: 'respondentName',
          type: 'radios',
          label: (l: AnyRecord): string => l.label1 + userCase.respondents[0].respondentName + l.label2,
          labelHidden: false,
          values: [
            {
              name: 'respondentName',
              label: l => l.yes,
              value: YesOrNo.YES,
            },
            {
              name: 'respondentName',
              label: (l: AnyRecord): string => l.no,
              value: YesOrNo.NO,
              subFields: {
                respondentNameDetail: {
                  id: 'respondentNameTxt',
                  name: 'respondentNameTxt',
                  type: 'text',
                  labelSize: 'normal',
                  label: (l: AnyRecord): string => l.respondentNameTextLabel,
                  classes: 'govuk-text',
                  attributes: { maxLength: 100 },
                  validator: isFieldFilledIn,
                },
              },
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_NAME as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      userCase,
      hideContactUs: true,
      form: respondentNameContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
