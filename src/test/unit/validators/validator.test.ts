import { getLogger } from '../../../main/logger';
import {
  areBenefitsValid,
  arePayValuesNull,
  atLeastOneFieldIsChecked,
  hasInvalidFileFormat,
  hasInvalidName,
  isAcasNumberValid,
  isContent100CharsOrLess,
  isContent2500CharsOrLess,
  isContentBetween3And100Chars,
  isFieldFilledIn,
  isNameValid,
  isOptionSelected,
  isPayIntervalNull,
  isPhoneNumberValid,
  isRespondentNameValid,
  isValidAvgWeeklyHours,
  isValidCompanyRegistrationNumber,
  isValidCurrency,
  isValidNoticeLength,
  isValidPay,
  isValidTwoDigitInteger,
  isValidUKTelNumber,
} from '../../../main/validators/validator';
import { mockFile } from '../mocks/mockFile';

describe('Validation', () => {
  describe('isFieldFilledIn()', () => {
    it('Should check if value exist', () => {
      const isValid = isFieldFilledIn('Yes');

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = isFieldFilledIn(undefined);

      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isFieldFilledIn('    ');

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isRespondentNameValid()', () => {
    it.each([
      { name: 'Test Respondent Name', result: undefined },
      { name: undefined, result: 'required' },
      { name: '     ', result: 'required' },
      { name: 'a'.repeat(101), result: 'invalidLength' },
    ])('check respondent name passes validation: %o', ({ name, result }) => {
      const isValid = isRespondentNameValid(name);

      expect(isValid).toStrictEqual(result);
    });
  });

  describe('isContent2500CharsOrLess()', () => {
    it('should not warn when content is 2500 characters or less', () => {
      expect(isContent2500CharsOrLess(undefined)).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('')).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('1'.repeat(2500))).toStrictEqual(undefined);
    });

    it('should warn when content longer than 2500 characters', () => {
      expect(isContent2500CharsOrLess('1'.repeat(2501))).toStrictEqual('tooLong');
    });
  });

  describe('isContentBetween3And100Chars()', () => {
    it('should warn when content is empty', () => {
      expect(isContentBetween3And100Chars('')).toStrictEqual('required');
    });

    it('should not warn when content is valid length', () => {
      expect(isContentBetween3And100Chars('abc')).toStrictEqual(undefined);
      expect(isContentBetween3And100Chars('1'.repeat(100))).toStrictEqual(undefined);
    });

    it('should warn when content shorter than 3 characters', () => {
      expect(isContentBetween3And100Chars('12')).toStrictEqual('invalidLength');
    });

    it('should warn when content longer than 100 characters', () => {
      expect(isContentBetween3And100Chars('1'.repeat(101))).toStrictEqual('invalidLength');
    });
  });

  describe('isOptionSelected()', () => {
    it('Should correctly identify an option was selected', () => {
      expect(isOptionSelected('anything')).toStrictEqual(undefined);
    });

    it('Should correctly identify an option was not selected', () => {
      expect(isOptionSelected('notSelected')).toStrictEqual('required');
    });
  });

  describe('atLeastOneFieldIsChecked()', () => {
    it('Should check if value exist', () => {
      const isValid = atLeastOneFieldIsChecked(['Yes']);

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = atLeastOneFieldIsChecked([]);

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isValidUKTelNumber()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: null, expected: undefined },
      { mockRef: '12345', expected: 'invalid' },
      { mockRef: '@£$£@$%', expected: 'nonnumeric' },
      { mockRef: 'not a phone number', expected: 'nonnumeric' },
      { mockRef: '01234!567890', expected: 'nonnumeric' },
      { mockRef: '00361234567890', expected: 'invalid' },
      { mockRef: '1234567890', expected: 'invalid' },
      { mockRef: '01234 567 890', expected: undefined },
      { mockRef: '01234 567890', expected: undefined },
      { mockRef: '+441234567890', expected: undefined },
      { mockRef: '00441234567890', expected: 'invalid' },
      { mockRef: '004401234567890', expected: 'invalid' },
      { mockRef: '01234567890', expected: undefined },
      { mockRef: '+44 (07500) 900 983', expected: 'invalid' },
      { mockRef: '(01629) 900 983', expected: undefined },
      { mockRef: '01234567B90', expected: 'nonnumeric' },
    ])('check telephone number validity when %o', ({ mockRef, expected }) => {
      expect(isValidUKTelNumber(mockRef)).toEqual(expected);
    });
  });

  describe('isValidTwoDigitInteger()', () => {
    it.each([
      { mockRef: '', expected: 'invalid' },
      { mockRef: null, expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
      { mockRef: '20', expected: undefined },
    ])('check two digit input is valid', ({ mockRef, expected }) => {
      expect(isValidTwoDigitInteger(mockRef)).toEqual(expected);
    });
  });

  describe('isValidCompanyRegistrationNumber', () => {
    it('should return undefined for an empty value', () => {
      expect(isValidCompanyRegistrationNumber('')).toBeUndefined();
      expect(isValidCompanyRegistrationNumber(' ')).toBeUndefined();
      expect(isValidCompanyRegistrationNumber(null)).toBeUndefined();
      expect(isValidCompanyRegistrationNumber(undefined)).toBeUndefined();
    });

    it('should return undefined for valid alphanumeric strings up to 8 characters', () => {
      expect(isValidCompanyRegistrationNumber('12345678')).toBeUndefined();
      expect(isValidCompanyRegistrationNumber('ABCDEFGH')).toBeUndefined();
      expect(isValidCompanyRegistrationNumber('1A2B3C4D')).toBeUndefined();
    });

    it('should return "invalidCompanyRegistrationNumber" for strings longer than 8 characters', () => {
      expect(isValidCompanyRegistrationNumber('123456789')).toBe('invalidCompanyRegistrationNumber');
      expect(isValidCompanyRegistrationNumber('ABCDEFGHI')).toBe('invalidCompanyRegistrationNumber');
    });

    it('should return "invalidCompanyRegistrationNumber" for strings with non-alphanumeric characters', () => {
      expect(isValidCompanyRegistrationNumber('12345-78')).toBe('invalidCompanyRegistrationNumber');
      expect(isValidCompanyRegistrationNumber('12 45678')).toBe('invalidCompanyRegistrationNumber');
      expect(isValidCompanyRegistrationNumber('ABC#EFG')).toBe('invalidCompanyRegistrationNumber');
    });

    it('should return "invalidCompanyRegistrationNumber" for non-alphanumeric strings of valid length', () => {
      expect(isValidCompanyRegistrationNumber('!@#$%^&*')).toBe('invalidCompanyRegistrationNumber');
      expect(isValidCompanyRegistrationNumber('1234!@')).toBe('invalidCompanyRegistrationNumber');
    });
  });

  describe('isValidNoticeLength()', () => {
    it.each([
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
      { mockRef: '', expected: undefined },
    ])('check notice length is valid', ({ mockRef, expected }) => {
      expect(isValidNoticeLength(mockRef)).toEqual(expected);
      expect(isValidNoticeLength('')).toBeUndefined();
    });
  });

  describe('areBenefitsValid()', () => {
    it.each([{ mockRef: 'a', expected: undefined }])('check if benefits are valid', ({ mockRef, expected }) => {
      expect(areBenefitsValid(mockRef)).toEqual(expected);
    });
  });

  describe('isValidAvgWeeklyHours()', () => {
    it.each([
      { mockRef: '00', expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '20.00', expected: undefined },
      { mockRef: '169', expected: 'exceeded' },
      { mockRef: '-4', expected: 'negativeNumber' },
      { mockRef: '35', expected: undefined },
      { mockRef: '2', expected: undefined },
      { mockRef: '.25', expected: 'invalid' },
      { mockRef: '-1', expected: 'negativeNumber' },
      { mockRef: null, expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidAvgWeeklyHours(mockRef)).toEqual(expected);
    });
  });

  describe('isPayIntervalNull()', () => {
    it('Should check if value exists', () => {
      const isValid = isPayIntervalNull('Weekly' || 'Monthly' || 'Annual');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const value = '';
      const isValid = isPayIntervalNull(value);
      expect(isValid).toStrictEqual('required');
    });
  });

  describe('arePayValuesNull()', () => {
    it('Should check if pay values exists', () => {
      const isValid = arePayValuesNull(['123', '123', null]);
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if pay values do not exist', () => {
      const value = ['', '', undefined];
      const isValid = arePayValuesNull(value);
      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isValidCurrency()', () => {
    it.each([
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
      { mockRef: '0', expected: undefined },
      { mockRef: '1', expected: undefined },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: 'a', expected: 'invalidCurrency' },
      { mockRef: '%', expected: 'invalidCurrency' },
      { mockRef: '25a', expected: 'invalidCurrency' },
      { mockRef: '-120', expected: 'invalidCurrency' },
      { mockRef: '20,00', expected: 'invalidCurrency' },
      { mockRef: '100,00', expected: 'invalidCurrency' },
      { mockRef: '123456,890', expected: 'invalidCurrency' },
      { mockRef: '1234567890123', expected: 'invalidCurrency' },
      { mockRef: '123456789012.12', expected: 'invalidCurrency' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });

  describe('isValidPay()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: '0', expected: 'minLengthRequired' },
      { mockRef: '1', expected: 'minLengthRequired' },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '-120', expected: 'notANumber' },
      { mockRef: '20,00', expected: 'notANumber' },
      { mockRef: '100,00', expected: 'notANumber' },
      { mockRef: '123456,890', expected: 'notANumber' },
      { mockRef: '1234567890123', expected: 'notANumber' },
      { mockRef: '123456789012.12', expected: 'minLengthRequired' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidPay(mockRef)).toEqual(expected);
    });
  });

  describe('hasValidFileFormat()', () => {
    it.each([
      { fileName: undefined, expected: undefined },
      { fileName: '', expected: undefined },
      { fileName: '.csv', expected: undefined },
      { fileName: '..csv', expected: undefined },
      { fileName: 'file.csv', expected: undefined },
      { fileName: 'file.pdf', expected: undefined },
      { fileName: 'file.doc', expected: undefined },
      { fileName: 'file.docx', expected: undefined },
      { fileName: 'file.txt', expected: undefined },
      { fileName: 'file.dot', expected: undefined },
      { fileName: 'file.jpg', expected: undefined },
      { fileName: 'file.jpeg', expected: undefined },
      { fileName: 'file.bmp', expected: undefined },
      { fileName: 'file.tif', expected: undefined },
      { fileName: 'file.tiff', expected: undefined },
      { fileName: 'file.png', expected: undefined },
      { fileName: 'file.xls', expected: undefined },
      { fileName: 'file.xlt', expected: undefined },
      { fileName: 'file.xla', expected: undefined },
      { fileName: 'file.xlsx', expected: undefined },
      { fileName: 'file.xltx', expected: undefined },
      { fileName: 'file.xlsb', expected: 'invalidFileFormat' },
      { fileName: 'file.ppt', expected: undefined },
      { fileName: 'file.pot', expected: undefined },
      { fileName: 'file.pps', expected: undefined },
      { fileName: 'file.ppa', expected: undefined },
      { fileName: 'file.pptx', expected: undefined },
      { fileName: 'file.potx', expected: undefined },
      { fileName: 'file.ppsx', expected: undefined },
      { fileName: 'file.rtf', expected: undefined },
      { fileName: 'file Copy(0).csv', expected: undefined },
      { fileName: 'file_with_underscore.txt', expected: undefined },
      { fileName: 'file.file.csv', expected: undefined },
      { fileName: 'file.csv.csv', expected: undefined },
      { fileName: 'file.msg', expected: 'invalidFileFormat' },
      { fileName: 'file.csv.msg', expected: 'invalidFileFormat' },
      { fileName: 'file.json', expected: 'invalidFileFormat' },
      { fileName: 'file', expected: 'invalidFileFormat' },
      { fileName: 'file.pfsz', expected: 'invalidFileFormat' },
      { fileName: 'file.pj', expected: 'invalidFileFormat' },
      { fileName: 'file.gjp', expected: 'invalidFileFormat' },
      { fileName: 'csv', expected: 'invalidFileFormat' },
      { fileName: 'file.', expected: 'invalidFileFormat' },
      { fileName: 'file.invalidFormat', expected: 'invalidFileFormat' },
    ])('Check file format %o', ({ fileName, expected }) => {
      const newFile = mockFile;
      newFile.originalname = fileName;
      expect(hasInvalidFileFormat(newFile, getLogger('test'))).toEqual(expected);
    });
    it.each([{ fileName: 'file.invalidFormat', expected: 'invalidFileFormat' }])(
      'Check file format %o',
      ({ fileName, expected }) => {
        const newFile = mockFile;
        newFile.originalname = fileName;
        expect(hasInvalidFileFormat(newFile, undefined)).toEqual(expected);
      }
    );
  });
  describe('hasValidFileName()', () => {
    it.each([
      { fileName: 'file Copy(0).csv', expected: undefined },
      { fileName: 'file_with_underscore.txt', expected: undefined },
      { fileName: 'file.file.csv', expected: undefined },
      { fileName: 'file.csv.csv', expected: undefined },
      { fileName: 'file?.csv', expected: 'invalidFileName' },
      { fileName: 'file<1>.csv', expected: 'invalidFileName' },
      { fileName: undefined, expected: undefined },
    ])('Check filename %o', ({ fileName, expected }) => {
      expect(hasInvalidName(fileName)).toEqual(expected);
      expect(hasInvalidName('')).toBeUndefined();
    });
  });
  describe('isAcasNumberValid()', () => {
    it('Should check if value does not exist', () => {
      const isValid = isAcasNumberValid(undefined);

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isAcasNumberValid('    ');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value has more than 11 characters', () => {
      const isValid = isAcasNumberValid('R123456/89');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value has less than 14 characters', () => {
      const isValid = isAcasNumberValid('R123456/890123');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if value starts with R', () => {
      const beginsWithT = isAcasNumberValid('T123458/89/13');
      const beginsWithQ = isAcasNumberValid('q123456/78/12');
      const beginsWithDigit = isAcasNumberValid('1234556/79/12');

      expect(beginsWithT).toStrictEqual('invalidAcasNumber');
      expect(beginsWithQ).toStrictEqual('invalidAcasNumber');
      expect(beginsWithDigit).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any numeric or / character after R', () => {
      const isValid = isAcasNumberValid('R12345/789a12');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any repeating / character like //', () => {
      const isValid = isAcasNumberValid('R145//9123112');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has any repeating / character like ///', () => {
      const isValid = isAcasNumberValid('R145///123112');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should check if has / character at the end', () => {
      const isValid = isAcasNumberValid('R145123112/');

      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should not allow incorrect number of characters in the first digit block', () => {
      const fiveDigits = isAcasNumberValid('R12345/78/12');
      const sevenDigits = isAcasNumberValid('R1234567/78/12');

      expect(fiveDigits).toStrictEqual('invalidAcasNumber');
      expect(sevenDigits).toStrictEqual('invalidAcasNumber');
    });

    it('Should not allow incorrect number of digits in the middle digit block', () => {
      const oneDigit = isAcasNumberValid('R123456/321/12');
      const threeDigits = isAcasNumberValid('R123456/7/12');

      expect(oneDigit).toStrictEqual('invalidAcasNumber');
      expect(threeDigits).toStrictEqual('invalidAcasNumber');
    });
    it('Should not allow incorrect number of digits in the last digit block', () => {
      const oneDigit = isAcasNumberValid('R123456/32/1');
      const threeDigits = isAcasNumberValid('R123456/47/124');

      expect(oneDigit).toStrictEqual('invalidAcasNumber');
      expect(threeDigits).toStrictEqual('invalidAcasNumber');
    });
    it('Should not allow the slashes in any position', () => {
      const isValid = isAcasNumberValid('R123/45678/12');
      expect(isValid).toStrictEqual('invalidAcasNumber');
    });

    it('Should allow a small r at the beginning', () => {
      const isValid = isAcasNumberValid('r123455/79/12');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should validate corect RNNNNNN/NN/NN format', () => {
      const isValid = isAcasNumberValid('R123456/78/12');
      expect(isValid).toStrictEqual(undefined);
    });
  });
  describe('isContent100CharsOrLess()', () => {
    it('should not warn when content is 100 characters or less', () => {
      expect(isContent100CharsOrLess(undefined)).toStrictEqual(undefined);
      expect(isContent100CharsOrLess('')).toStrictEqual(undefined);
      expect(isContent100CharsOrLess('1'.repeat(100))).toStrictEqual(undefined);
    });

    it('should warn when content longer than 100 characters', () => {
      expect(isContent100CharsOrLess('1'.repeat(101))).toStrictEqual('tooLong');
    });
  });

  describe('isNameValid', () => {
    it('should return undefined for a valid name', () => {
      const validNames = [
        'John Doe', // Standard name with first and last name
        "Jane O'Connor", // Name with an apostrophe
        'Alice Smith', // Simple first and last name
        "Bob O'Rourke", // Name with an apostrophe
        'Charles, the Great', // Name with a comma
        'Dr. John Doe', // Name with a title (Dr.)
        'Mary Jane', // Simple first and last name
        "James O'Reilly", // Name with an apostrophe
        'Lisa-Marie', // Name with a hyphen
      ];

      validNames.forEach(name => {
        expect(isNameValid(name)).toBeUndefined();
      });
    });

    it('should return "invalidName" for an invalid name', () => {
      const invalidNames = [
        'John@Doe', // Name with an invalid character (@)
        'Jane#Smith', // Name with an invalid character (#)
        'Alice^Smith', // Name with an invalid character (^)
        'Bob O`Connor', // Name with an invalid character (`)
        'John*Doe', // Name with an invalid character (*)
        '<script>alert("xss")</script>', // Malicious script to test XSS vulnerability
      ];

      // Iterate through each invalid name and check that validation returns 'invalidName'
      invalidNames.forEach(name => {
        expect(isNameValid(name)).toStrictEqual('invalidName');
      });
    });

    it('should return if null or empty', () => {
      const validNoEntryInField = ['', null];

      validNoEntryInField.forEach(name => {
        expect(isNameValid(name)).toBeUndefined();
      });
    });
  });

  describe('isPhoneNumberValid', () => {
    it('should return undefined for a valid phone number', () => {
      const validPhoneNumbers = [
        '01234567890', // Standard UK phone number
        '+441632960961', // UK phone number with international code
        '+1 (202) 555-0165', // US phone number with international code and formatting
        '123-456-7890', // US phone number with dashes
        '+44 20 7946 0958', // UK phone number with international code and spaces
        '555-1234', // Shorter phone number format
        '+33 1 70 18 99 00', // French phone number with international code and spaces
        '(555) 123-4567', // US phone number with parentheses and dashes
        '+91 9876543210', // Indian phone number with international code
      ];

      validPhoneNumbers.forEach(phoneNumber => {
        expect(isPhoneNumberValid(phoneNumber)).toBeUndefined();
      });
    });

    it('should return "invalidPhoneNumber" for an invalid phone number', () => {
      const invalidPhoneNumbers = [
        '12345', // Phone number too short
        'abcdef', // Phone number with letters
        '+44 123456789012345678901', // Phone number too long
        '555-1234-5678234567876548', // Phone number too long
        '1234ABCD', // Phone number with letters
        '+44 15', // Phone number too short
        '55555', // Phone number too short
      ];

      invalidPhoneNumbers.forEach(phoneNumber => {
        expect(isPhoneNumberValid(phoneNumber)).toStrictEqual('invalidPhoneNumber');
      });
    });

    it('should return if null or empty', () => {
      const validNoEntryInField = ['', null];

      validNoEntryInField.forEach(phoneNumber => {
        expect(isPhoneNumberValid(phoneNumber)).toBeUndefined();
      });
    });
  });
});
