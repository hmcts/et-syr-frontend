import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { Respondent, YesOrNo } from '../definitions/case';
import { ET3ModificationConstants, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, FormInput } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { postLogic } from '../helpers/CaseHelpers';
import { getPageContent } from '../helpers/FormHelper';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondentNameController');

export default class RespondentNameController {
  private readonly form: Form;
  private readonly respondentNameContent: FormContent = {
    fields: {
      respondentName: {
        classes: 'govuk-radios',
        id: 'respondentName',
        type: 'radios',
        label: (l: AnyRecord): string => l.label1,
        labelHidden: false,
        values: [
          {
            name: 'respondentName',
            label: (l: AnyRecord): string => l.yes,
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
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.respondentNameContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    let selectedRespondent: Respondent;
    if (req.session.userCase.respondents) {
      for (const respondent of req.session.userCase.respondents) {
        if (respondent.idamId === req.session?.user?.id) {
          selectedRespondent = respondent;
          break;
        }
      }
    }
    selectedRespondent.responseRespondentNameQuestion = formData.respondentName === 'Yes' ? YesOrNo.YES : YesOrNo.NO;

    try {
      formatApiCaseDataToCaseWithId(
        (
          await getCaseApi(req.session.user?.accessToken)?.modifyEt3Data(
            req.session.userCase,
            req.session.user.id,
            ET3ModificationConstants.MODIFICATION_TYPE_UPDATE
          )
        )?.data
      );
    } catch (exception) {
      logger.info(exception);
    }
    await postLogic(req, res, this.form, logger, PageUrls.TYPE_OF_ORGANISATION);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = setUrlLanguage(req, PageUrls.RESPONDENT_NAME);
    const userCase = req.session.userCase;

    const respondentNameQuestion = Object.entries(this.form.getFormFields())[0][1] as FormInput;
    respondentNameQuestion.label = (l: AnyRecord): string =>
      l.label1 + userCase.respondents[0].respondentName + l.label2;

    const content = getPageContent(req, this.respondentNameContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_NAME,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPONDENT_NAME, {
      ...content,
      redirectUrl,
      hideContactUs: true,
    });
  };
}
