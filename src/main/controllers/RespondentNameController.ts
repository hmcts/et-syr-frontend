import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, RespondentET3Model, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { ET3HubLinkNames, LinkStatus } from '../definitions/links';
import { saveForLaterButton, saveAndContinueButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { setUserCase } from '../helpers/CaseHelpers';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { returnValidUrl } from '../helpers/RouterHelpers';
import CollectionUtils from '../utils/CollectionUtils';
import ET3Util from '../utils/ET3Util';
import RespondentUtils from '../utils/RespondentUtils';
import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      responseRespondentNameQuestion: {
        classes: 'govuk-radios',
        id: 'responseRespondentNameQuestion',
        type: 'radios',
        label: (l: AnyRecord): string => l.label1,
        labelHidden: false,
        values: [
          {
            name: 'responseRespondentNameQuestion',
            label: (l: AnyRecord): string => l.yes,
            value: YesOrNo.YES,
          },
          {
            name: 'responseRespondentNameQuestion',
            label: (l: AnyRecord): string => l.no,
            value: YesOrNo.NO,
            subFields: {
              responseRespondentName: {
                id: 'responseRespondentName',
                name: 'responseRespondentName',
                type: 'text',
                labelSize: 'normal',
                label: (l: AnyRecord): string => l.respondentNameTextLabel,
                classes: 'govuk-text',
                attributes: { maxLength: 60 },
                validator: isContentCharsOrLessAndNotEmpty(60),
              },
            },
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: saveAndContinueButton,
    saveForLater: saveForLaterButton,
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData: Partial<CaseWithId> = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    setUserCase(req, formData, []);
    if (YesOrNo.NO !== formData.responseRespondentNameQuestion) {
      const selectedRespondent: RespondentET3Model = RespondentUtils.findSelectedRespondentByRequest(req);
      const existingRespondentName: string = ET3Util.getUserNameByRespondent(selectedRespondent);
      req.session.userCase.responseRespondentName = existingRespondentName;
      selectedRespondent.responseRespondentName = existingRespondentName;
    }
    // This field is mandatory. While updating respondent name in the backend also assigns the respondent email.
    ET3Util.setResponseRespondentEmail(req.session.user, req);
    let nextPage: string = PageUrls.TYPE_OF_ORGANISATION;
    req.session.userCase = await ET3Util.updateET3Data(req, ET3HubLinkNames.ContactDetails, LinkStatus.IN_PROGRESS);
    if (CollectionUtils.isNotEmpty(req?.session?.errors)) {
      nextPage = PageUrls.RESPONDENT_NAME;
    }
    res.redirect(returnValidUrl(nextPage));
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    const userCase = req.session.userCase;
    const content = getPageContent(req, this.respondentNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_NAME,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);

    const respondentNameQuestion = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    respondentNameQuestion.label = (l: AnyRecord): string => l.label1 + userCase.respondentName + l.label2;

    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
