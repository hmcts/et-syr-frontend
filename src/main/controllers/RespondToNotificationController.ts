import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { assignFormData, getPageContent } from '../helpers/FormHelper';
import { findSelectedSendNotification } from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { isClaimantSystemUser } from '../helpers/controller/ContactTribunalHelper';
import { getNotificationContent } from '../helpers/controller/NotificationDetailsControllerHelper';
import { getLogger } from '../logger';
import UrlUtils from '../utils/UrlUtils';
import { isFieldFilledIn, isOptionSelected } from '../validators/validator';

const logger = getLogger('RespondToNotificationController');

export default class RespondToNotificationController {
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
    const { userCase } = req.session;
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION_COPY_TO_ORDER_PARTY + getLanguageParam(req.url));
  };

  public get = (req: AppRequest, res: Response): void => {
    if (!isClaimantSystemUser(req.session.userCase)) {
      return res.redirect(PageUrls.HOLDING_PAGE + getLanguageParam(req.url));
    }

    const { userCase } = req.session;
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );

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
