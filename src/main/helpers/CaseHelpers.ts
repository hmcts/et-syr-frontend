import { AppRequest } from '../definitions/appRequest';
import { CaseWithId } from '../definitions/case';
import { DefaultValues } from '../definitions/constants';
import { Logger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';
import { getCaseApi } from '../services/CaseService';
import CollectionUtils from '../utils/CollectionUtils';

import { formatApiCaseDataToCaseWithId } from './ApiFormatter';
import { trimFormData } from './FormHelper';

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
    }
  }
};

function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
}

export const convertJsonArrayToTitleCase = (jsonArray: Record<string, string>[]): Record<string, string>[] => {
  return jsonArray.map(addressObj => {
    const newObj: Record<string, string> = {};

    for (const [key, value] of Object.entries(addressObj)) {
      if (key === 'postcode') {
        newObj[key] = value;
      } else if (key === 'fullAddress') {
        const postcode = addressObj.postcode;
        const addressWithoutPostcode = value.replace(postcode, '').trim();
        newObj[key] =
          toTitleCase(addressWithoutPostcode) + (addressWithoutPostcode.endsWith(',') ? '' : ',') + ' ' + postcode;
      } else {
        newObj[key] = toTitleCase(value);
      }
    }
    return newObj;
  });
};
