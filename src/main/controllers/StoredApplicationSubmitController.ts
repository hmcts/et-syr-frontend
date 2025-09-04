import { Response } from 'express';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { GenericTseApplicationTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, TseErrors } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLinkFromDocument } from '../helpers/DocumentHelpers';
import { getApplicationDisplay } from '../helpers/GenericTseApplicationHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';
import { getAppDetailsLink, getSelectedStoredApplication } from '../helpers/StoredApplicationHelper';
import { getApplicationContent } from '../helpers/controller/ApplicationDetailsHelper';
import { clearTempFields } from '../helpers/controller/ContactTribunalSubmitHelper';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';
import UrlUtils from '../utils/UrlUtils';
import { atLeastOneFieldIsChecked } from '../validators/validator';

const logger = getLogger('StoredApplicationSubmitController');

export default class StoredApplicationSubmitController {
  private readonly form: Form;

  private readonly formContent: FormContent = {
    fields: {
      confirmCopied: {
        id: 'confirmCopied',
        label: (l: AnyRecord): string => l.haveYouCopied,
        labelHidden: false,
        labelSize: 'm',
        type: 'checkboxes',
        hint: (l: AnyRecord): string => l.iConfirmThatIHaveCopied,
        validator: atLeastOneFieldIsChecked,
        values: [
          {
            name: 'confirmCopied',
            label: (l: AnyRecord): string => l.yesIConfirm,
            value: YesOrNo.YES,
          },
        ],
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submitBtn,
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;
    const languageParam = getLanguageParam(req.url);

    // get selected application
    const selectedApplication: GenericTseApplicationTypeItem = getSelectedStoredApplication(req);
    if (!selectedApplication) {
      logger.error(TseErrors.ERROR_APPLICATION_NOT_FOUND + req.params?.appId);
      return res.redirect(ErrorPages.NOT_FOUND + languageParam);
    }
    userCase.selectedGenericTseApplication = selectedApplication;

    // validate form
    const formData = this.form.getParsedBody<CaseWithId>(req.body, this.form.getFormFields());
    req.session.errors = this.form.getValidatorErrors(formData);
    if (req.session.errors.length > 0) {
      return res.redirect(PageUrls.STORED_APPLICATION_SUBMIT.replace(':appId', selectedApplication.id) + languageParam);
    }

    // submit stored application
    try {
      await getCaseApi(req.session.user?.accessToken).submitStoredRespondentTse(req);
      clearTempFields(userCase);
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
    res.render(TranslationKeys.STORED_APPLICATION_SUBMIT, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_SUBMIT, { returnObjects: true }),
      applicationType: getApplicationDisplay(selectedApplication.value, {
        ...req.t(TranslationKeys.APPLICATION_TYPE, { returnObjects: true }),
      }),
      appContent: getApplicationContent(selectedApplication.value, req),
      viewCorrespondenceLink: getAppDetailsLink(req.params.appId, getLanguageParam(req.url)),
      document: selectedApplication.value?.documentUpload,
      viewCorrespondenceFileLink: getLinkFromDocument(selectedApplication.value.documentUpload),
      cancelLink: UrlUtils.getCaseDetailsUrlByRequest(req),
    });
  };
}
