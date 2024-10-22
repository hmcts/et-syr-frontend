import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, TypeOfOrganisation } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { isClearSelection } from '../helpers/RouterHelpers';
import ET3Util from '../utils/ET3Util';
import { isValidCompanyRegistrationNumber } from '../validators/validator';

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
      },
      clearSelection: {
        type: 'clearSelection',
        targetUrl: PageUrls.TYPE_OF_ORGANISATION,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.typeOfOrgContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const fieldsToReset: string[] = [];

    if (TypeOfOrganisation.INDIVIDUAL !== formData.et3ResponseRespondentEmployerType) {
      fieldsToReset.push('et3ResponseRespondentPreferredTitle');
    }
    if (TypeOfOrganisation.LIMITED_COMPANY !== formData.et3ResponseRespondentEmployerType) {
      fieldsToReset.push('et3ResponseRespondentCompanyNumber');
    }

    await ET3Util.updateET3ResponseWithET3Form(
      req,
      res,
      this.form,
      ET3HubLinkNames.ContactDetails,
      LinkStatus.IN_PROGRESS,
      PageUrls.RESPONDENT_ADDRESS,
      fieldsToReset
    );
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.TYPE_OF_ORGANISATION);

    if (isClearSelection(req)) {
      req.session.userCase.et3ResponseRespondentEmployerType = undefined;
    }

    const content = getPageContent(req, this.typeOfOrgContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TYPE_OF_ORGANISATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.TYPE_OF_ORGANISATION, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
