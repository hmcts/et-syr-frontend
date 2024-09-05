import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { TypeOfOrganisation } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isOptionSelected, isValidCompanyRegistrationNumber } from '../validators/validator';

export default class TypeOfOrganisationController {
  private readonly form: Form;
  private readonly typeOfOrgContent: FormContent = {
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
              typeOfOrgIndividualDetail: {
                id: 'typeOfOrgIndividualDetail',
                name: 'typeOfOrgIndividualDetail',
                type: 'text',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.individualTextLabel,
                classes: 'govuk-text',
                attributes: { maxLength: 20 },
              },
            },
          },
          {
            name: 'typeOfOrg',
            label: (l: AnyRecord): string => l.limitedCompany,
            value: TypeOfOrganisation.LIMITED_COMPANY,
            subFields: {
              typeOfOrgCRNDetail: {
                id: 'typeOfOrgCRNDetail',
                name: 'typeOfOrgCRNDetail',
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
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.typeOfOrgContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const errors = this.form.getValidatorErrors(formData);
    if (errors.length !== 0) {
      req.session.errors = errors;
      return res.redirect(req.url);
    }

    return res.redirect(PageUrls.RESPONDENT_ADDRESS);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.TYPE_OF_ORGANISATION);
    const typeOfOrgContent = this.typeOfOrgContent;

    res.render(TranslationKeys.TYPE_OF_ORGANISATION, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.TYPE_OF_ORGANISATION as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      hideContactUs: true,
      languageParam: getLanguageParam(req.url),
      form: typeOfOrgContent,
      userCase: req.session?.userCase,
      sessionErrors: req.session.errors,
    });
  };
}
