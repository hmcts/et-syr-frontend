import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { TypeOfOrganisation } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import ET3Util from '../utils/ET3Util';
import { isOptionSelected, isValidCompanyRegistrationNumber } from '../validators/validator';

export default class TypeOfOrganisationController {
  private readonly form: Form;
  private readonly typeOfOrgContent: FormContent = {
    fields: {
      et3ResponseRespondentEmployerType: {
        classes: 'govuk-radios',
        id: 'et3ResponseRespondentEmployerType',
        type: 'radios',
        labelHidden: false,
        values: [
          {
            name: 'et3ResponseRespondentEmployerType',
            label: (l: AnyRecord): string => l.individual,
            value: TypeOfOrganisation.INDIVIDUAL,
            subFields: {
              et3ResponseRespondentPreferredTitle: {
                id: 'et3ResponseRespondentPreferredTitle',
                name: 'et3ResponseRespondentPreferredTitle',
                type: 'text',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.individualTextLabel,
                classes: 'govuk-text',
                attributes: { maxLength: 20 },
              },
            },
          },
          {
            name: 'et3ResponseRespondentEmployerType',
            label: (l: AnyRecord): string => l.limitedCompany,
            value: TypeOfOrganisation.LIMITED_COMPANY,
            subFields: {
              et3ResponseRespondentCompanyNumber: {
                id: 'et3ResponseRespondentCompanyNumber',
                name: 'et3ResponseRespondentCompanyNumber',
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
            name: 'et3ResponseRespondentEmployerType',
            label: (l: AnyRecord): string => l.partnership,
            value: TypeOfOrganisation.PARTNERSHIP,
          },
          {
            name: 'et3ResponseRespondentEmployerType',
            label: (l: AnyRecord): string => l.unincorporatedAssociation,
            value: TypeOfOrganisation.UNINCORPORATED_ASSOCIATION,
          },
          {
            name: 'et3ResponseRespondentEmployerType',
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
    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_ADDRESS
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.TYPE_OF_ORGANISATION);

    const content = getPageContent(req, this.typeOfOrgContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TYPE_OF_ORGANISATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TYPE_OF_ORGANISATION, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
