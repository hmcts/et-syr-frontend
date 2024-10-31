import { Form } from '../../../main/components/form';
import { DefaultValues } from '../../../main/definitions/constants';
import { FormField, FormFields, ValidationCheck } from '../../../main/definitions/form';

import { MockCaseWithIdConstants } from './mockCaseWithId';
export const mockForm = (fields: Record<string, FormField>): Form => {
  return new Form(fields);
};

export const mockFormField = (
  id: string,
  name: string,
  type: string,
  value: string | number,
  validator: ValidationCheck,
  label: string
): FormField => {
  return {
    id,
    name,
    type,
    value,
    validator,
    label,
  };
};

export const mockValidationCheckWithRequiredError = (): ValidationCheck => {
  return jest.fn().mockReturnValue('required');
};

export const mockValidationCheckWithOutError = (): ValidationCheck => {
  return jest.fn().mockReturnValue(undefined);
};

export const testFormFieldIdForAssignFormData: FormField = mockFormField(
  'id',
  'id',
  'text',
  MockCaseWithIdConstants.TEST_SUBMISSION_REFERENCE_NUMBER,
  undefined,
  'submissionReference'
);

export const testFormFieldCreatedDateForAssignFormData: FormField = mockFormField(
  'createdDate',
  'createdDate',
  'text',
  DefaultValues.STRING_EMPTY,
  undefined,
  'Created Date'
);

export const testFormFieldLastModifiedForAssignFormData: FormField = mockFormField(
  'lastModified',
  'lastModified',
  'text',
  DefaultValues.STRING_EMPTY,
  undefined,
  'Last Modified'
);
export const testFormFieldStateForAssignFormData: FormField = mockFormField(
  'state',
  'state',
  'text',
  undefined,
  undefined,
  'State'
);
export const testFormFieldRespondentNameForAssignFormData: FormField = mockFormField(
  'respondentName',
  'respondentName',
  'text',
  MockCaseWithIdConstants.TEST_RESPONDENT_NAME,
  undefined,
  'Respondent Name'
);
export const testFormFieldFirstNameForAssignFormData: FormField = mockFormField(
  'firstName',
  'firstName',
  'text',
  MockCaseWithIdConstants.TEST_CLAIMANT_NAME,
  undefined,
  'Claimant First Name(s)'
);
export const testFormFieldLastNameForAssignFormData: FormField = mockFormField(
  'lastName',
  'lastName',
  'text',
  MockCaseWithIdConstants.TEST_CLAIMANT_SURNAME,
  undefined,
  'Claimant Last Name'
);

export const formFields: FormFields = {
  testFormFieldIdForAssignFormData,
  testFormFieldCreatedDateForAssignFormData,
  testFormFieldLastModifiedForAssignFormData,
  testFormFieldStateForAssignFormData,
  testFormFieldRespondentNameForAssignFormData,
  testFormFieldFirstNameForAssignFormData,
  testFormFieldLastNameForAssignFormData,
};

export const mockedForm: Form = new Form(<FormFields>formFields);
