import axios from 'axios';

import { JavaApiUrls } from '../../../main/definitions/constants';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';

const token = 'testToken';

jest.mock('config');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const api = new CaseApi(mockedAxios);

describe('Retrieve individual case', () => {
  it('Should call java api for case id', async () => {
    const caseId = '12334578';
    await api.getUserCase(caseId);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      JavaApiUrls.GET_CASE,
      expect.objectContaining({
        case_id: caseId,
      })
    );
  });
});

describe('getCaseApi', () => {
  test('should create a CaseApi', () => {
    expect(getCaseApi(token)).toBeInstanceOf(CaseApi);
  });
});
