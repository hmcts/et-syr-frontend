import { CaseApiDataResponse } from '../../../../main/definitions/api/caseApiResponse';
import { CaseWithId } from '../../../../main/definitions/case';
import { DefaultValues } from '../../../../main/definitions/constants';
import SelfAssignmentFormControllerHelper from '../../../../main/helpers/controller/SelfAssignmentFormControllerHelper';
import {
  MockCaseApiDataResponseConstants,
  mockCaseApiDataResponseForSelfAssignment,
} from '../../mocks/mockCaseApiDataResponse';
import { MockCaseWithIdConstants, mockInvalidCaseWithId, mockValidCaseWithId } from '../../mocks/mockCaseWithId';
import { mockRequest } from '../../mocks/mockRequest';

describe('Should generate basic user case with the input values of the self assignment form data', () => {
  it('given form data should return a CaseWithId object', () => {
    const formData: Partial<CaseWithId> = mockValidCaseWithId;
    const actualValue: CaseWithId =
      SelfAssignmentFormControllerHelper.generateBasicUserCaseBySelfAssignmentFormData(formData);
    expect(actualValue.id).toEqual(MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER);
    expect(actualValue.respondentName).toEqual(MockCaseWithIdConstants.TEST_RESPONDENT_NAME);
    expect(actualValue.firstName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_NAME);
    expect(actualValue.lastName).toEqual(MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME);
  });
});

describe('Should respondent name to the session userCase object when there value exists in user data', () => {
  const t = {
    'self-assignment-case-reference-number': {},
    common: {},
  };
  it('given form data should set respondent name to session userCase object', () => {
    const request = mockRequest({ t });
    request.session.userCase = mockInvalidCaseWithId;
    SelfAssignmentFormControllerHelper.setRespondentName(request, mockCaseApiDataResponseForSelfAssignment);
    expect(request.session.userCase.respondentName).toEqual(MockCaseApiDataResponseConstants.TEST_RESPONDENT_NAME);
  });
  it('given form data should not set respondent name to session userCase object when userCase is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, mockCaseApiDataResponseForSelfAssignment);
    expect(request.session.userCase).toBeUndefined();
  });
  it('should not set respondent name to session userCase object when caseData is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    SelfAssignmentFormControllerHelper.setRespondentName(request, undefined);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not set respondent name to session when respondent collection respondent name is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    const caseApiDataResponse: CaseApiDataResponse = mockCaseApiDataResponseForSelfAssignment;
    caseApiDataResponse.case_data.respondentCollection[0].value.respondent_name = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, caseApiDataResponse);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not set respondent name to session when respondent collection respondent value is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    const caseApiDataResponse: CaseApiDataResponse = mockCaseApiDataResponseForSelfAssignment;
    caseApiDataResponse.case_data.respondentCollection[0].value = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, caseApiDataResponse);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not set respondent name to session when respondent collection respondent is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    const caseApiDataResponse: CaseApiDataResponse = mockCaseApiDataResponseForSelfAssignment;
    caseApiDataResponse.case_data.respondentCollection[0] = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, caseApiDataResponse);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not set respondent name to session when caseData.case_data respondent collection is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    const caseApiDataResponse: CaseApiDataResponse = mockCaseApiDataResponseForSelfAssignment;
    caseApiDataResponse.case_data.respondentCollection = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, caseApiDataResponse);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not set respondent name to session userCase object when caseData.case_data is undefined', () => {
    const request = mockRequest({ t });
    request.session.userCase.respondentName = DefaultValues.STRING_EMPTY;
    const caseApiDataResponse: CaseApiDataResponse = mockCaseApiDataResponseForSelfAssignment;
    caseApiDataResponse.case_data = undefined;
    SelfAssignmentFormControllerHelper.setRespondentName(request, caseApiDataResponse);
    expect(request.session.userCase.respondentName).toEqual(DefaultValues.STRING_EMPTY);
  });
});
