import { CaseDate } from '../definitions/case';
import { DefaultValues } from '../definitions/constants';

import StringUtils from './StringUtils';

export default class DateUtils {
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

  public static addStringDate28Days(dateString: string): string {
    const date = this.convertStringToDate(dateString);
    if (!date) {
      return undefined;
    }
    date.setDate(date.getDate() + 28);
    return this.formatDateToDDMMYYY(date);
  }

  /**
   * Formats input date string to DD/MM/YYYY like 01/01/2025
   * @param dateString
   */
  public static formatDateStringToDDMMYYYY(dateString: string): string {
    const date: Date = this.convertStringToDate(dateString);
    return this.formatDateToDDMMYYY(date);
  }

  public static formatDateToDDMMYYY(date: Date): string {
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
    return this.formatDateToDDMonthYYYY(date);
  }

  /**
   * Formats input date string to DD/Month/YYYY like 01 Jan 2025
   * @param dateVal
   */
  public static formatDateToDDMonthYYYY(dateVal: Date): string {
    if (dateVal) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Europe/London',
      }).format(dateVal);
    }
    return DefaultValues.STRING_EMPTY;
  }

  public static formatDateStringToCaseDate(dateString: string): CaseDate {
    const date: Date = this.convertStringToDate(dateString);
    if (!date) {
      return undefined;
    }
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return {
      day: padStart(date.getDate()),
      month: padStart(date.getMonth() + 1),
      year: date.getFullYear().toString(),
    };
  }

  public static convertCaseDateToString(caseDate: CaseDate): string {
    if (!caseDate) {
      return DefaultValues.STRING_EMPTY;
    }
    const caseDateStringValue: string = this.convertCaseDateToDateStringDD_MM_YYYY(caseDate);
    if (StringUtils.isBlank(caseDateStringValue)) {
      return DefaultValues.STRING_EMPTY;
    }
    const date: Date = this.convertStringToDate(caseDateStringValue);
    if (!date) {
      return DefaultValues.STRING_EMPTY;
    }
    return this.formatDateToDDMonthYYYY(date);
  }

  public static convertCaseDateToDateStringDD_MM_YYYY(caseDate: CaseDate): string {
    if (!caseDate) {
      return DefaultValues.STRING_EMPTY;
    }
    return caseDate.year + DefaultValues.STRING_DASH + caseDate.month + DefaultValues.STRING_DASH + caseDate.day;
  }
}
