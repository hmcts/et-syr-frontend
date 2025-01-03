import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { SummaryListRow } from '../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import { findSelectedGenericTseApplication } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getApplicationContent } from '../helpers/controller/ApplicationDetailsHelper';
import { getFormDataError } from '../helpers/controller/RespondToApplicationHelper';
import UrlUtils from '../utils/UrlUtils';

export default class RespondToApplicationController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      responseText: {
        type: 'charactercount',
        label: (l: AnyRecord): string => l.responseText.label,
        hint: (l: AnyRecord): string => l.responseText.hint,
        maxlength: 2500,
      },
      hasSupportingMaterial: {
        type: 'radios',
        label: (l: AnyRecord): string => l.hasSupportingMaterial.label,
        hint: (l: AnyRecord): string => l.hasSupportingMaterial.hint,
        values: [
          {
            label: (l: AnyRecord): string => l.supportingMaterialYesNo.yes,
            name: 'radioYes',
            value: YesOrNo.YES,
          },
          {
            label: (l: AnyRecord): string => l.supportingMaterialYesNo.no,
            name: 'radioNo',
            value: YesOrNo.NO,
          },
        ],
      },
    },
    submit: {
      text: l => l.continue,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const errors = getFormDataError(formData);
    if (errors) {
      req.session.errors.push(...errors);
      return res.redirect(
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url)
      );
    }

    req.session.userCase.responseText = formData.responseText;
    req.session.userCase.hasSupportingMaterial = formData.hasSupportingMaterial;

    const redirectUrl =
      formData.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL.replace(':appId', selectedApplication.id)
        : PageUrls.COPY_TO_OTHER_PARTY;
    return res.redirect(redirectUrl + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const appContent: SummaryListRow[] = getApplicationContent(selectedApplication, req);
    if (!appContent) {
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_APPLICATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_APPLICATION, {
      ...content,
      hideContactUs: true,
      appContent,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
