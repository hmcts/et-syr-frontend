import * as Console from 'node:console';

import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DefaultValues, PageUrls } from '../definitions/constants';
import { Logger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';

import { formatApiCaseDataToCaseWithId } from './ApiFormatter';
import { handleErrors, returnSessionErrors } from './ErrorHelpers';
import { trimFormData } from './FormHelper';
import { setUrlLanguage } from './LanguageHelper';
import { returnNextPage } from './RouterHelpers';

/**
 * Updates the draft case data for the current session.
 * Retrieves and updates the draft case using an API call and updates the session with the new case data.
 * If the update fails, it logs the error and sets an error message in the session.
 *
 * Used for invoking PCQ survey.
 *
 * @param {AppRequest} req
 * @param {Logger} logger
 * @return {Promise<void>}
 */
export const handleUpdateDraftCase = async (req: AppRequest, logger: Logger): Promise<void> => {
  if (!req.session.errors?.length) {
    try {
      const response = await getCaseApi(req.session.user?.accessToken).updateDraftCase(req.session.userCase);
      logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      const workEnterPostcode = req.session.userCase.workEnterPostcode;
      const addressEnterPostcode = req.session.userCase.addressEnterPostcode;
      const respondentEnterPostcode = req.session.userCase.respondentEnterPostcode;
      const addressAddresses = req.session.userCase.addressAddresses;
      const workAddresses = req.session.userCase.workAddresses;
      const respondentAddresses = req.session.userCase.respondentAddresses;
      const workAddressTypes = req.session.userCase.workAddressTypes;
      const respondentAddressTypes = req.session.userCase.respondentAddressTypes;
      const addressAddressTypes = req.session.userCase.addressAddressTypes;
      req.session.userCase = formatApiCaseDataToCaseWithId(response.data);
      if (req.session.userCase.workEnterPostcode === undefined) {
        req.session.userCase.workEnterPostcode = workEnterPostcode;
      }
      if (req.session.userCase.addressEnterPostcode === undefined) {
        req.session.userCase.addressEnterPostcode = addressEnterPostcode;
      }
      if (req.session.userCase.respondentEnterPostcode === undefined) {
        req.session.userCase.respondentEnterPostcode = respondentEnterPostcode;
      }
      req.session.userCase.addressAddresses = addressAddresses;
      req.session.userCase.workAddresses = workAddresses;
      req.session.userCase.respondentAddresses = respondentAddresses;
      req.session.userCase.workAddressTypes = workAddressTypes;
      req.session.userCase.respondentAddressTypes = respondentAddressTypes;
      req.session.userCase.addressAddressTypes = addressAddressTypes;
      req.session.userCase.updateDraftCaseError = undefined;
      req.session.save();
    } catch (error) {
      req.session.userCase.updateDraftCaseError = req.url?.includes('lng=cy')
        ? localesCy.updateDraftErrorMessage
        : locales.updateDraftErrorMessage;
      req.session.returnUrl = req.url;
      req.session.save();
      logger.error(error.message);
    }
  }
};

/**
 * Handles form submission logic. If the form is valid, it either saves the data (saveForLater)
 * or redirects to the next page.
 * If there are validation errors, they are handled and displayed to the user on their current page.
 *
 * @param {AppRequest} req
 * @param {Response} res
 * @param {Form} form
 * @param {LoggerInstance} logger
 * @param {string} redirectUrl
 * @return {Promise<void>}
 */
export const postLogic = async (
  req: AppRequest,
  res: Response,
  form: Form,
  logger: LoggerInstance,
  redirectUrl: string
): Promise<void> => {
  const errors = returnSessionErrors(req, form);
  const { saveForLater } = req.body;
  logger.info('test');
  if (errors.length === 0) {
    req.session.errors = [];
    if (saveForLater) {
      // TODO: Need to implement saveForLater screen
      redirectUrl = setUrlLanguage(req, PageUrls.NOT_IMPLEMENTED);
      return res.redirect(redirectUrl);
    } else {
      redirectUrl = setUrlLanguage(req, redirectUrl);
      returnNextPage(req, res, redirectUrl);
    }
  } else {
    handleErrors(req, res, errors);
  }
};

/**
 * Updates the status of hub links in the case.
 * Makes an API call to update the hub links statuses for the current case.
 * Logs a success message if the update is successful, and logs an error message otherwise.
 *
 * @param {AppRequest} req
 * @param {Logger} logger
 * @return {Promise<void>}
 */
export const handleUpdateHubLinksStatuses = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    logger.info(`Updated hub links statuses for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};

export const setUserCase = (req: AppRequest, formData: Partial<CaseWithId>, fieldsToReset: string[]): void => {
  if (!req.session.userCase) {
    req.session.userCase = {} as CaseWithId;
  }
  resetFields(formData, fieldsToReset);
  trimFormData(formData);
  Object.assign(req.session.userCase, formData);
};

export const resetFields = (formData: Partial<CaseWithId>, fieldsToReset: string[]): void => {
  if (CollectionUtils.isEmpty(fieldsToReset)) {
    return;
  }
  for (const propertyName of Object.getOwnPropertyNames(formData)) {
    if (fieldsToReset.includes(propertyName)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      formData[propertyName] = DefaultValues.STRING_EMPTY;
      Console.log(formData);
    }
  }
};
