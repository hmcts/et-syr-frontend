import { CaseWithId } from '../../../main/definitions/case';
import { FormFields } from '../../../main/definitions/form';
import { assignAddresses, assignFormData, trimFormData } from '../../../main/helpers/FormHelper';
import { mockValidCaseWithId } from '../mocks/mockCaseWithId';
import { formFields } from '../mocks/mockForm';

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
