import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getApplicationTypeByCode } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isClaimantSystemUser } from '../helpers/controller/ContactTribunalHelper';
import UrlUtils from '../utils/UrlUtils';
import { isContentCharsOrLessAndNotEmpty, isOptionSelected } from '../validators/validator';

export default class CopyToOtherPartyController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      copyToOtherPartyYesOrNo: {
        type: 'radios',
        label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.label,
        values: [
          {
            label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.yes,
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.copyToOtherPartyYesOrNo.no,
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
    submit: {
      text: (l: AnyRecord): string => l.continue,
      classes: 'govuk-!-margin-right-2',
    },
  } as never;

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    // TODO: Get values from inputs and Save them
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY + getLanguageParam(req.url));
    }

    req.session.userCase.copyToOtherPartyYesOrNo = formData.copyToOtherPartyYesOrNo;
    req.session.userCase.copyToOtherPartyText = formData.copyToOtherPartyText;
    res.redirect(PageUrls.CONTACT_TRIBUNAL_CYA + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const fileName = isClaimantSystemUser(req.session.userCase)
      ? TranslationKeys.COPY_TO_OTHER_PARTY
      : TranslationKeys.COPY_TO_OTHER_PARTY_OFFLINE;
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      fileName,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(fileName, {
      ...content,
      hideContactUs: true,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
      applicationType: getApplicationTypeByCode(req.session.userCase?.contactApplicationType, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
    });
  };
}
