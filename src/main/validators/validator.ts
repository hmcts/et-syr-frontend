import { ALLOWED_FILE_FORMATS, ValidationErrors } from '../definitions/constants';
import { Logger } from '../logger';
import StringUtils from '../utils/StringUtils';

export type Validator = (value: string | string[] | undefined) => void | string;

export const isFieldFilledIn: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return ValidationErrors.REQUIRED;
  }
};

export const isRespondentNameValid: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return ValidationErrors.REQUIRED;
  } else if (!/(=?^.{1,100}$)/.test(value as string)) {
    return ValidationErrors.INVALID_LENGTH;
  }
};

export const isContentCharsOrLess = (maxlength: number): Validator => {
  return (value: string): string | undefined => {
    if (value && value.trim().length > maxlength) {
      return ValidationErrors.TOO_LONG;
    }
  };
};

export const isContent2500CharsOrLess: Validator = value => {
  if (value && (value as string).trim().length > 2500) {
    return ValidationErrors.TOO_LONG;
  }
};

export const isContent2500CharsOrLessOrEmpty: Validator = value => {
  if (!value || StringUtils.isBlank(value as string)) {
    return ValidationErrors.REQUIRED;
  }
  if (value && (value as string).trim().length > 2500) {
    return ValidationErrors.TOO_LONG;
  }
};

export const isContent3000CharsOrLessOrEmpty: Validator = value => {
  if (!value || StringUtils.isBlank(value as string)) {
    return ValidationErrors.REQUIRED;
  }
  if (value && (value as string).trim().length > 3000) {
    return ValidationErrors.TOO_LONG;
  }
};

export const isContentBetween3And100Chars: Validator = value => {
  if (!value) {
    return ValidationErrors.REQUIRED;
  }

  const nameLength = (value as string).trim().length;
  if (nameLength < 3 || nameLength > 100) {
    return ValidationErrors.INVALID_LENGTH;
  }
};

export const isOptionSelected: Validator = value => {
  if (!value || (value as string).trim() === 'notSelected') {
    return ValidationErrors.REQUIRED;
  }
};

export const atLeastOneFieldIsChecked: Validator = (fields: string[]) => {
  if (!fields || (fields as []).length === 0) {
    return ValidationErrors.REQUIRED;
  }
};

export const isValidUKTelNumber: Validator = value => {
  if (value === null || value === '') {
    return;
  }
  try {
    if (!/^[+()\- \d]+$/.test(value as string)) {
      return ValidationErrors.NON_NUMERIC;
    }
    if (
      !/^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$/.test(
        value as string
      )
    ) {
      return ValidationErrors.INVALID_VALUE;
    }
  } catch (e) {
    return ValidationErrors.INVALID_VALUE;
  }
};

export const isValidTwoDigitInteger: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return ValidationErrors.INVALID_VALUE;
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return ValidationErrors.NOT_A_NUMBER;
  }
};

export const isValidCompanyRegistrationNumber: Validator = value => {
  // Allow empty value (optional field)
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  // Ensure the value is alphanumeric and does not exceed 8 characters
  if (!/^[a-zA-Z0-9]{1,8}$/.test(value as string)) {
    return ValidationErrors.INVALID_COMPANY_REGISTRATION_NUMBER;
  }
};

export const isValidNoticeLength: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return ValidationErrors.NOT_A_NUMBER;
  }
};

export const areBenefitsValid: Validator = value => {
  return isContent2500CharsOrLess(value);
};

export const isPayIntervalNull: Validator = (value: string) => {
  if (!value) {
    return ValidationErrors.REQUIRED;
  }
};

export const arePayValuesNull: Validator = (value: string[]) => {
  if (value && value.every(element => !element)) {
    return ValidationErrors.REQUIRED;
  }
};

const isValidNumber = (value: string): boolean => {
  const numberPattern = /^[+]?(\d+(\.\d*)?|\.\d+)$/;
  return numberPattern.test(value);
};

export const isValidAvgWeeklyHours: Validator = value => {
  const valueAsString: string = value as string;

  if (!value || valueAsString.trim().length === 0) {
    return;
  }

  if (!isValidNumber(valueAsString)) {
    return ValidationErrors.INVALID_VALUE;
  }

  const maxValue = 168;
  const hours = parseFloat(value as string);
  if (hours > maxValue) {
    return ValidationErrors.EXCEEDED;
  }
};

export const isValidCurrency: Validator = value => {
  if (!value) {
    return;
  }
  const validatedValues: [digitCount: number, correctFormat: boolean] = currencyValidation(value);
  if (validatedValues[0] <= 12 && validatedValues[1]) {
    return;
  }
  return ValidationErrors.INVALID_CURRENCY;
};

export const currencyValidation = (value: string | string[]): [digitCount: number, correctFormat: boolean] => {
  value = (value as string).trim();
  const digitCount = value.replace(/\D/g, '').length;
  const correctFormat = /^\d{1,3}((,\d{3}){0,3}|(\d{3}){0,3})(\.\d{2})?$/.test(value);
  return [digitCount, correctFormat];
};

export const hasInvalidName = (fileName: string): string => {
  if (!fileName) {
    return;
  }

  const fileNameRegExPattern = /^(?!\.)[^|*?:<>/$"]{1,150}$/;

  if (fileNameRegExPattern.test(fileName)) {
    return;
  } else {
    return ValidationErrors.INVALID_FILE_NAME;
  }
};

export const hasInvalidFileFormat = (value: Express.Multer.File, logger: Logger): string => {
  if (!value || !value.originalname) {
    return;
  }

  for (const format of ALLOWED_FILE_FORMATS) {
    if (value.originalname.endsWith('.' + format)) {
      return;
    }
  }
  if (logger) {
    logger.info('Invalid file name:' + value.originalname);
  }
  return ValidationErrors.INVALID_FILE_FORMAT;
};

export const isAcasNumberValid: Validator = value => {
  const valueAsString = value as string;
  if (!/^[rR]\d{6}\/\d{2}\/\d{2}$/.test(valueAsString)) {
    return ValidationErrors.INVALID_ACAS_NUMBER;
  }
};

export const isNameValid: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  // regular expression to allow alphanumeric characters, spaces, and specific special characters
  const namePattern = /^[a-zA-Z0-9 ,.'-]+$/;

  // Test the name against the regular expression above
  if (!namePattern.test(value as string)) {
    return ValidationErrors.INVALID_NAME;
  }
};

export const isPhoneNumberValid: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  // regular expression to cover Uk and International number upto 20 chars
  const phonePattern = /^\+?[0-9\s\-().]{7,20}$/;

  // Test the value against the regular expression
  if (!phonePattern.test(value as string)) {
    return ValidationErrors.INVALID_PHONE_NUMBER;
  }
};

export const isFilledInAndIs2500CharsOrLess: Validator = value => {
  if (isFieldFilledIn(value)) {
    return ValidationErrors.REQUIRED;
  }
  if (isContent2500CharsOrLess(value)) {
    return ValidationErrors.TOO_LONG;
  }
};
