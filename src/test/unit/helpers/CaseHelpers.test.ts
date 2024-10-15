import { nextTick } from 'process';

import axios, { AxiosResponse } from 'axios';

import { Form } from '../../../main/components/form';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId } from '../../../main/definitions/case';
import { DefaultValues, FieldsToReset, GenericTestConstants } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { FormContent, FormFields } from '../../../main/definitions/form';
import { handleUpdateDraftCase, handleUpdateHubLinksStatuses, resetFields } from '../../../main/helpers/CaseHelpers';
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

describe('handle update hub links statuses', () => {
  it('should successfully update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockResolvedValueOnce(
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
    await handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);
    expect(mockLogger.info).toHaveBeenCalledWith('Updated hub links statuses for case: testUserCaseId');
  });

  it('should catch failure when update hub links statuses', async () => {
    caseApi.updateHubLinksStatuses = jest.fn().mockRejectedValueOnce({ message: 'test error' });

    const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
    await handleUpdateHubLinksStatuses(req, mockLogger);
    await new Promise(nextTick);

    expect(mockLogger.error).toHaveBeenCalledWith('test error');
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
