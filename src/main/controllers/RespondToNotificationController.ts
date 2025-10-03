import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, FormFieldNames, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { findSelectedSendNotification } from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getNotificationContent } from '../helpers/controller/NotificationDetailsControllerHelper';
import { handleFileUpload } from '../helpers/controller/RespondToApplicationSupportingMaterialHelper';
import { getFormError } from '../helpers/controller/RespondToNotificationControllerHelper';
import { getLogger } from '../logger';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondToNotificationController');

export default class RespondToNotificationController {
  private readonly form: Form;
  private uploadedFileName = '';

  private getHint = (label: AnyRecord): string => {
    return StringUtils.isNotBlank(this.uploadedFileName)
      ? (label.supportingMaterialFile.hintExisting as string).replace('{{filename}}', this.uploadedFileName)
      : label.supportingMaterialFile.hint;
  };

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
            subFields: {
              supportingMaterialFile: {
                id: 'supportingMaterialFile',
                labelHidden: true,
                type: 'upload',
                classes: 'govuk-label',
                label: (l: AnyRecord): string => l.supportingMaterialFile.label,
                hint: (l: AnyRecord): string => this.getHint(l),
              },
              upload: {
                label: (l: AnyRecord): string => l.files.uploadButton,
                classes: 'govuk-button--secondary',
                id: 'upload',
                type: 'button',
                name: 'upload',
                value: 'true',
                divider: false,
              },
            },
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

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.url) {
      logger.warn('Potential bot activity detected from IP: ' + req.ip);
      res.status(200).end('Thank you for your submission. You will be contacted in due course.');
      return;
    }

    const { userCase } = req.session;
    const languageParam = getLanguageParam(req.url);

    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    if (req.body?.upload) {
      const fileErrorRedirect = handleFileUpload(req, FormFieldNames.RESPOND_TO_NOTIFICATION.SUPPORTING_MATERIAL_FILE);
      if (await fileErrorRedirect) {
        return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', req.params.itemId) + languageParam);
      }
    }

    req.session.errors = [];
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    const formError = getFormError(req, formData);
    if (formError) {
      req.session.errors.push(formError);
      return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', req.params.itemId) + languageParam);
    }

    userCase.selectedRequestOrOrder = selectedNotification;
    userCase.responseText = formData.responseText;
    userCase.hasSupportingMaterial = formData.hasSupportingMaterial;

    return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION_COPY_TO_ORDER_PARTY + languageParam);
  };

  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    assignFormData(req.session.userCase, this.form.getFormFields());
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_NOTIFICATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_NOTIFICATION, {
      ...content,
      hideContactUs: true,
      notificationContent: getNotificationContent(selectedNotification.value, req),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
