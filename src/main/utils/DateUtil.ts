import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class DateUtil {
  public static isDateStringValid(dateString: string): boolean {
    return !this.isDateStringInValid(dateString);
  }

  public static isDateStringInValid(dateString: string): boolean {
    return (
      StringUtils.isBlank(dateString) ||
      isNaN(Date.parse(dateString)) ||
      Date.parse(dateString) === undefined ||
      new Date(dateString).toString() === 'Invalid Date'
    );
  }

  public static convertStringToDate(dateString: string): Date {
    if (this.isDateStringInValid(dateString)) {
      return undefined;
    }
    const timestamp: number = Date.parse(dateString);
    return new Date(timestamp);
  }

  /**
   * Formats input date string to DD/MM/YYYY like 01/01/2025
   * @param dateString
   */
  public static formatDateStringToDDMMYYYY(dateString: string): string {
    const date: Date = this.convertStringToDate(dateString);
    if (date) {
      const padStart = (value: number): string => value.toString().padStart(2, '0');
      return `${padStart(date.getDate())}/${padStart(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
    return DefaultValues.STRING_EMPTY;
  }

  /**
   * Formats input date string to DD/Month/YYYY like 01 Jan 2025
   * @param dateString
   */
  public static formatDateStringToDDMonthYYYY(dateString: string): string {
    const date: Date = this.convertStringToDate(dateString);
    if (date) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Europe/London',
      }).format(date);
    }
    return DefaultValues.STRING_EMPTY;
  }
}
