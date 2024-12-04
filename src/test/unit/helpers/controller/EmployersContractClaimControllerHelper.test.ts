import _ from 'lodash';

import { AppRequest } from '../../../../main/definitions/appRequest';
import { CaseWithId, RespondentET3Model, UploadedDocumentType } from '../../../../main/definitions/case';
import { DefaultValues } from '../../../../main/definitions/constants';
import EmployersContractClaimControllerHelper from '../../../../main/helpers/controller/EmployersContractClaimControllerHelper';
import { mockValidCaseWithId } from '../../mocks/mockCaseWithId';
import { mockValidCaseWithIdWithFullRespondentDetails } from '../../mocks/mockCaseWithIdWithFullRespondentDetails';
import { mockDocumentTypeItemFromMockDocumentUploadResponse } from '../../mocks/mockDocumentUploadResponse';
import { mockRequest } from '../../mocks/mockRequest';

describe('EmployersContractClaimControllerHelper tests', () => {
  describe('resetEmployersContractClaimDetails', () => {
    const request = mockRequest({});
    const et3ResponseEmployerClaimDetails = 'Test Employer Claim Details';
    const et3ResponseEmployerClaimDocumentFileName = 'Test Employer Claim Document File Name';
    const et3ResponseEmployerClaimDocumentUrl = 'Test Employer Claim Document Url';
    const et3ResponseEmployerClaimDocumentBinaryUrl = 'Test Employer Claim Document Binary Url';
    const et3ResponseEmployerClaimDocumentUploadTimestamp = 'Test Employer Claim Document Upload Timestamp';
    const et3ResponseEmployerClaimDocumentCategoryId = 'Test Employer Claim Document Category Id';
    const et3ResponseEmployerClaimDocument: UploadedDocumentType = {
      document_filename: 'Test Employer Claim Document File Name',
      document_url: 'Test Employer Claim Document Url',
      upload_timestamp: 'Test Employer Claim Document Upload Timestamp',
      category_id: 'Test Employer Claim Document Category Id',
      document_binary_url: 'Test Employer Claim Document Binary Url',
    };
    const expectResultsForUserCase = (userCase: CaseWithId): boolean => {
      expect(userCase.et3ResponseEmployerClaimDetails).toStrictEqual(DefaultValues.STRING_EMPTY);
      expect(userCase.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(undefined);
      expect(userCase.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(undefined);
      expect(userCase.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(undefined);
      expect(userCase.et3ResponseEmployerClaimDocumentUploadTimestamp).toStrictEqual(undefined);
      expect(userCase.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(undefined);
      expect(userCase.et3ResponseEmployerClaimDocument).toStrictEqual(undefined);
      return true;
    };
    const expectResultsForSelectedRespondent = (selectedRespondent: RespondentET3Model): boolean => {
      expect(selectedRespondent.et3ResponseEmployerClaimDetails).toStrictEqual(DefaultValues.STRING_EMPTY);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentFileName).toStrictEqual(undefined);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentUrl).toStrictEqual(undefined);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl).toStrictEqual(undefined);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp).toStrictEqual(undefined);
      expect(selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId).toStrictEqual(undefined);
      expect(selectedRespondent.et3ResponseEmployerClaimDocument).toStrictEqual(undefined);
      return true;
    };
    const setUserCaseEt3EmployerClaimDetails = (req: AppRequest): void => {
      req.session.userCase.et3ResponseEmployerClaimDetails = et3ResponseEmployerClaimDetails;
      req.session.userCase.et3ResponseEmployerClaimDocumentFileName = et3ResponseEmployerClaimDocumentFileName;
      req.session.userCase.et3ResponseEmployerClaimDocumentUrl = et3ResponseEmployerClaimDocumentUrl;
      req.session.userCase.et3ResponseEmployerClaimDocumentBinaryUrl = et3ResponseEmployerClaimDocumentBinaryUrl;
      req.session.userCase.et3ResponseEmployerClaimDocumentUploadTimestamp =
        et3ResponseEmployerClaimDocumentUploadTimestamp;
      req.session.userCase.et3ResponseEmployerClaimDocumentCategoryId = et3ResponseEmployerClaimDocumentCategoryId;
      req.session.userCase.et3ResponseEmployerClaimDocument = et3ResponseEmployerClaimDocument;
    };
    const setUserCaseSelectedRespondentEt3EmployerClaimDetails = (req: AppRequest): void => {
      const selectedRespondent = req.session.userCase.respondents[req.session.selectedRespondentIndex];
      selectedRespondent.et3ResponseEmployerClaimDocument = et3ResponseEmployerClaimDocument;
      selectedRespondent.et3ResponseEmployerClaimDocumentBinaryUrl = et3ResponseEmployerClaimDocumentBinaryUrl;
      selectedRespondent.et3ResponseEmployerClaimDocumentUrl = et3ResponseEmployerClaimDocumentUrl;
      selectedRespondent.et3ResponseEmployerClaimDocumentCategoryId = et3ResponseEmployerClaimDocumentCategoryId;
      selectedRespondent.et3ResponseEmployerClaimDocumentFileName = et3ResponseEmployerClaimDocumentFileName;
      selectedRespondent.et3ResponseEmployerClaimDocumentUploadTimestamp =
        et3ResponseEmployerClaimDocumentUploadTimestamp;
    };
    it('does not reset employers contract claim when there is no user case in request', () => {
      request.session.userCase = undefined;
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      expect(request.session.userCase).toStrictEqual(undefined);
    });
    it('resets user case employer contract claim when request has user case', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithId);
      setUserCaseEt3EmployerClaimDetails(request);
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('resets user case employer contract claim when request has user case and selected respondent', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      setUserCaseEt3EmployerClaimDetails(request);
      setUserCaseSelectedRespondentEt3EmployerClaimDetails(request);
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('resets user case employer contract claim when request has user case but user case not has any employer claim details', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      setUserCaseSelectedRespondentEt3EmployerClaimDetails(request);
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('should not remove employer contract claim document from document collection when there is no uploaded document', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.documentCollection = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      setUserCaseSelectedRespondentEt3EmployerClaimDetails(request);
      request.session.userCase.respondents[request.session.selectedRespondentIndex].et3ResponseEmployerClaimDocument =
        undefined;
      setUserCaseEt3EmployerClaimDetails(request);
      request.session.userCase.et3ResponseEmployerClaimDocument = undefined;
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toContain(mockDocumentTypeItemFromMockDocumentUploadResponse);
    });
    it('should not remove employer contract claim document from document collection when uploaded document name not matches with the file name in the document collection', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      request.session.userCase.documentCollection = [mockDocumentTypeItemFromMockDocumentUploadResponse];
      setUserCaseSelectedRespondentEt3EmployerClaimDetails(request);
      setUserCaseEt3EmployerClaimDetails(request);
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toContain(mockDocumentTypeItemFromMockDocumentUploadResponse);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
    it('should remove employer contract claim document from document collection when uploaded document name matches with the file name in the document collection', () => {
      request.session.userCase = _.cloneDeep(mockValidCaseWithIdWithFullRespondentDetails);
      request.session.selectedRespondentIndex = 0;
      const documentTypeItem = _.cloneDeep(mockDocumentTypeItemFromMockDocumentUploadResponse);
      documentTypeItem.value.uploadedDocument.document_filename = et3ResponseEmployerClaimDocumentFileName;
      request.session.userCase.documentCollection = [documentTypeItem];
      setUserCaseEt3EmployerClaimDetails(request);
      setUserCaseSelectedRespondentEt3EmployerClaimDetails(request);
      EmployersContractClaimControllerHelper.resetEmployersContractClaimDetails(request);
      const selectedRespondent = request.session.userCase.respondents[request.session.selectedRespondentIndex];
      expect(expectResultsForSelectedRespondent(selectedRespondent)).toStrictEqual(true);
      expect(request.session.userCase.documentCollection).toHaveLength(DefaultValues.NUMBER_ZERO);
      expect(expectResultsForUserCase(request.session.userCase)).toStrictEqual(true);
    });
  });
});
