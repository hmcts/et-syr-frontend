import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { setUrlLanguage } from '../helpers/LanguageHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class SelfAssignmentDetailsController {
  private readonly detailsContent: FormContent = {
    fields: {
      respondentName: {
        id: 'respondentName',
        name: 'respondentName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.respondentName,
      },
      claimantFirstName: {
        id: 'claimantFirstName',
        name: 'claimantFirstName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.claimantFirstName,
      },
      claimantLastName: {
        id: 'claimantLastName',
        name: 'claimantLastName',
        type: 'text',
        classes: 'govuk-!-width-one-half',
        label: (l: AnyRecord): string => l.claimantLastName,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.continue,
    },
  } as never;

  constructor() {}

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.session.errors = [];
    if (req.body.respondentName !== req.session.userCase.respondents[0].respondentName) {
      req.session.errors = [
        {
          errorType: 'invalid',
          propertyName: 'respondentName',
        },
      ];
      return res.redirect(req.url);
    }
    if (req.body.claimantFirstName !== req.session.userCase.firstName) {
      req.session.errors = [
        {
          errorType: 'invalid',
          propertyName: 'claimantFirstName',
        },
      ];
      return res.redirect(req.url);
    }
    if (req.body.claimantLastName !== req.session.userCase.lastName) {
      req.session.errors = [
        {
          errorType: 'invalid',
          propertyName: 'claimantLastName',
        },
      ];
      return res.redirect(req.url);
    }
    return res.redirect(PageUrls.RESPONDENT_REPLIES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.SELF_ASSIGNMENT_DETAILS);
    const detailsContent = this.detailsContent;
    res.render(TranslationKeys.SELF_ASSIGNMENT_DETAILS, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SELF_ASSIGNMENT_DETAILS as never, { returnObjects: true } as never),
      PageUrls,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      form: detailsContent,
      sessionErrors: req.session.errors,
    });
  };
}
