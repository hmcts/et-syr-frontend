import { ALLOWED_FILE_FORMATS, ValidationErrors } from '../definitions/constants';
import { Logger } from '../logger';
import StringUtils from '../utils/StringUtils';

export type Validator = (value: string | string[] | undefined) => void | string;

export const isFieldFilledIn: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return ValidationErrors.REQUIRED;
  }
};

export const isContentCharsOrLess = (maxlength: number): Validator => {
  return (value: string): string | undefined => {
    if (value && value.trim().length > maxlength) {
      return ValidationErrors.TOO_LONG;
    }
  };
};

export const isContentCharsOrLessAndNotEmpty = (maxlength: number): Validator => {
  return (value: string): string | undefined => {
    if (!value || StringUtils.isBlank(value)) {
      return ValidationErrors.REQUIRED;
    }
    if (value && value.trim().length > maxlength) {
      return ValidationErrors.TOO_LONG;
    }
  };
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

const isValidNumber = (value: string): boolean => {
  const numberPattern = /^[+]?(\d+(\.\d*)?|\.\d+)$/;
  return numberPattern.test(value);
};

export const isAValidNumber: Validator = value => {
  const valueAsString: string = value as string;

  if (!value || valueAsString.trim().length === 0) {
    return;
  }

  if (!isValidNumber(valueAsString)) {
    return ValidationErrors.NOT_A_NUMBER;
  }
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

export const hasInvalidFileName = (fileName: string): string => {
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

export const isValidEthosCaseReference: Validator = value => {
  const valueAsString = value as string;
  if (StringUtils.isBlank(valueAsString)) {
    return ValidationErrors.REQUIRED;
  }
  if (!/^\d{7}\/\d{4}$/.test(valueAsString)) {
    return ValidationErrors.INVALID_VALUE;
  }
  return;
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
