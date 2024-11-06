import RemoveFileController from '../../../main/controllers/RemoveFileController';
import { FormFieldNames, PageUrls, ValidationErrors, languages } from '../../../main/definitions/constants';
import { mockDocumentTypeItemFromMockDocumentUploadResponseDocumentFileNameTestFilePdf } from '../mocks/mockDocumentUploadResponse';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RemoveFileController', () => {
  describe('get', () => {
    const controller = new RemoveFileController();
    const request = mockRequest({
      session: {
        userCase: {
          respondents: [{ respondentName: 'Respondent Name' }],
        },
      },
    });
    const response = mockResponse();
    it('should set unable to remove file error to session and redirect to respondent contest claim reason page when request url is undefined', () => {
      request.url = undefined;
      controller.get(request, response);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.UNABLE_TO_REMOVE_FILE,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_CONTEST_CLAIM_REASON);
    });
    it('should set unable to remove file and unable to find respondent errors to session and redirect to respondent contest claim reason page when there is no user case in session', () => {
      request.url = 'https://localhost:3003/remove-file?lng=en&fileId=57ce554c-a8b0-4a0d-a786-0565634601b1';
      request.session.selectedRespondentIndex = 0;
      controller.get(request, response);
      expect(request.session.errors).toStrictEqual([
        {
          errorType: ValidationErrors.UNABLE_TO_REMOVE_FILE,
          propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        },
      ]);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON + languages.ENGLISH_URL_PARAMETER
      );
    });
    it('should be able to find file when file in the request has the same name with file in the contest claim documents', () => {
      request.url = 'https://localhost:3003/remove-file?lng=en&fileId=900d4265-aaeb-455f-9cdd-bc0bdf61c918';
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.et3ResponseContestClaimDocument = [
        mockDocumentTypeItemFromMockDocumentUploadResponseDocumentFileNameTestFilePdf,
      ];
      controller.get(request, response);
      expect(request.session.errors).toStrictEqual([]);
      expect(response.redirect).toHaveBeenCalledWith(
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON + languages.ENGLISH_URL_PARAMETER
      );
    });
  });
});
