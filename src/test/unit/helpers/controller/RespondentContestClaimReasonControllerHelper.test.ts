import { DefaultValues, FormFieldNames, ValidationErrors } from '../../../../main/definitions/constants';
import RespondentContestClaimReasonControllerHelper from '../../../../main/helpers/controller/RespondentContestClaimReasonControllerHelper';
import { getLogger } from '../../../../main/logger';
import { mockCaseWithIdWithRespondents } from '../../mocks/mockCaseWithId';
import { mockRequest } from '../../mocks/mockRequest';

const logger = getLogger('RespondentContestClaimReasonController');

describe('RespondentContestClaimReasonControllerHelper', () => {
  const request = mockRequest({});
  const fileInvalidFormat: Express.Multer.File = {
    buffer: undefined,
    destination: '',
    encoding: '',
    fieldname: '',
    filename: '',
    mimetype: '',
    originalname: 'testFile.test',
    path: '',
    size: 0,
    stream: undefined,
  };
  const fileValid: Express.Multer.File = {
    buffer: undefined,
    destination: '',
    encoding: '',
    fieldname: '',
    filename: '',
    mimetype: '',
    originalname: 'testFile.pdf',
    path: '',
    size: 0,
    stream: undefined,
  };
  const fileInvalidName: Express.Multer.File = {
    buffer: undefined,
    destination: '',
    encoding: '',
    fieldname: '',
    filename: '',
    mimetype: '',
    originalname: 'testFil?e.pdf',
    path: '',
    size: 0,
    stream: undefined,
  };

  describe('checkInputs', () => {
    it('sets required error to session for et3ResponseContestClaimDetails field when there is no file and detail entered', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(
          request,
          mockCaseWithIdWithRespondents,
          [],
          logger
        )
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.REQUIRED,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS,
        },
      ]);
    });
    it('sets text and file error to session for et3ResponseContestClaimDetails field when there both file and detail entered', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = 'a'.repeat(100);
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData, [fileValid], logger)
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.TEXT_AND_FILE,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS,
        },
      ]);
    });
    it('sets too long error to session for et3ResponseContestClaimDetails field when detail entered is more than 3000 characters', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = '0'.repeat(3001);
      expect(RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData, [], logger)).toEqual(
        false
      );
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.TOO_LONG,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS,
        },
      ]);
    });
    it('sets invalid file format error to session for contestClaimDocument field when file format is invalid', () => {
      mockCaseWithIdWithRespondents.et3ResponseContestClaimDetails = undefined;
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(
          request,
          mockCaseWithIdWithRespondents,
          [fileValid, fileInvalidFormat, fileValid],
          logger
        )
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_FORMAT,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    it('sets invalid file name to session for contestClaimDocument field when one of the file name is invalid', () => {
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(
          request,
          mockCaseWithIdWithRespondents,
          [fileValid, fileInvalidName, fileValid],
          logger
        )
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.INVALID_FILE_NAME,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.CONTEST_CLAIM_DOCUMENT,
        },
      ]);
    });
    it('returns true and removes all session errors when only valid contest claim detail is entered', () => {
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = 'a'.repeat(100);
      expect(RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData, [], logger)).toEqual(
        true
      );
      expect(request.session.errors).toHaveLength(DefaultValues.NUMBER_ZERO);
    });
    it('returns true and removes all session errors when only valid file(s) is uploaded', () => {
      mockCaseWithIdWithRespondents.et3ResponseContestClaimDetails = undefined;
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(
          request,
          mockCaseWithIdWithRespondents,
          [fileValid],
          logger
        )
      ).toEqual(true);
      expect(request.session.errors).toHaveLength(DefaultValues.NUMBER_ZERO);
    });
  });
});
