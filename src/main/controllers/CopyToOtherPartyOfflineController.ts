import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { continueButton } from '../definitions/buttons';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getApplicationDisplayByCode } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import UrlUtils from '../utils/UrlUtils';
import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

export default class CopyToOtherPartyOfflineController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: {
        type: 'radios',
        label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.label,
        values: [
          {
            label: (l: AnyRecord): string =>
              '<p class="govuk-body">' +
              l.copyToOtherPartyYesOrNo.yes1 +
              '</p><p class="govuk-body"><strong>' +
              l.copyToOtherPartyYesOrNo.important +
              ':</strong> ' +
              l.copyToOtherPartyYesOrNo.yes2 +
              '</p><p class="govuk-body">' +
              l.copyToOtherPartyYesOrNo.yes3 +
              '</p>',
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string =>
              '<p class="govuk-body">' +
              l.noIDoNotWantTo +
              '</p><p class="govuk-body"><strong>' +
              l.important +
              ':</strong> ' +
              l.youMustTellTheTribunal +
              '</p>',
            value: YesOrNo.NO,
            subFields: {
              copyToOtherPartyText: {
                type: 'charactercount',
                label: (l: AnyRecord): string => l.copyToOtherPartyText.label,
                labelSize: 's',
                maxlength: 2500,
                validator: isContentCharsOrLessAndNotEmpty(2500),
              },
            },
          },
        ],
        validator: isOptionSelected,
      },
    },
    submit: continueButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY_OFFLINE + getLanguageParam(req.url));
    }

    req.session.userCase.copyToOtherPartyYesOrNo = formData.copyToOtherPartyYesOrNo;
    req.session.userCase.copyToOtherPartyText = formData.copyToOtherPartyText;
    res.redirect(PageUrls.CONTACT_TRIBUNAL_CYA + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      caption: getApplicationDisplayByCode(req.session.userCase?.contactApplicationType, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
    });
  };
}
