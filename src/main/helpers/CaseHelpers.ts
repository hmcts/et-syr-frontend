import { AppRequest } from '../definitions/appRequest';
import { Logger } from '../logger';
import localesCy from '../resources/locales/cy/translation/common.json';
import locales from '../resources/locales/en/translation/common.json';
import { getCaseApi } from '../services/CaseService';

import { formatApiCaseDataToCaseWithId } from './ApiFormatter';

// Used for invoking PCQ survey.
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

export const handleUpdateHubLinksStatuses = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).updateHubLinksStatuses(req.session.userCase);
    logger.info(`Updated hub links statuses for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};
