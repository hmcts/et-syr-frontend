import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { PseResponseType, SendNotificationTypeItem } from '../definitions/complexTypes/sendNotificationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ConfirmCopiedFormFields } from '../definitions/form/stored-confirm-copied';
import { AnyRecord, TypeItem } from '../definitions/util-types';
import { getPageContent } from '../helpers/FormHelper';
import {
  findSelectedPseResponse,
  findSelectedSendNotification,
  getNotificationDetailsUrl,
} from '../helpers/NotificationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getSinglePseResponseDisplay } from '../helpers/controller/NotificationDetailsControllerHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('RespondToNotificationStoredSubmitController');

export default class RespondToNotificationStoredSubmitController {
  private readonly form: Form;

  private readonly formContent: FormContent = {
    fields: {
      confirmCopied: ConfirmCopiedFormFields,
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase, user } = req.session;
    const languageParam = getLanguageParam(req.url);

    // get selected notification
    const selectedNotification: SendNotificationTypeItem = findSelectedSendNotification(
      userCase.sendNotificationCollection,
      req.params.itemId
    );
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // get selected notification response
    const selectedResponse: TypeItem<PseResponseType> = findSelectedPseResponse(
      selectedNotification.value.respondentRespondStoredCollection,
      req.params.responseId
    );
    if (!selectedResponse) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.responseId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // validate form
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(
        PageUrls.RESPOND_TO_NOTIFICATION_TO_SUBMIT.replace(':itemId', selectedNotification.id).replace(
          ':responseId',
          selectedResponse.id
        ) + languageParam
      );
    }

    // submit stored response
    try {
      await getCaseApi(user.accessToken).submitStoredResponseToNotification(
        userCase,
        user,
        selectedNotification,
        selectedResponse
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // redirect to confirmation page
    return res.redirect(PageUrls.RESPOND_TO_NOTIFICATION_COMPLETE + languageParam);
  };

  public get = (req: AppRequest, res: Response): void => {
    const { userCase } = req.session;
    const languageParam = getLanguageParam(req.url);

    // get selected notification
    const selectedNotification = findSelectedSendNotification(userCase.sendNotificationCollection, req.params.itemId);
    if (!selectedNotification) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.itemId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // get selected notification response
    const selectedResponse = findSelectedPseResponse(
      selectedNotification.value.respondentRespondStoredCollection,
      req.params.responseId
    );
    if (!selectedResponse) {
      logger.error(TseErrors.ERROR_NOTIFICATION_NOT_FOUND + req.params.responseId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // render page
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_APPLICATION_SUBMIT,
    ]);
    res.render(TranslationKeys.STORED_APPLICATION_SUBMIT, {
      ...content,
      appContent: getSinglePseResponseDisplay(selectedNotification.value, req),
      viewCorrespondenceLink: getNotificationDetailsUrl(selectedNotification) + languageParam,
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
