import axios, { AxiosResponse } from 'axios';

import { Form } from '../../../main/components/form';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId } from '../../../main/definitions/case';
import { DefaultValues, FieldsToReset, GenericTestConstants } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { FormContent, FormFields } from '../../../main/definitions/form';
import { handleUpdateDraftCase, resetFields, setUserCase } from '../../../main/helpers/CaseHelpers';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { isFieldFilledIn } from '../../../main/validators/validator';
import { mockSession } from '../mocks/mockApp';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockLogger } from '../mocks/mockLogger';
import { mockRequest } from '../mocks/mockRequest';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
caseApi.getUserCase = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');

mockClient.mockReturnValue(caseApi);

describe('handle update draft case', () => {
  it('should successfully save case draft', () => {
    caseApi.updateDraftCase = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          created_date: '2022-08-19T09:19:25.79202',
          last_modified: '2022-08-19T09:19:25.817549',
          state: CaseState.DRAFT,
          case_data: {},
        },
      } as AxiosResponse<CaseApiDataResponse>)
    );
    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    handleUpdateDraftCase(req, mockLogger);
    expect(req.session.userCase).toBeDefined();
  });
});

describe('reset fields', () => {
  const mockedFormContents: FormContent = {
    fields: {
      textField1: {
        type: 'text1',
        value: 'Test text value 1',
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
      textField2: {
        type: 'text2',
        value: 'Test text value 2',
        validator: jest.fn().mockImplementation(isFieldFilledIn),
      },
    },
    submit: {
      text: l => l.continue,
    },
  };
  const form: Form = new Form(<FormFields>mockedFormContents.fields);
  const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
  req.body = mockCaseWithIdWithRespondents;
  it('should reset fields when form data field name matches with fields to reset', async () => {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    formData.et3ResponsePensionCorrectDetails = GenericTestConstants.TEST_FIELD_VALUE;
    resetFields(formData, [FieldsToReset.ET3_RESPONSE_PENSION_CORRECT_DETAILS]);
    expect(formData.et3ResponsePensionCorrectDetails).toEqual(DefaultValues.STRING_EMPTY);
  });
  it('should not reset fields when form data field name not matches with fields to reset', async () => {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    formData.et3ResponsePensionCorrectDetails = GenericTestConstants.TEST_FIELD_VALUE;
    resetFields(formData, [FieldsToReset.TEST_DUMMY_FIELD_NAME]);
    expect(formData.et3ResponsePensionCorrectDetails).toEqual(GenericTestConstants.TEST_FIELD_VALUE);
  });
  it('should not reset fields when fields to reset is empty', async () => {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    formData.et3ResponsePensionCorrectDetails = GenericTestConstants.TEST_FIELD_VALUE;
    resetFields(formData, []);
    expect(formData.et3ResponsePensionCorrectDetails).toEqual(GenericTestConstants.TEST_FIELD_VALUE);
  });
  it('should not reset fields when fields to reset is undefined', async () => {
    const formData = form.getParsedBody<CaseWithId>(req.body, form.getFormFields());
    formData.et3ResponsePensionCorrectDetails = GenericTestConstants.TEST_FIELD_VALUE;
    resetFields(formData, undefined);
    expect(formData.et3ResponsePensionCorrectDetails).toEqual(GenericTestConstants.TEST_FIELD_VALUE);
  });
});

describe('setUserCase', () => {
  let req: ReturnType<typeof mockRequest>;
  const formData: Partial<CaseWithId> = {
    et3ResponsePensionCorrectDetails: 'Some incorrect details',
  };

  beforeEach(() => {
    req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
  });

  it('should initialize userCase if it is undefined in the session', () => {
    setUserCase(req, formData, []);
    expect(req.session.userCase).toBeDefined();
    expect(req.session.userCase).toEqual(expect.objectContaining(formData));
  });

  it('should not reset any fields if fieldsToReset is empty', () => {
    setUserCase(req, formData, []);
    expect(req.session.userCase.et3ResponsePensionCorrectDetails).toEqual('Some incorrect details');
  });

  it('should handle undefined fieldsToReset gracefully', () => {
    setUserCase(req, formData, undefined);
    expect(req.session.userCase.et3ResponsePensionCorrectDetails).toEqual('Some incorrect details');
  });
});
