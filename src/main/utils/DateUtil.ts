import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class DateUtil {
  public static formatDateFromYYYYMMDDAsDDMMYYYY(date: string): string {
    if (StringUtils.isBlank(date)) {
      return DefaultValues.STRING_EMPTY;
    }
    const dateParts = date.trim().split(DefaultValues.STRING_DASH);
    if (dateParts.length < 3) {
      return DefaultValues.STRING_EMPTY;
    }
    return dateParts[2] + DefaultValues.STRING_SLASH + dateParts[1] + DefaultValues.STRING_SLASH + dateParts[0];
  }
}
