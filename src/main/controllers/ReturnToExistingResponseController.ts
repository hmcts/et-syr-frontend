import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { ReturnToExistingOption } from '../definitions/case';
import { FormFieldNames, LegacyUrls, PageUrls, TranslationKeys, ValidationErrors } from '../definitions/constants';
import { FormContent, FormError, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { getLanguageParam, returnValidUrl } from '../helpers/RouterHelpers';
import StringUtils from '../utils/StringUtils';

export default class ReturnToExistingResponseController {
  private readonly form: Form;
  private readonly returnToExistingContent: FormContent = {
    fields: {
      returnToExisting: {
        id: 'return_to_existing',
        type: 'radios',
        label: (l: AnyRecord): string => l.mainQuestion.question,
        values: [
          {
            label: (l: AnyRecord): string => l.mainQuestion.option1,
            value: ReturnToExistingOption.DRAFT_RESPONSE,
            subFields: {
              draftOption: {
                id: 'draft_claim_option',
                type: 'radios',
                label: (l: AnyRecord): string => l.draftOption.question,
                labelSize: 's',
                values: [
                  {
                    label: (l: AnyRecord): string => l.draftOption.option1,
                    value: ReturnToExistingOption.HAVE_ACCOUNT,
                  },
                  {
                    label: (l: AnyRecord): string => l.draftOption.option2,
                    value: ReturnToExistingOption.HAVE_RETURN_NUMBER,
                  },
                ],
              },
            },
          },
          {
            label: (l: AnyRecord): string => l.mainQuestion.option2,
            value: ReturnToExistingOption.SUBMITTED_RESPONSE,
            subFields: {
              submittedOption: {
                id: 'submitted_claim_option',
                type: 'radios',
                label: (l: AnyRecord): string => l.submittedOption.question,
                labelSize: 's',
                values: [
                  {
                    label: (l: AnyRecord): string => l.submittedOption.option1,
                    value: ReturnToExistingOption.HAVE_ACCOUNT,
                  },
                  {
                    label: (l: AnyRecord): string => l.submittedOption.option2,
                    hint: (l: AnyRecord): string => l.submittedOption.supportingText,
                    value: ReturnToExistingOption.NO_ACCOUNT,
                  },
                ],
              },
            },
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.returnToExistingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    req.session.errors = [];
    const error = getFormDataError(req);
    if (error) {
      req.session.errors.push(error);
      return res.redirect(PageUrls.RETURN_TO_EXISTING_RESPONSE + getLanguageParam(req.url));
    }

    const redirectUrl = getRedirectUrl(req);
    res.redirect(returnValidUrl(redirectUrl));
  };

  public get = (req: AppRequest, res: Response): void => {
    req.session.guid = undefined;
    const content = getPageContent(req, this.returnToExistingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RETURN_TO_EXISTING_RESPONSE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.RETURN_TO_EXISTING_RESPONSE, {
      ...content,
      respondNewClaimUrl: PageUrls.CASE_NUMBER_CHECK + getLanguageParam(req.url),
    });
  };
}

const getFormDataError = (req: AppRequest): FormError => {
  const { returnToExisting, draftOption, submittedOption } = req.body;

  const isMissingSelection = StringUtils.isBlank(returnToExisting);
  const isMissingDraftOption =
    returnToExisting === ReturnToExistingOption.DRAFT_RESPONSE && StringUtils.isBlank(draftOption);
  const isMissingSubmittedOption =
    returnToExisting === ReturnToExistingOption.SUBMITTED_RESPONSE && StringUtils.isBlank(submittedOption);

  if (isMissingSelection || isMissingDraftOption || isMissingSubmittedOption) {
    return {
      propertyName: FormFieldNames.RETURN_TO_EXISTING.RETURN_TO_EXISTING_RADIOBUTTON,
      errorType: ValidationErrors.REQUIRED,
    };
  }
};

const getRedirectUrl = (req: AppRequest): string => {
  const { returnToExisting, draftOption, submittedOption } = req.body;

  if (returnToExisting === ReturnToExistingOption.DRAFT_RESPONSE) {
    if (draftOption === ReturnToExistingOption.HAVE_ACCOUNT) {
      return PageUrls.CASE_LIST + getLanguageParam(req.url);
    }
    if (draftOption === ReturnToExistingOption.HAVE_RETURN_NUMBER) {
      return LegacyUrls.SIGN_IN;
    }
  } else if (returnToExisting === ReturnToExistingOption.SUBMITTED_RESPONSE) {
    if (submittedOption === ReturnToExistingOption.HAVE_ACCOUNT) {
      return PageUrls.CASE_LIST + getLanguageParam(req.url);
    }
    if (submittedOption === ReturnToExistingOption.NO_ACCOUNT) {
      return PageUrls.CASE_NUMBER_CHECK + getLanguageParam(req.url);
    }
  }
  return PageUrls.RETURN_TO_EXISTING_RESPONSE + getLanguageParam(req.url);
};
