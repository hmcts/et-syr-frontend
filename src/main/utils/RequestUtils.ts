import { AppRequest } from '../definitions/appRequest';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import ObjectUtils from './ObjectUtils';

const logger = getLogger('ClaimantPayDetailsEnterController');

export default class RequestUtils {
  public static async setRequestUserCase(request: AppRequest): Promise<void> {
    let userCase = null;
    try {
      userCase = formatApiCaseDataToCaseWithId(
        (await getCaseApi(request.session.user?.accessToken).getUserCase(request?.session?.userCase?.id)).data,
        request
      );
    } catch (error) {
      logger.error('Unable to retrieve user info from get user api. Error is: ' + error.message);
    }
    if (ObjectUtils.isNotEmpty(userCase)) {
      request.session.userCase = userCase;
    }
  }
}
