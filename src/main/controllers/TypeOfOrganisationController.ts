import { Response } from 'express';

import {
  isOptionSelected,
  isValidCompanyRegistrationNumber,
  validateTitlePreference,
} from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { TypeOfOrganisation } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class TypeOfOrganisationController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');

    const TypeOfOrgContent: FormContent = {
      fields: {
        typeOfOrg: {
          classes: 'govuk-radios',
          id: 'typeOfOrg',
          type: 'radios',
          labelHidden: false,
          values: [
            {
              name: 'typeOfOrg',
              label: (l: AnyRecord): string => l.individual,
              value: TypeOfOrganisation.INDIVIDUAL,
              subFields: {
                typeOfOrgDetail: {
                  id: 'typeOfOrgIndividualTxt',
                  name: 'typeOfOrgIndividualTxt',
                  type: 'text',
                  labelSize: 'normal',
                  label: (l: AnyRecord): string => l.individualTextLabel,
                  classes: 'govuk-text',
                  attributes: { maxLength: 20 },
                  validator: validateTitlePreference,
                },
              },
            },
            {
              name: 'typeOfOrg',
              label: (l: AnyRecord): string => l.limitedCompany,
              value: TypeOfOrganisation.LIMITED_COMPANY,
              subFields: {
                typeOfOrgDetail: {
                  id: 'typeOfOrgLimitedCompanyTxt',
                  name: 'typeOfOrgLimitedCompanyTxt',
                  type: 'text',
                  labelSize: 'normal',
                  label: (l: AnyRecord): string => l.limitedCompanyTextLabel,
                  classes: 'govuk-text',
                  attributes: { maxLength: 8 },
                  validator: isValidCompanyRegistrationNumber,
                },
              },
            },
            {
              name: 'typeOfOrg',
              label: (l: AnyRecord): string => l.partnership,
              value: TypeOfOrganisation.PARTNERSHIP,
            },
            {
              name: 'typeOfOrg',
              label: (l: AnyRecord): string => l.unincorporatedAssociation,
              value: TypeOfOrganisation.UNINCORPORATED_ASSOCIATION,
            },
            {
              name: 'typeOfOrg',
              label: (l: AnyRecord): string => l.other,
              value: TypeOfOrganisation.OTHER,
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    res.render(TranslationKeys.TYPE_OF_ORGANISATION, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.TYPE_OF_ORGANISATION as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      form: TypeOfOrgContent,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
