import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import {
  findSelectedGenericTseApplication,
  isResponseToTribunalRequired,
} from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getAllResponses,
  getApplicationContent,
  getDecisionContent,
  isNeverResponseBefore,
} from '../helpers/controller/ApplicationDetailsHelper';
import { getFormDataError } from '../helpers/controller/RespondToApplicationHelper';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondToApplicationController');

export default class RespondToApplicationController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      responseText: {
        type: 'charactercount',
        label: (l: AnyRecord): string => l.responseText.label,
        hint: (l: AnyRecord): string => l.responseText.hint,
        maxlength: 2500,
        validator: isFieldFilledIn,
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
        validator: isOptionSelected,
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
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
    }

    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = [];
    const error = getFormDataError(formData);
    if (error) {
      req.session.errors.push(error);
      return res.redirect(
        PageUrls.RESPOND_TO_APPLICATION.replace(':appId', selectedApplication.id) + getLanguageParam(req.url)
      );
    }

    const userCase = req.session.userCase;
    userCase.selectedGenericTseApplication = selectedApplication;
    userCase.isRespondingToRequestOrOrder = isResponseToTribunalRequired(selectedApplication.value, req.session.user);
    userCase.responseText = formData.responseText;
    userCase.hasSupportingMaterial = formData.hasSupportingMaterial;

    const redirectUrl =
      formData.hasSupportingMaterial === YesOrNo.YES
        ? PageUrls.RESPOND_TO_APPLICATION_SUPPORTING_MATERIAL
        : PageUrls.RESPOND_TO_APPLICATION_COPY_TO_ORDER_PARTY;
    return res.redirect(redirectUrl + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    const selectedApplication: GenericTseApplicationTypeItem = findSelectedGenericTseApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (
      !isNeverResponseBefore(selectedApplication.value, req.session.user) &&
      !isResponseToTribunalRequired(selectedApplication.value, req.session.user)
    ) {
      logger.error(TseErrors.ERROR_NO_RESPOND_REQUIRED + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    assignFormData(req.session.userCase, this.form.getFormFields());
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_APPLICATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_APPLICATION, {
      ...content,
      hideContactUs: true,
      appContent: getApplicationContent(selectedApplication.value, req),
      allResponses: getAllResponses(selectedApplication.value, req),
      decisionContent: getDecisionContent(selectedApplication.value, req),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
