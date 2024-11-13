import { DefaultValues, FormFieldNames, ValidationErrors } from '../../../../main/definitions/constants';
import RespondentContestClaimReasonControllerHelper from '../../../../main/helpers/controller/RespondentContestClaimReasonControllerHelper';
import FileUtils from '../../../../main/utils/FileUtils';
import { mockCaseWithIdWithRespondents } from '../../mocks/mockCaseWithId';
import {
  mockDocumentTypeItemFromMockDocumentUploadResponse,
  mockDocumentUploadResponse,
} from '../../mocks/mockDocumentUploadResponse';
import { mockRequest } from '../../mocks/mockRequest';
import { mockRespondentET3Model } from '../../mocks/mockRespondentET3Model';

describe('RespondentContestClaimReasonControllerHelper', () => {
  const request = mockRequest({});
  describe('checkInputs', () => {
    it('sets required error to session for hidden field when there is no file and detail entered', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.respondents[0].et3ResponseContestClaimDocument = undefined;
      mockCaseWithIdWithRespondents.et3ResponseContestClaimDetails = DefaultValues.STRING_EMPTY;
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, mockCaseWithIdWithRespondents)
      ).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.REQUIRED,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
    });
    it('user can upload and set a reason for contest claim', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.respondents[1] = mockRespondentET3Model;
      request.session.userCase.et3ResponseContestClaimDocument = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      request.session.selectedRespondentIndex = 1;
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = 'a'.repeat(100);
      expect(RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData)).toEqual(true);
    });
    it('sets too long error to session for et3ResponseContestClaimDetails field when detail entered is more than 3000 characters', () => {
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.et3ResponseContestClaimDocument = [];
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = '0'.repeat(2501);
      expect(RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData)).toEqual(false);
      expect(request.session.errors).toEqual([
        {
          errorType: ValidationErrors.TOO_LONG,
          propertyName: FormFieldNames.RESPONDENT_CONTEST_CLAIM_REASON.ET3_RESPONSE_CONTEST_CLAIM_DETAILS,
        },
      ]);
    });
    it('returns true and removes all session errors when only valid contest claim detail is entered', () => {
      const formData = mockCaseWithIdWithRespondents;
      formData.et3ResponseContestClaimDetails = 'a'.repeat(100);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      expect(RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, formData)).toEqual(true);
      expect(request.session.errors).toHaveLength(DefaultValues.NUMBER_ZERO);
    });
    it('returns true and removes all session errors when only valid file(s) is uploaded', () => {
      mockCaseWithIdWithRespondents.et3ResponseContestClaimDetails = undefined;
      request.session.selectedRespondentIndex = 0;
      request.session.userCase = mockCaseWithIdWithRespondents;
      request.session.userCase.et3ResponseContestClaimDocument = [
        FileUtils.convertDocumentUploadResponseToDocumentTypeItem(request, mockDocumentUploadResponse),
      ];
      expect(
        RespondentContestClaimReasonControllerHelper.areInputValuesValid(request, mockCaseWithIdWithRespondents)
      ).toEqual(true);
      expect(request.session.errors).toHaveLength(DefaultValues.NUMBER_ZERO);
    });
  });
});
