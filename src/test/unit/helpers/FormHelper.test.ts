import { CaseWithId } from '../../../main/definitions/case';
import { DefaultValues } from '../../../main/definitions/constants';
import { FormField, FormFields } from '../../../main/definitions/form';
import { assignAddresses, assignFormData, trimFormData } from '../../../main/helpers/FormHelper';
import { MockCaseWithIdConstants, mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { mockFormField } from '../mocks/mockForm';

const testFormFieldIdForAssignFormData: FormField = mockFormField(
  'id',
  'id',
  'text',
  MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  undefined,
  'submissionReference'
);

const testFormFieldCreatedDateForAssignFormData: FormField = mockFormField(
  'createdDate',
  'createdDate',
  'text',
  DefaultValues.STRING_EMPTY,
  undefined,
  'Created Date'
);

const testFormFieldLastModifiedForAssignFormData: FormField = mockFormField(
  'lastModified',
  'lastModified',
  'text',
  DefaultValues.STRING_EMPTY,
  undefined,
  'Last Modified'
);
const testFormFieldStateForAssignFormData: FormField = mockFormField(
  'state',
  'state',
  'text',
  undefined,
  undefined,
  'State'
);
const testFormFieldRespondentNameForAssignFormData: FormField = mockFormField(
  'respondentName',
  'respondentName',
  'text',
  MockCaseWithIdConstants.TEST_RESPONDENT_NAME,
  undefined,
  'Respondent Name'
);
const testFormFieldFirstNameForAssignFormData: FormField = mockFormField(
  'firstName',
  'firstName',
  'text',
  MockCaseWithIdConstants.TEST_CLAIMANT_NAME,
  undefined,
  'Claimant First Name(s)'
);
const testFormFieldLastNameForAssignFormData: FormField = mockFormField(
  'lastName',
  'lastName',
  'text',
  MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME,
  undefined,
  'Claimant Last Name'
);

const formFields: FormFields = {
  testFormFieldIdForAssignFormData,
  testFormFieldCreatedDateForAssignFormData,
  testFormFieldLastModifiedForAssignFormData,
  testFormFieldStateForAssignFormData,
  testFormFieldRespondentNameForAssignFormData,
  testFormFieldFirstNameForAssignFormData,
  testFormFieldLastNameForAssignFormData,
};

describe('Form Helper Test', () => {
  it('should assign form data to userCase which has CaseWithId type', async () => {
    const userCase: CaseWithId = mockValidCaseWithId;
    assignFormData(userCase, formFields);
    expect(userCase).toEqual(mockValidCaseWithId);
  });
  it('should not assign form data to userCase when session userCase is undefined', async () => {
    const userCase: CaseWithId = undefined;
    assignFormData(userCase, formFields);
    expect(userCase).toBeUndefined();
  });
  it('should not assign form data to userCase when session userCase is empty', async () => {
    const userCase: CaseWithId = <CaseWithId>{};
    assignFormData(userCase, formFields);
    expect(userCase).toEqual(<CaseWithId>{});
  });
  it('should not assign form data to userCase when form fields are empty', async () => {
    const userCase: CaseWithId = <CaseWithId>{};
    assignFormData(userCase, <FormFields>{});
    expect(userCase).toEqual(<CaseWithId>{});
  });
  it('should not trim form data', async () => {
    const userCase: CaseWithId = mockValidCaseWithId;
    userCase.respondentName = 'Dummy respondent name        ';
    const expectedRespondentName = 'Dummy respondent name';
    trimFormData(userCase);
    expect(userCase.respondentName).toEqual(expectedRespondentName);
  });
  it('should assign form fields even if user case is empty', async () => {
    const userCase: CaseWithId = undefined;
    assignAddresses(userCase, formFields);
    expect(userCase).toEqual(undefined);
  });
});
