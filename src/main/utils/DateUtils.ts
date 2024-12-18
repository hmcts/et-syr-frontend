import { CaseDate } from '../definitions/case';
import { DefaultValues } from '../definitions/constants';

import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

export default class DateUtils {
  static padStart = (value: number): string => value.toString().padStart(2, '0');
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
      return `${this.padStart(date.getDate())}/${this.padStart(date.getMonth() + 1)}/${date.getFullYear()}`;
    }
    return DefaultValues.STRING_EMPTY;
  }

  /**
   * Formats input date string to DD/MMM/YYYY like 01 Jan 2025
   * @param dateString
   */
  public static formatDateStringToDDMMMYYYY(dateString: string): string {
    const date: Date = this.convertStringToDate(dateString);
    return this.formatDateToDDMMMYYYY(date);
  }

  /**
   * Formats input date string to DD/MMM/YYYY like 01 Jan 2025
   * @param dateVal
   */
  public static formatDateToDDMMMYYYY(dateVal: Date): string {
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

  public static getCurrentDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${this.padStart(date.getMonth() + 1)}-${this.padStart(date.getDate())}`;
  }

  /**
   * Formats input date string to DD/Month/YYYY like 01 January 2025
   * @param dateString
   */
  public static formatDateStringToDDMonthYYYY(dateString: string): string {
    const date: Date = this.convertStringToDate(dateString);
    return this.formatDateToDDMonthYYYY(date);
  }

  /**
   * Formats input date string to DD/Month/YYYY like 01 January 2025
   * @param dateVal
   */
  public static formatDateToDDMonthYYYY(dateVal: Date): string {
    if (dateVal) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
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
    return {
      day: this.padStart(date.getDate()),
      month: this.padStart(date.getMonth() + 1),
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
    return this.formatDateToDDMMMYYYY(date);
  }

  public static convertCaseDateToDateStringDD_MM_YYYY(caseDate: CaseDate): string {
    if (!caseDate) {
      return DefaultValues.STRING_EMPTY;
    }
    return caseDate.year + DefaultValues.STRING_DASH + caseDate.month + DefaultValues.STRING_DASH + caseDate.day;
  }

  public static convertCaseDateToApiDateStringYYYY_MM_DD(caseDate: CaseDate): string {
    if (
      ObjectUtils.isEmpty(caseDate) ||
      StringUtils.isBlank(caseDate.year) ||
      StringUtils.isBlank(caseDate.month) ||
      StringUtils.isBlank(caseDate.day)
    ) {
      return undefined;
    }
    const dateStringValue: string =
      caseDate.year + DefaultValues.STRING_DASH + caseDate.month + DefaultValues.STRING_DASH + caseDate.day;
    if (!DateUtils.isDateStringValid(dateStringValue)) {
      return undefined;
    }
    const date = this.convertStringToDate(dateStringValue);
    return `${date.getFullYear()}-${this.padStart(date.getMonth() + 1)}-${this.padStart(date.getDate())}`;
  }
}
