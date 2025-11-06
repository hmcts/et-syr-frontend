import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { ConfirmCopiedFormFields } from '../definitions/form/stored-confirm-copied';
import { ET3CaseDetailsLinkNames, LinkStatus } from '../definitions/links';
import { AnyRecord } from '../definitions/util-types';
import { getAppDetailsLink } from '../helpers/ApplicationHelper';
import { getPageContent } from '../helpers/FormHelper';
import { getApplicationDisplay } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  getLinkFromDocument,
  getSelectedStoredApplication,
  mapStoredRespondentTse,
} from '../helpers/StoredApplicationHelper';
import { getApplicationContent } from '../helpers/controller/ApplicationDetailsHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import ET3Util from '../utils/ET3Util';
import UrlUtils from '../utils/UrlUtils';

const logger = getLogger('ContactTribunalSubmitStoredController');

export default class ContactTribunalSubmitStoredController {
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
    const languageParam = getLanguageParam(req.url);

    // get selected application
    const selectedApplication: GenericTseApplicationTypeItem = getSelectedStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // validate form
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', selectedApplication.id) + languageParam);
    }

    // submit stored application
    try {
      const respondentTse = mapStoredRespondentTse(req.session.user, selectedApplication);
      await getCaseApi(req.session.user?.accessToken).submitStoredRespondentTse(req, respondentTse);
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // update et3CaseDetailsLinksStatuses
    try {
      req.session.userCase = await ET3Util.updateCaseDetailsLinkStatuses(
        req,
        ET3CaseDetailsLinkNames.YourRequestsAndApplications,
        LinkStatus.IN_PROGRESS
      );
    } catch (error) {
      logger.error(error.message);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // redirect to confirmation page
    return res.redirect(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + languageParam);
  };

  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const languageParam = getLanguageParam(req.url);

    // get selected application
    const selectedApplication: GenericTseApplicationTypeItem = getSelectedStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }

    // render page
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.STORED_APPLICATION_SUBMIT,
    ]);
    res.render(TranslationKeys.STORED_APPLICATION_SUBMIT, {
      ...content,
      title: getApplicationDisplay(selectedApplication.value, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication.value, req),
      viewCorrespondenceLink: getAppDetailsLink(selectedApplication.id, getLanguageParam(req.url)),
      document: selectedApplication.value?.documentUpload,
      viewCorrespondenceFileLink: getLinkFromDocument(selectedApplication.value.documentUpload),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
