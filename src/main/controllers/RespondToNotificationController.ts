import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { uploadButton } from '../definitions/buttons';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, FormFieldNames, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { findSelectedSendNotification } from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getNotificationContent,
  getNotificationResponses,
  getNotificationStatusAfterViewed,
} from '../helpers/controller/NotificationDetailsControllerHelper';
import { handleFileUpload } from '../helpers/controller/RespondToApplicationSupportingMaterialHelper';
import {
  getFormError,
  getRespondNotificationCopyPage,
} from '../helpers/controller/RespondToNotificationControllerHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import StringUtils from '../utils/StringUtils';
import UrlUtils from '../utils/UrlUtils';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondToNotificationController');

export default class RespondToNotificationController {
  private readonly form: Form;
  private uploadedFileName = '';

  private getHint = (label: AnyRecord): string => {
    const intro =
      '<p class="govuk-body">' +
      label.supportingMaterialFile.hint +
      '</p>' +
      '<ul class="govuk-list govuk-list--bullet">' +
      '<li>' +
      label.supportingMaterialFile.li1 +
      '</li>' +
      '<li>' +
      label.supportingMaterialFile.li2 +
      '</li>' +
      '<li>' +
      label.supportingMaterialFile.li3 +
      '</li>' +
      '</ul>';
    return StringUtils.isNotBlank(this.uploadedFileName)
      ? intro +
          '<p class="govuk-body">' +
          (label.supportingMaterialFile.hintExisting as string).replace('{{filename}}', this.uploadedFileName) +
          '</p>'
      : intro;
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
                type: 'upload',
                id: 'supportingMaterialFile',
                classes: 'govuk-label',
                labelHidden: true,
                label: (l: AnyRecord): string => l.supportingMaterialFile.label,
                hint: (l: AnyRecord): string => this.getHint(l),
              },
              upload: uploadButton,
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

    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    userCase.selectedNotification = selectedNotification;
    userCase.responseText = formData.responseText;
    userCase.hasSupportingMaterial = formData.hasSupportingMaterial;

    const thisPage = PageUrls.RESPOND_TO_NOTIFICATION.replace(':itemId', req.params.itemId) + languageParam;
    if (req.body?.upload) {
      const fileErrorRedirect = handleFileUpload(req, FormFieldNames.RESPOND_TO_NOTIFICATION.SUPPORTING_MATERIAL_FILE);
      if (await fileErrorRedirect) {
        return res.redirect(thisPage);
      }
    }

    req.session.errors = [];
    const formError = getFormError(req, formData);
    if (formError) {
      req.session.errors.push(formError);
      return res.redirect(thisPage);
    }

    if (req.body?.upload) {
      return res.redirect(thisPage);
    }

    return res.redirect(getRespondNotificationCopyPage(userCase) + languageParam);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase, user } = req.session;

    // Find the selected notification
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    // Update the notification status as viewed
    const newStatus: LinkStatus = getNotificationStatusAfterViewed(selectedNotification.value, user);
    if (newStatus) {
      try {
        await getCaseApi(user?.accessToken).changeNotificationStatus(userCase, user, selectedNotification, newStatus);
      } catch (error) {
        logger.error(TseErrors.ERROR_UPDATE_LINK_STATUS);
        res.redirect(ErrorPages.NOT_FOUND + getLanguageParam(req.url));
      }
    }

    assignFormData(userCase, this.form.getFormFields());
    this.uploadedFileName = userCase.supportingMaterialFile?.document_filename;

    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.RESPOND_TO_NOTIFICATION,
      TranslationKeys.SIDEBAR_CONTACT_US,
    ]);
    res.render(TranslationKeys.RESPOND_TO_NOTIFICATION, {
      ...content,
      hideContactUs: true,
      notificationContent: getNotificationContent(selectedNotification.value, req),
      notificationResponses: getNotificationResponses(selectedNotification.value, req),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
